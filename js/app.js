(function () {
  'use strict';
  const D = window.MoversData;
  const S = window.MoversStore;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const isCustomAvatar = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
  const avatarContent = (avatar, label = 'Avatar') => isCustomAvatar(avatar) ? `<img src="${esc(avatar)}" alt="${esc(label)}">` : esc(avatar);
  const skillKeys = Object.keys(D.skills);
  let learnerChosen = false;
  let route = 'home', selectedWeek = S.state.currentWeek, selectedDay = S.state.currentDay;
  let session = restoreSession(), lastResult = null, historicalResult = null, practiceSkill = 'vocabulary', practiceWeek = S.state.currentWeek, timer = null, audioTimer = null, audioRun = 0, speechVoices = [];
  function restoreSession() {
    const saved = S.state.activeSession;
    if (!saved || saved.finished || !['lesson', 'practice', 'flashcards', 'quiz', 'weekly', 'mock', 'random', 'review'].includes(saved.kind)) return null;
    const items = saved.kind === 'flashcards' ? saved.cards : saved.questions;
    if (!Array.isArray(items) || !items.length || !Number.isInteger(saved.index) || saved.index < 0 || saved.index >= items.length || !Array.isArray(saved.responses)) return null;
    if (saved.kind === 'flashcards') {
      const words = new Map(D.vocabulary.map(v => [v.id, v]));
      if (items.some(q => !words.has(q.id))) return null;
      saved.cards = items.map(q => words.get(q.id));
    } else {
      if (items.some(q => !D.allQuestions[q.id])) return null;
      saved.questions = items.map(q => D.allQuestions[q.id]);
    }
    return saved;
  }
  function persistSession() { S.state.activeSession = session && !session.finished ? session : null; S.save(); }
  function adoptProfile() {
    stopAudio(); clearInterval(timer);
    session = restoreSession(); lastResult = historicalResult = null;
    selectedWeek = practiceWeek = S.state.currentWeek; selectedDay = S.state.currentDay;
    practiceSkill = 'vocabulary'; learnerChosen = true;
    closeModal();
    if (location.hash !== '#home') location.hash = 'home'; else navigate();
  }
  function selectLearner(id) {
    try {
      if (learnerChosen && !S.conflict) persistSession();
      S.selectProfile(id); adoptProfile();
    } catch (error) { toast(error.message); }
  }
  function avatarOptions(selected) {
    return `<fieldset class="avatar-options"><legend>Chọn bạn đồng hành</legend>${S.avatars.map((a, i) => `<label><input type="radio" name="learner-avatar" value="${a}" ${a === selected ? 'checked' : ''}><span role="img" aria-label="${['Cú mèo', 'Cáo', 'Gấu trúc', 'Mèo', 'Cá heo', 'Thỏ', 'Hổ', 'Koala'][i]}">${a}</span></label>`).join('')}<label class="avatar-upload"><input type="file" id="avatar-upload" accept="image/png,image/jpeg,image/webp" aria-label="Tải ảnh làm avatar"><span id="avatar-upload-preview">${isCustomAvatar(selected) ? avatarContent(selected, 'Ảnh avatar hiện tại') : '＋'}</span><small>Ảnh</small></label></fieldset><p class="avatar-help">Hoặc chọn ảnh PNG, JPG hay WebP. Ảnh sẽ được căn giữa thành avatar tròn và chỉ lưu trong hồ sơ này.</p>`;
  }
  function prepareAvatar(file) {
    return new Promise((resolve, reject) => {
      if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return reject(new Error('Chọn ảnh PNG, JPG hoặc WebP nhé.'));
      if (file.size > 5 * 1024 * 1024) return reject(new Error('Chọn ảnh nhỏ hơn 5 MB nhé.'));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Không đọc được ảnh này.'));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error('Ảnh này không mở được.'));
        image.onload = () => {
          const canvas = document.createElement('canvas'), size = 160, scale = Math.max(size / image.naturalWidth, size / image.naturalHeight), width = image.naturalWidth * scale, height = image.naturalHeight * scale;
          canvas.width = canvas.height = size;
          const context = canvas.getContext('2d');
          context.imageSmoothingQuality = 'high';
          context.drawImage(image, (size - width) / 2, image.naturalHeight > image.naturalWidth ? (size - height) * .22 : (size - height) / 2, width, height);
          const value = canvas.toDataURL('image/jpeg', .84);
          if (value.length > 140000) return reject(new Error('Không thể nén ảnh đủ nhỏ để lưu an toàn. Thử ảnh khác nhé.'));
          resolve(value);
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  async function uploadAvatar(input) {
    try {
      const value = await prepareAvatar(input.files[0]), form = input.closest('form'), preview = form.querySelector('#avatar-upload-preview');
      form.dataset.customAvatar = value;
      form.querySelectorAll('[name="learner-avatar"]').forEach(r => r.checked = false);
      const image = document.createElement('img'); image.src = value; image.alt = 'Ảnh avatar đã chọn';
      preview.replaceChildren(image);
      toast('Đã chọn ảnh avatar. Nhấn Lưu để hoàn tất.');
    } catch (error) { input.value = ''; toast(error.message); }
  }
  const selectedAvatar = form => form.dataset.customAvatar || form.querySelector('[name="learner-avatar"]:checked')?.value;
  function learners() {
    stopAudio(); clearInterval(timer);
    const profiles = S.listProfiles();
    $('#app').innerHTML = `<main id="main" class="learner-picker" tabindex="-1"><a class="brand" href="#learners"><span class="brand-mark">🌱</span><span>little steps<span class="brand-sub">BIG LITTLE ADVENTURES</span></span></a><section class="picker-intro">${owl('small')}<p class="eyebrow">A LITTLE SPACE OF YOUR OWN</p><h1>Ai đang học hôm nay?</h1><p>Chọn tên của con để tiếp tục cuộc phiêu lưu.</p></section>${S.warning ? `<div class="storage-warning" role="alert">${esc(S.warning)}</div>` : ''}<div class="learner-grid">${profiles.map(p => `<button class="learner-card ${learnerChosen && p.id === S.activeId ? 'selected' : ''}" data-action="select-learner" data-id="${esc(p.id)}"><span class="learner-avatar">${avatarContent(p.avatar, `Avatar của ${p.name}`)}</span><strong>${esc(p.name)}</strong><span class="learner-start">${learnerChosen && p.id === S.activeId ? 'Đang chọn · Tiếp tục' : 'Let’s learn'} ${icon('arrow', 17)}</span></button>`).join('')}<button class="learner-card add-learner" data-action="add-learner"><span class="learner-avatar">＋</span><strong>Thêm người học</strong><span>Một hành trình mới</span></button></div><p class="picker-note">Mỗi bạn có bài học, điểm và phần thưởng riêng.<br>Hồ sơ lưu trên trình duyệt này; mọi người dùng chung máy có thể chuyển hồ sơ.</p></main>`;
  }
  function addLearner() {
    modal('Một người bạn mới 🌱', `<form id="add-learner-form"><label class="answer-label" for="learner-name">Tên hoặc biệt danh</label><input id="learner-name" class="answer-input" maxlength="24" required placeholder="Ví dụ: An, Mai…" autocomplete="off">${avatarOptions('🦉')}<p class="muted">Con sẽ bắt đầu với tiến độ riêng. Hồ sơ của các bạn khác vẫn được giữ nguyên.</p><button class="btn primary" type="submit">Tạo hồ sơ & bắt đầu →</button></form>`);
  }
  const icon = (name, size = 22) => {
    const paths = {home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>', learn: '<path d="M3 4h6a4 4 0 0 1 3 1.5A4 4 0 0 1 15 4h6v15h-6a4 4 0 0 0-3 1.5A4 4 0 0 0 9 19H3zM12 6v14"/>', practice: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>', progress: '<path d="M4 20V12M12 20V5M20 20V9M2 21h20"/>', arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>', check: '<path d="m5 12 4 4L19 6"/>', headphones: '<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h5v-7zm16 0h2v7h-5v-7z"/>', settings: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>', review: '<path d="M4 4v6h6M4 10a8 8 0 1 1 0 5"/>', test: '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM9 11h6M9 16h6"/>', volume: '<path d="M3 9h4l5-4v14l-5-4H3zm13-2a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>'};
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.learn}</svg>`;
  };
  const button = (text, action, cls = 'primary', attrs = '') => `<button type="button" class="btn ${cls}" data-action="${action}" ${attrs}>${text}</button>`;
  const bar = (value, cls = '') => `<div class="progress-track ${cls}" role="progressbar" aria-label="Tiến độ" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><span style="width:${value}%"></span></div>`;
  function owl(size = 'large') {
    return `<svg class="owl ${size}" viewBox="0 0 240 245" fill="none" aria-hidden="true"><ellipse cx="119" cy="229" rx="76" ry="9" fill="#143d31" opacity=".15"/><path d="M73 196v25m25-20v21m49-21v20m22-26v25" stroke="#e8ae5a" stroke-width="10" stroke-linecap="round"/><path d="M48 73 43 28l47 24c19-9 44-9 62 0l45-24-4 46c25 26 26 61 11 94-12 31-46 45-84 45s-71-14-84-45c-14-33-13-67 12-95Z" fill="#b8d581"/><path d="M45 112c-24 12-32 49-10 70l27-33m133-37c24 12 32 49 10 70l-27-33" fill="#8eaf5e"/><path d="M59 73c17-14 43-10 61 7 18-17 44-21 61-7 21 19 19 56-2 72-20 16-43 6-59-8-16 14-39 24-59 8-21-16-23-53-2-72" fill="#fff9de"/><ellipse cx="85" cy="108" rx="13" ry="17" fill="#254535"/><ellipse cx="155" cy="108" rx="13" ry="17" fill="#254535"/><circle cx="89" cy="103" r="4" fill="white"/><circle cx="159" cy="103" r="4" fill="white"/><path d="m110 129 10 15 10-15" fill="#dc9950"/><path d="m104 166 7 7 8-7m5 20 7 7 8-7m-45 0 7 7 8-7m18-27 7 7 8-7" stroke="#8eaf5e" stroke-width="4" stroke-linecap="round"/><path d="m60 177 58 13v37l-58-14zm118 0-58 13v37l58-14z" fill="#f9f4da"/><path d="m67 186 42 10m-42-1 42 10m62-19-42 10m42-1-42 10" stroke="#d3c9a3" stroke-width="3"/><path d="M120 190v37" stroke="#e1d9b8" stroke-width="3"/></svg>`;
  }
  const lessonKey = (w, d, s) => `lesson-${w}-${d}-${s}`;
  function lessonSummary(w, day, skill) {
    const key = lessonKey(w, day, skill);
    if (S.state.completed[key]) return '✓ Completed';
    if (session && !session.finished && session.key === key) {
      const total = session.cards ? session.cards.length : session.questions.length;
      return `${session.cards ? session.index : session.responses.length}/${total} ${session.cards ? 'words' : 'activities'}`;
    }
    return skill === 'vocabulary' ? 'Từ mới & ôn lại' : skill === 'grammar' ? '5 activities' : '2 activities';
  }
  function weekProgress(w) { return Math.round(Object.keys(S.state.completed).filter(k => k.startsWith(`lesson-${w}-`)).length / 30 * 100); }
  function completedLessons() { return Object.keys(S.state.completed).filter(k => k.startsWith('lesson-')).length; }
  function accuracy(skill) {
    const a = Object.values(S.state.answers).filter(a => a.skill === skill);
    return a.length ? Math.round(a.filter(x => x.correct).length / a.length * 100) : null;
  }
  function weakSkills() { return skillKeys.filter(s => s !== 'speaking' && accuracy(s) !== null && accuracy(s) < 75).sort((a, b) => accuracy(a) - accuracy(b)); }
  function activeMistakes() { return Object.entries(S.state.mistakes).filter(([id, m]) => D.allQuestions[id] && !m.mastered); }
  function todaySkills() { return S.state.daily[S.dateKey()] || []; }
  function goalPercent() { return ['vocabulary', 'grammar', 'listening', 'reading'].filter(s => todaySkills().includes(s)).length * 25; }
  function nextLesson(w = selectedWeek, day = selectedDay) {
    for (let offset = 0; offset < 5; offset++) {
      const d = ((day - 1 + offset) % 5) + 1;
      const skill = skillKeys.find(s => !S.state.completed[lessonKey(w, d, s)]);
      if (skill) return {week: w, day: d, skill};
    }
    return {week: Math.min(w + 1, 8), day: 1, skill: 'vocabulary'};
  }
  function shell(content) {
    const total = Math.round(completedLessons() / 240 * 100);
    const navItems = [['home', 'Khám phá'], ['learn', 'Hành trình'], ['practice', 'Luyện tập'], ['progress', 'Tiến độ']];
    $('#app').innerHTML = `<aside class="sidebar"><a class="brand" href="#home" aria-label="Little Steps Home"><span class="brand-mark">🌱</span><span>little steps<span class="brand-sub">BIG LITTLE ADVENTURES</span></span></a><div class="course-label">YOUR LEARNING SPACE</div><nav aria-label="Menu chính">${navItems.map(([r, title]) => `<a href="#${r}" class="nav-item ${route === r || route === 'lesson' && r === 'learn' ? 'active' : ''}" ${route === r ? 'aria-current="page"' : ''}>${icon(r)}<span>${title}</span>${r === 'learn' ? '<span class="nav-tag">8</span>' : ''}</a>`).join('')}</nav><div class="sidebar-divider"></div><a href="#words" class="nav-item secondary-nav">📚 <span>Kho từ vựng</span></a><a href="#tests" class="nav-item secondary-nav ${route === 'tests' ? 'active' : ''}">${icon('test')}<span>My tests</span></a><a href="#review" class="nav-item secondary-nav ${route === 'review' ? 'active' : ''}">${icon('review')}<span>Review mistakes</span>${activeMistakes().length ? `<span class="count-bubble">${activeMistakes().length}</span>` : ''}</a><div class="sidebar-bottom"><div class="journey-mini"><div><span>My Movers journey</span><strong>${total}%</strong></div>${bar(total)}<small>Little by little, a lot becomes a little.</small></div><button class="profile-button" data-action="profile"><span class="avatar">${avatarContent(S.state.avatar, `Avatar của ${S.state.name}`)}</span><span><strong>${esc(S.state.name)}</strong><small>Young explorer · Grade 3</small></span>${icon('settings', 17)}</button></div></aside><div class="workspace"><header class="topbar"><div class="breadcrumb">My learning space <span>/</span> <strong>${({home: 'Overview', learn: '8-week adventure', practice: 'Practice studio', progress: 'My progress', tests: 'Test corner', review: 'Try, learn, grow', lesson: 'Learning time'})[route] || 'Learning time'}</strong></div><div class="top-stats"><span class="streak-pill">🔥 <strong>${S.streak()}</strong><span class="hide-small"> day streak</span></span><span class="star-pill">⭐ <strong>${S.state.stars}</strong></span><button class="avatar small" data-action="profile" aria-label="Hồ sơ: ${esc(S.state.name)}. Đổi người học hoặc quản lý tiến độ">${avatarContent(S.state.avatar, `Avatar của ${S.state.name}`)}</button></div></header>${S.warning ? `<div class="storage-warning" role="alert">${esc(S.warning)} ${button('Xuất tiến độ', 'export', 'text')} ${S.conflict ? button('Tải lại trang', 'reload', 'secondary') : ''}</div>` : ''}<main id="main" tabindex="-1">${content}</main><footer>Made for curious minds. <span>🌱</span> A1 Movers practice · Nội dung tự biên soạn, không phải sản phẩm chính thức của Cambridge.</footer></div>`;
  }
  function pageHeading(eyebrow, title, subtitle, extra = '') { return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subheading">${subtitle}</p></div>${extra}</div>`; }
  const A=window.MoversArt;
  const statusLabels={new:'Chưa khám phá',seen:'Đã khám phá',recognition:'Nhận biết được',spelling:'Viết đúng',review:'Cần ôn'};
  let bankLevel='movers',bankTopic='all',bankStatus='all',bankSearch='';
  function wordSummary() {
    const stats=S.wordStats();
    return `<div class="word-mastery">${['seen','recognition','spelling','review'].map(k=>`<div class="mastery-${k}"><strong>${stats[k]}</strong><span>${statusLabels[k]}</span></div>`).join('')}</div>`;
  }
  function adventureMap() {
    return `<div class="adventure-map">${A.worlds.map((world,i)=>`<button class="world-node ${i+1===S.state.currentWeek?'current':''}" data-action="week" data-week="${i+1}" aria-label="Tuần ${i+1}: ${world[0]}, hoàn thành ${weekProgress(i+1)} phần trăm">${A.landscape(i+1)}<div class="world-node-copy"><span class="world-number">${weekProgress(i+1)===100?'✓':i+1}</span><div><strong>${world[0]}</strong><small>Tuần ${i+1} · ${weekProgress(i+1)}% bài học</small></div></div>${bar(weekProgress(i+1))}</button>`).join('')}</div>`;
  }
  function stickerShelf() {
    const stats=S.wordStats();
    return `<section class="sticker-shelf"><div class="section-title"><div><p class="eyebrow">NHỮNG ĐIỀU CON LÀM ĐƯỢC</p><h2>Sổ sticker của con</h2></div><a href="#progress" class="text-link">Xem tiến độ →</a></div><div class="stickers">${[['book','Bạn của sách',completedLessons()>=1,'Hoàn thành 1 bài'],['apple','Chăm khám phá',S.state.learnedWords.length>=10,'Khám phá 10 từ'],['penguin','Đôi tai tinh',Object.values(S.state.wordProgress).filter(p=>p.recognition>0).length>=10,'Nhận biết đúng 10 từ'],['flower','Ngòi bút nhỏ',Object.values(S.state.wordProgress).filter(p=>p.spelling>0).length>=10,'Viết đúng 10 từ']].map(([pic,name,earned,desc])=>`<div class="sticker ${earned?'earned':''}">${A.picture(pic)}<strong>${name}</strong><small>${earned?'✓ Đã nhận':desc}</small></div>`).join('')}</div><p class="muted">Luyện lại từ khó cũng là một bước tiến. Con không cần giữ chuỗi ngày để giữ sticker.</p></section>`;
  }
  function home() {
    const next=nextLesson(S.state.currentWeek,S.state.currentDay),world=A.worlds[S.state.currentWeek-1],percent=goalPercent();
    shell(`${pageHeading('CÙNG CÚ NHỎ KHÁM PHÁ',`Chào ${esc(S.state.name)}! <span class="wave">👋</span>`,'Một chút tiếng Anh, một điều mới mỗi ngày.')}<div class="adventure-home"><section class="quest-hero"><div class="quest-copy"><span class="pill">VÙNG ${S.state.currentWeek} / 8 · NGÀY ${next.day}</span><h2>${world[0]}</h2><p>${session?'Cú đang giữ chỗ cho con ở bài đang học. Mình tiếp tục nhé!':`Nhiệm vụ tiếp theo: ${D.skills[next.skill].vi.toLowerCase()}. Cùng thử nhé!`}</p>${button(session?'Tiếp tục bài đang học →':'Bắt đầu nhiệm vụ →','continue','primary')}<span class="quest-time">Mỗi hoạt động khoảng 5–8 phút · Nghỉ khi con cần</span></div><div class="quest-illustration">${A.landscape(S.state.currentWeek)}<div class="quest-owl">${owl()}<span>Cùng khám phá nhé!</span></div></div></section><section class="today-mission"><div class="section-title"><div><p class="eyebrow">TỪNG BƯỚC NHỎ HÔM NAY</p><h2>Nhiệm vụ của con</h2></div><span class="mission-count">${todaySkills().filter(s=>['vocabulary','grammar','listening','reading'].includes(s)).length}/4</span></div>${bar(percent)}<div class="mission-list">${['vocabulary','grammar','listening','reading'].map(skill=>`<button data-action="lesson" data-week="${next.week}" data-day="${next.day}" data-skill="${skill}" class="mission-item ${todaySkills().includes(skill)?'done':''}"><span>${D.skills[skill].emoji}</span><strong>${D.skills[skill].vi}</strong><span>${todaySkills().includes(skill)?'✓':'→'}</span></button>`).join('')}</div><p class="mission-reward">⭐ +20 sao khi hoàn thành đủ 4 mục hôm nay</p></section></div><section class="journey-section"><div class="section-title"><div><p class="eyebrow">HÀNH TRÌNH 8 TUẦN</p><h2>Con muốn khám phá đâu?</h2></div><a href="#learn" class="text-link">Lịch học →</a></div>${adventureMap()}</section><div class="two-columns"><section class="word-dashboard"><p class="eyebrow">KHO TỪ CỦA CON</p><h2>Từ mới hôm nay, bạn quen ngày mai</h2>${wordSummary()}<p>Đã xem thẻ và trả lời đúng được ghi nhận riêng. Con có thể ôn lại bất cứ lúc nào.</p><a href="#words" class="btn primary">Mở kho từ vựng →</a></section><section class="track-card"><p class="eyebrow">CÙNG BỐ MẸ CHỌN NHỊP HỌC</p><h2>Hành trình phù hợp với con</h2><label for="learning-track">Ưu tiên từ vựng trong bài hằng ngày</label><select id="learning-track"><option value="movers" ${S.state.learningTrack==='movers'?'selected':''}>Con đã học Starters · Luyện Movers</option><option value="foundation" ${S.state.learningTrack==='foundation'?'selected':''}>Con cần củng cố · Ôn Starters</option></select><p>Tuần 1–6 khám phá kho từ đã chọn; tuần 7–8 ưu tiên từ cần ôn và chưa viết đúng. Đây là lựa chọn của gia đình, không phải kết quả kiểm tra đầu vào.</p><small>Nếu nền tảng còn mới, có thể kéo dài lịch học. Hoàn thành 8 tuần không đồng nghĩa đã sẵn sàng thi.</small></section></div>${stickerShelf()}`);
  }
  function filteredWords() {
    const search=normalize(bankSearch);
    return D.wordBank.filter(v=>(bankLevel==='all'||v.level===bankLevel)&&(bankTopic==='all'||v.topic===bankTopic)&&(bankStatus==='all'||S.wordStatus(v.id)===bankStatus)&&(!search||[v.word,v.meaning,...v.aliases].some(t=>normalize(t).includes(search))));
  }
  function bankResults() {
    const words=filteredWords();
    return `<p class="bank-count" role="status">${words.length} mục từ phù hợp · Hiển thị tối đa 60 mục; tìm hoặc lọc để xem tiếp.</p><div class="word-bank-grid">${words.slice(0,60).map(v=>`<button class="bank-word" data-action="word-detail" data-id="${v.id}"><span class="bank-word-icon">${A.picture(v.word)||v.emoji||'📖'}</span><strong>${esc(v.word)}</strong><span>${esc(v.meaning)}</span><small class="status-${S.wordStatus(v.id)}">${statusLabels[S.wordStatus(v.id)]}</small></button>`).join('')}</div>${words.length?'':'<div class="empty-inline">Cú chưa tìm thấy từ phù hợp. Thử đổi bộ lọc nhé!</div>'}`;
  }
  function words() {
    shell(`${pageHeading('MỖI TỪ LÀ MỘT KHÁM PHÁ','Kho từ vựng của con',`${D.wordBank.length} mục từ và nghĩa · Starters, Movers và phần mở rộng.`)}${wordSummary()}<div class="bank-filters"><label>Tìm từ hoặc nghĩa<input id="bank-search" type="search" value="${esc(bankSearch)}" placeholder="Ví dụ: penguin, áo khoác…"></label><label>Nhóm từ<select id="bank-level">${[['movers','Movers trọng tâm'],['starters','Nền tảng Starters'],['extension','Mở rộng & biến thể'],['all','Tất cả']].map(([v,t])=>`<option value="${v}" ${v===bankLevel?'selected':''}>${t}</option>`).join('')}</select></label><label>Chủ đề<select id="bank-topic"><option value="all">Tất cả chủ đề</option>${Object.entries(D.wordTopics).map(([v,t])=>`<option value="${v}" ${v===bankTopic?'selected':''}>${t}</option>`).join('')}</select></label><label>Tiến độ<select id="bank-status"><option value="all">Tất cả trạng thái</option>${Object.entries(statusLabels).map(([v,t])=>`<option value="${v}" ${v===bankStatus?'selected':''}>${t}</option>`).join('')}</select></label></div><div class="bank-actions">${[['flashcards','🃏 Khám phá thẻ'],['meaning','🔎 Ghép từ với nghĩa'],['listen','🎧 Nghe và chọn'],['letters','🧩 Xếp chữ'],['spelling','✏️ Tự viết từ']].map(([mode,title])=>button(title,'bank-practice','secondary',`data-mode="${mode}"`)).join('')}</div><p class="muted">Mỗi lượt tối đa 10 từ theo bộ lọc, ưu tiên từ cần ôn và chưa luyện đúng. Xếp chữ là bài nhận biết; tự viết mới ghi nhận chính tả.</p><div id="bank-results">${bankResults()}</div><details class="info-details"><summary>Danh sách từ và cách tính tiến độ</summary><p>Một mục gồm từ/cụm từ và nghĩa được dạy. Biến thể Anh–Mỹ và dạng số nhiều được gộp; từ khác nghĩa có thể có mục riêng. Số và tên riêng được tính vào kho. Đây không phải số từ mới bắt buộc học trong 8 tuần.</p><p>Nhận biết và viết đúng dựa trên câu trả lời ở website, không phải chứng nhận đã thuộc lâu dài. Khi trả lời sai, từ chuyển sang Cần ôn; hai câu đúng tiếp theo giúp bỏ cờ này.</p><a href="${window.MoversLexicon.source}" target="_blank" rel="noopener noreferrer">Đối chiếu wordlist Cambridge 2025 ↗</a></details>`);
  }
  function bankPractice(mode) {
    const rank=v=>S.wordStatus(v.id)==='review'?0:mode==='spelling'&&!S.state.wordProgress[v.id]?.spelling?1:S.wordStatus(v.id)==='new'?2:3;
    const cards=filteredWords().sort((a,b)=>rank(a)-rank(b)||(S.state.wordProgress[a.id]?.lastSeen||'').localeCompare(S.state.wordProgress[b.id]?.lastSeen||'')).slice(0,10);
    if(!cards.length)return toast('Thử chọn nhóm từ khác nhé.');
    begin({kind:mode==='flashcards'?'flashcards':'practice',title:'Kho từ · '+({flashcards:'Khám phá',meaning:'Ghép nghĩa',listen:'Nghe và chọn',letters:'Xếp chữ',spelling:'Tự viết'}[mode]),...(mode==='flashcards'?{cards}:{questions:D.bankQuestions(cards,mode)}),skill:'vocabulary',key:'bank-'+mode+'-'+cards.map(v=>v.id).join('-')});
  }
  function wordDetail(id) {
    const v=D.wordById[id];if(!v)return;
    modal(v.word,`<div class="word-detail">${A.picture(v.word)||`<span class="flash-emoji">${v.emoji||'📖'}</span>`}<p>${esc(v.meaning)}</p>${v.example?`<p class="word-example">${esc(v.example)}</p>`:''}${v.aliases.length?`<small>Biến thể: ${v.aliases.map(esc).join(', ')}</small>`:''}<span class="pill">${statusLabels[S.wordStatus(v.id)]}</span></div><div class="modal-actions">${button('Nghe từ','word-audio','secondary',`data-id="${id}"`)}${button('Khám phá thẻ →','word-card','primary',`data-id="${id}"`)}</div><div id="audio-status" role="status"></div>`);
  }
  function learn() {
    const w = D.weeks[selectedWeek - 1];
    shell(`${pageHeading('YOUR LEARNING ROADMAP', 'Eight weeks. So many discoveries.', 'Tuần 1–6 khám phá từ theo nhóm đã chọn; tuần 7–8 ôn lại. Nghỉ giữa các bài và điều chỉnh nhịp theo con.')}<div class="week-selector">${D.weeks.map(w => `<button data-action="select-week" data-week="${w.number}" class="week-tile ${selectedWeek === w.number ? 'selected' : ''}" aria-pressed="${selectedWeek === w.number}"><span>${w.emoji}</span><strong>Week ${w.number}</strong><small>${weekProgress(w.number)}%</small>${bar(weekProgress(w.number))}</button>`).join('')}</div><section class="week-banner"><span class="week-banner-icon">${w.emoji}</span><div><p class="eyebrow">WEEK ${w.number} · ${esc(w.subtitle)}</p><h2>${esc(w.title)}</h2><p>${esc(w.description)}</p></div><div class="week-completion"><strong>${weekProgress(w.number)}%</strong><span>complete</span></div></section><div class="day-tabs" role="group" aria-label="Chọn ngày học">${[1, 2, 3, 4, 5].map(d => `<button class="${selectedDay === d ? 'selected' : ''}" data-action="day" data-day="${d}" aria-pressed="${selectedDay === d}">Day ${d} <span>${skillKeys.filter(s => S.state.completed[lessonKey(selectedWeek, d, s)]).length}/6</span></button>`).join('')}</div><div class="section-title"><h2>Day ${selectedDay} · A little of everything</h2><span class="muted">Học xong một bài, nghỉ mắt một chút.</span></div><div class="lesson-grid">${skillKeys.map(s => { const meta = D.skills[s], done = S.state.completed[lessonKey(selectedWeek, selectedDay, s)]; return `<article class="lesson-card"><span class="lesson-icon ${meta.color}">${meta.emoji}</span><div><h3>${meta.name}</h3><p>${s === 'grammar' ? esc(w.grammar.title) : meta.vi}</p><small>${s === 'vocabulary' ? '8–10 thẻ từ · 6–8 phút' : s === 'speaking' ? '3 hoạt động · Tự đánh giá · 7 phút' : s === 'writing' ? '3 hoạt động · 8 phút' : ['grammar', 'listening', 'reading'].includes(s) ? '5 hoạt động · 8 phút' : '3 hoạt động · 6 phút'}</small></div>${button(done ? 'Practise again ↗' : 'Let’s go →', 'lesson', done ? 'secondary' : 'primary', `data-week="${selectedWeek}" data-day="${selectedDay}" data-skill="${s}"`)}</article>`;}).join('')}</div><div class="two-columns"><section class="callout purple-soft"><span>⚡</span><div><h3>Daily mini quiz</h3><p>5 câu tổng hợp để nhớ điều vừa học.</p></div>${button('Start quiz', 'quiz', 'primary', `data-week="${selectedWeek}" data-day="${selectedDay}"`)}</section><section class="callout yellow-soft"><span>${selectedWeek === 8 ? '🏆' : '🎯'}</span><div><h3>${selectedWeek === 8 ? 'Ready for your mock tests?' : 'End-of-week check-in'}</h3><p>${selectedWeek === 8 ? 'Hai bài luyện tổng hợp đang chờ con.' : '20 câu · 5 kỹ năng · Không có áp lực.'}</p></div>${selectedWeek === 8 ? '<a href="#tests" class="btn primary">View tests</a>' : button('Weekly test', 'start-test', 'primary', `data-id="weekly-${selectedWeek}"`)}</section></div><details class="info-details"><summary>Nội dung và gợi ý của tuần</summary><p>${esc(w.grammar.explanation)}</p><div class="word-chips">${w.vocabulary.map(v => `<span>${v.emoji} ${esc(v.word)}</span>`).join('')}</div><p>Các từ bên trên thuộc bài tập chủ đề cũ. Bài Vocabulary hằng ngày dùng kho từ mở rộng theo nhịp học đã chọn. Mở Kho từ vựng để tìm, nghe và luyện toàn bộ danh sách.</p></details>`);
  }
  function selectors() { return `<div class="filter-bar"><label>Tuần học<select id="practice-week">${D.weeks.map(w => `<option value="${w.number}" ${w.number === practiceWeek ? 'selected' : ''}>Week ${w.number} · ${esc(w.title)}</option>`).join('')}</select></label><label>Kỹ năng<select id="practice-skill">${skillKeys.map(s => `<option value="${s}" ${s === practiceSkill ? 'selected' : ''}>${D.skills[s].name}</option>`).join('')}</select></label></div>`; }
  function practice() {
    const w = D.weeks[practiceWeek - 1], meta = D.skills[practiceSkill];
    const types = practiceSkill === 'vocabulary' ? [['flashcards', '🃏', 'Flashcards', 'Lật thẻ, nghe và đọc ví dụ'], ['meaning', '💭', 'Choose the meaning', 'Tìm nghĩa tiếng Việt'], ['word', '🔎', 'Choose the word', 'Nhìn gợi ý và chọn từ'], ['missing', '🧩', 'Missing letters', 'Điền đủ chữ còn thiếu'], ['spelling', '✏️', 'Spelling', 'Tự viết từ tiếng Anh'], ['sentence', '📖', 'Complete the sentence', 'Dùng từ trong ngữ cảnh']] : [['all', meta.emoji, `Practise ${meta.name}`, `${w[practiceSkill + 'Questions'].length} hoạt động · Có giải thích và gợi ý`]];
    shell(`${pageHeading('THE PRACTICE STUDIO', 'A little practice goes a long way.', 'Chọn điều con muốn luyện. Không giới hạn lượt thử, không cần làm theo thứ tự.')} ${selectors()}<section class="bank-invite"><span>📚</span><div><h2>Cả một thế giới từ mới</h2><p>Chọn chủ đề, nghe và xếp chữ trong kho Starters–Movers mở rộng.</p></div><a class="btn primary" href="#words">Mở kho từ →</a></section><div class="practice-grid">${types.map(([mode, emoji, title, desc]) => `<article class="practice-card"><span class="lesson-icon ${meta.color}">${emoji}</span><h2>${title}</h2><p>${desc}</p>${button('Start practising →', 'practice-start', 'primary', `data-mode="${mode}"`)}</article>`).join('')}</div><section class="note-panel"><strong>💡 A friendly little tip</strong><p>${practiceSkill === 'listening' ? 'Chọn giọng tiếng Anh có sẵn trên thiết bị. Bài nghe dùng giọng đọc tổng hợp; đây không phải audio đề Cambridge. Khi luyện, con có thể nghe lại nhiều lần.' : practiceSkill === 'speaking' ? 'Nói thành tiếng trước khi mở câu mẫu. Bố mẹ có thể nghe và góp ý; website chỉ ghi nhận lượt luyện, không chấm phát âm.' : practiceSkill === 'writing' ? 'Câu có đáp án cố định được kiểm tra tự động. Viết tranh và truyện dùng bảng tự kiểm tra, không chấm ngữ nghĩa tự động.' : 'Đọc kỹ câu hỏi, trả lời rồi xem giải thích. Một câu khó hôm nay có thể trở nên dễ hơn vào ngày mai.'}</p></section>`);
  }
  function badges() {
    const count = completedLessons(), words = S.state.learnedWords.length;
    const qualified = s => Object.values(S.state.answers).filter(a => a.skill === s && a.correct).length >= 20;
    return [
      {name: 'First Lesson', emoji: '🌱', desc: 'Hoàn thành bài học đầu tiên', earned: count >= 1},
      {name: '3 Day Streak', emoji: '🔥', desc: 'Học 3 ngày liên tiếp', earned: longestStreak() >= 3},
      {name: '7 Day Streak', emoji: '☀️', desc: 'Học 7 ngày liên tiếp', earned: longestStreak() >= 7},
      {name: '50 Words Explored', emoji: '🌳', desc: 'Khám phá 50 từ khác nhau', earned: words >= 50},
      {name: 'Vocabulary Star', emoji: '⭐', desc: '20 câu từ vựng đúng', earned: qualified('vocabulary')},
      {name: 'Grammar Hero', emoji: '🧩', desc: '20 câu ngữ pháp đúng', earned: qualified('grammar')},
      {name: 'Listening Star', emoji: '🎧', desc: '20 câu nghe đúng', earned: qualified('listening')},
      {name: 'Perfect Quiz', emoji: '💎', desc: 'Đúng toàn bộ một mini quiz', earned: S.state.history.some(h => h.kind === 'quiz' && h.score === h.total)},
      {name: 'Movers Champion', emoji: '🏆', desc: 'Hoàn thành 240 bài và 2 mock test', earned: count >= 240 && D.mockTests.every(t => S.state.history.some(h => h.id === t.id))}
    ];
  }
  function longestStreak() {
    let best = 0, run = 0, previous = '';
    [...new Set(S.state.activityDays)].sort().forEach(day => {
      const d = new Date(day + 'T12:00:00'); d.setDate(d.getDate() - 1);
      run = S.dateKey(d) === previous ? run + 1 : 1; best = Math.max(best, run); previous = day;
    });
    return best;
  }
  function progress() {
    const speakingCount = Object.keys(S.state.completed).filter(k => /^lesson-\d-\d-speaking$/.test(k)).length;
    const history = S.state.history.slice().reverse();
    shell(`${pageHeading('LOOK HOW FAR YOU’VE COME', 'Every little step counts.', 'Tiến độ lấy từ hoạt động con đã hoàn thành trên trình duyệt này.', button('↓ Xuất tiến độ', 'export', 'secondary'))}${wordSummary()}<a href="#words" class="text-link">Xem từng từ và ôn lại →</a><div class="stat-grid"><div class="stat-card"><span>⭐ Stars collected</span><strong>${S.state.stars}</strong></div><div class="stat-card"><span>🔥 Current streak</span><strong>${S.streak()} <small>days</small></strong></div><div class="stat-card"><span>📚 Lessons completed</span><strong>${completedLessons()} <small>/ 240</small></strong></div><div class="stat-card"><span>🌿 Words explored</span><strong>${S.state.learnedWords.length}</strong></div></div><div class="two-columns"><section class="panel"><h2>Your 8-week journey</h2>${D.weeks.map(w => `<div class="progress-row"><div><span>${w.emoji} Week ${w.number}</span><strong>${weekProgress(w.number)}%</strong></div>${bar(weekProgress(w.number))}<small>${esc(w.title)}</small></div>`).join('')}</section><section class="panel"><h2>Growing your skills</h2><p class="muted">Độ chính xác của câu trả lời gần nhất cho mỗi câu đã làm; không phải điểm thi Cambridge.</p>${skillKeys.map(s => {const value = s === 'speaking' ? Math.round(speakingCount / 40 * 100) : accuracy(s);return `<div class="progress-row"><div><span>${D.skills[s].emoji} ${D.skills[s].name}</span><strong>${value === null ? 'Chưa có dữ liệu' : value + '%'}</strong></div>${bar(value || 0, D.skills[s].color)}${s === 'speaking' ? '<small>Tiến độ luyện nói tự đánh giá, không phải độ chính xác.</small>' : ''}</div>`;}).join('')}<a href="#review" class="btn secondary">Review ${activeMistakes().length} tricky questions →</a></section></div><section class="panel badge-panel"><div class="section-title"><h2>Your little achievements</h2><span class="muted">${badges().filter(b => b.earned).length} / 9 unlocked</span></div><div class="badge-grid">${badges().map(b => `<div class="badge ${b.earned ? 'earned' : 'locked'}"><span>${b.emoji}</span><h3>${b.name}</h3><p>${b.desc}</p><small>${b.earned ? '✓ Earned' : 'Chưa mở khóa'}</small></div>`).join('')}</div></section><section class="panel"><h2>Quiz & test history</h2>${history.length ? `<div class="table-scroll"><table><thead><tr><th>Bài kiểm tra</th><th>Ngày</th><th>Kết quả</th><th>Chi tiết</th></tr></thead><tbody>${history.map(h => `<tr><td>${esc(h.title)}</td><td>${esc(h.date)}</td><td><strong>${h.score}/${h.total}</strong> · ${Math.round(h.score / h.total * 100)}%</td><td>${button('View result', 'history-result', 'text', `data-time="${h.time}"`)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-inline">🌱 Chưa có bài kiểm tra. Kết quả sẽ xuất hiện sau mini quiz đầu tiên.</div>'}</section>`);
  }
  function shuffled(items) {
    const result=items.slice();
    for(let i=result.length-1;i>0;i--) {const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function randomTest() {
    const skills=['vocabulary','grammar','listening','reading','writing'];
    const questions=skills.flatMap(skill=>shuffled(Object.values(D.allQuestions).filter(q=>q.skill===skill && ['choice','input'].includes(q.type))).slice(0,5));
    return {id:`random-${Date.now()}`, key:`random-${S.dateKey()}`, title:'Random Challenge', kind:'random', minutes:30, questions};
  }
  function tests() {
    const randomHistory=S.state.history.filter(h=>h.kind==='random');
    const latest=randomHistory.at(-1);
    shell(`${pageHeading('A FRIENDLY CHECK-IN', 'Show what you can do.', 'Bài luyện tự biên soạn giúp con tìm điểm mạnh và phần cần ôn.')}<section class="note-panel"><strong>Về bài kiểm tra trên website</strong><p>Weekly test: 20 câu. Mock test: 40 câu. Random Challenge: 25 câu được chọn mới mỗi lần, gồm 5 câu Vocabulary, Grammar, Listening, Reading và Writing có đáp án cố định. Các bài này theo trình độ A1, <strong>không mô phỏng đầy đủ cấu trúc đề Cambridge</strong> và không quy đổi ra khiên. Speaking luyện riêng ở Practice. Đồng hồ là gợi ý; hết giờ con vẫn được tiếp tục.</p><a class="text-link" href="https://www.cambridgeenglish.org/exams-and-tests/qualifications/young-learners/paper/movers/preparation/" target="_blank" rel="noopener noreferrer">Đề mẫu chính thức của Cambridge ↗</a></section><section class="random-test-card"><div><span class="random-dice" aria-hidden="true">🎲</span><p class="eyebrow">MỖI LẦN MỘT ĐỀ MỚI</p><h2>Random Challenge</h2><p>25 câu tự chấm · 5 kỹ năng · Gợi ý 30 phút. Câu hỏi được chọn ngẫu nhiên từ kho hiện có khi con bấm bắt đầu.</p>${latest?`<small>Lần gần nhất: ${latest.score}/${latest.total} · ${latest.date}</small>`:'<small>Chưa có lượt làm nào.</small>'}</div>${button('Tạo đề ngẫu nhiên →','random-test','primary')}</section><h2 class="standalone-title">The big little adventures</h2><div class="two-columns">${D.mockTests.map((t, i) => `<article class="mock-card ${i ? 'purple-soft' : 'green-soft'}"><span class="mock-number">0${i + 1}</span><span class="eyebrow">WEEK 8 · ${i ? 'TRY AGAIN, GROW AGAIN' : 'YOUR FIRST CHECK-IN'}</span><h2>${t.title}</h2><p>40 câu · 5 kỹ năng · Gợi ý 45 phút</p><p>${i ? 'Ôn câu sai và phần còn khó trước khi thử bộ câu thứ hai.' : 'Hít thở nhẹ, đọc kỹ và làm từng câu một.'}</p>${button('Start adventure →', 'start-test', 'primary', `data-id="${t.id}"`)}</article>`).join('')}</div><h2 class="standalone-title">Weekly check-ins</h2><div class="test-grid">${D.tests.map(t => {const last = S.state.history.filter(h => h.id === t.id).at(-1);return `<article class="test-card"><span>${D.weeks[t.week - 1].emoji}</span><h3>${t.title}</h3><p>20 câu · Gợi ý 25 phút</p><small>${last ? `Lần gần nhất: ${last.score}/${last.total}` : 'Một cơ hội để hiểu mình hơn.'}</small>${button(last ? 'Try again →' : 'Start test →', 'start-test', 'secondary', `data-id="${t.id}"`)}</article>`;}).join('')}</div>`);
  }
  function review() {
    const mistakes = activeMistakes(), mastered = Object.values(S.state.mistakes).filter(m => m.mastered).length;
    shell(`${pageHeading('TRY. LEARN. GROW.', 'A fresh start for tricky questions.', 'Trả lời đúng trong 2 lượt ôn riêng để đánh dấu Mastered.', mistakes.length ? button(`Practise again (${mistakes.length}) →`, 'review-start', 'primary') : '')}<div class="review-summary"><span>🌿 <strong>${mastered}</strong> mastered</span><span>🧩 <strong>${mistakes.length}</strong> ready to practise</span></div>${mistakes.length ? `<div class="mistake-grid">${mistakes.map(([id, m]) => {const q = D.allQuestions[id];return `<article class="mistake-card"><div class="section-title"><span class="pill">${D.skills[q.skill].emoji} ${D.skills[q.skill].name} · Week ${q.week}</span><small>${m.correctRuns}/2 lượt đúng</small></div><h3>${esc(q.prompt)}</h3><p class="previous-answer">Lần trước con viết: <span>${esc(m.response || '(chưa trả lời)')}</span></p><p class="correct-answer">✓ ${esc(q.answer)}</p><p class="muted">${esc(q.explanation)}</p></article>`;}).join('')}</div>` : `<section class="empty-state">${owl('small')}<h2>${mastered ? 'Look at you growing!' : 'A clean little slate.'}</h2><p>${mastered ? 'Con đã ôn vững các câu đang lưu. Tiếp tục khám phá bài mới nhé.' : 'Những câu con cần luyện thêm sẽ được lưu ở đây sau khi làm bài.'}</p><a href="#practice" class="btn primary">Explore practice →</a></section>`}`);
  }
  function sceneHTML(scene) {
    if (!scene) return '';
    if (scene.kind === 'story') return `<div class="story-panels" aria-label="Chuỗi bốn tranh">${scene.panels.map(([emojis, caption], i) => `<div class="story-panel"><span class="panel-number">${i + 1}</span><span class="story-emojis" role="img" aria-label="${esc(caption)}">${emojis}</span></div>`).join('')}</div>`;
    if (scene.kind === 'odd') return `<div class="odd-panels">${scene.items.map(item => `<div>${esc(item)}</div>`).join('')}</div>`;
    if (scene.kind === 'differences') return `<div class="difference-panels">${[0, 1].map(i => `<figure><figcaption>Picture ${i ? 'B' : 'A'}</figcaption><svg viewBox="0 0 300 210" role="img" aria-label="${i ? 'Cloudy; red shirt; two balls; cat on bench' : 'Sunny; blue shirt; one ball; cat next to tree'}"><rect width="300" height="210" rx="18" fill="#e6f2f7"/><path d="M0 145 Q150 125 300 145V210H0Z" fill="#c4dba5"/><text x="220" y="53" font-size="38">${i ? '☁️' : '☀️'}</text><text x="25" y="135" font-size="75">🌳</text><rect x="188" y="147" width="77" height="10" rx="3" fill="#aa7950"/><path d="M198 157v20m57-20v20" stroke="#aa7950" stroke-width="5"/><circle cx="135" cy="91" r="16" fill="#f4cda5"/><path d="M116 108h38v45h-38z" fill="${i ? '#dc6a68' : '#588dc3'}"/><path d="M122 153v30m25-30v30" stroke="#405456" stroke-width="9"/><text x="157" y="191" font-size="27">⚽</text>${i ? '<text x="237" y="194" font-size="27">⚽</text>' : ''}<text x="${i ? 207 : 65}" y="${i ? 146 : 183}" font-size="32">🐈</text></svg></figure>`).join('')}</div>`;
    if (scene.kind === 'town') return `<div class="town-scene" role="img" aria-label="${esc(scene.caption)}"><div>${scene.figures.map((e, i) => `<span>${e}<small>${['Bank', 'Café', 'Library'][i]}</small></span>`).join('')}</div><div class="road"></div></div>`;
    return `<svg class="learning-scene" viewBox="0 0 620 240" role="img" aria-label="${esc(scene.caption)}"><title>${esc(scene.title)}</title><rect width="620" height="240" rx="20" fill="${scene.sky}"/><circle cx="545" cy="43" r="22" fill="#efd782"/><path d="M0 171Q180 122 340 174T620 170V240H0Z" fill="#c8dbaa"/><path d="M0 207Q170 177 355 217T620 207V240H0Z" fill="#b8ce96"/><text x="120" y="180" font-size="92">${scene.figures[0]}</text><text x="213" y="165" font-size="57">${scene.figures[1]}</text><text x="391" y="171" font-size="85">${scene.figures[2]}</text><text x="447" y="217" font-size="49">${scene.figures[3]}</text><text x="27" y="40" font-size="14" fill="#476650" font-family="sans-serif">${esc(scene.title)}</text></svg>`;
  }
  function startLesson(w, day, skill) {
    selectedWeek = w; selectedDay = day;
    S.state.currentWeek = w; S.state.currentDay = day; S.save();
    if (skill === 'vocabulary') {
      const cards = D.dailyWords(w,day,S.state.learningTrack,S.state.wordProgress);
      begin({kind: 'flashcards', title: `Week ${w} · Day ${day} · Vocabulary`, cards, week: w, day, skill, key: lessonKey(w, day, skill)});
    } else begin({kind: 'lesson', title: `Week ${w} · Day ${day} · ${D.skills[skill].name}`, questions: D.lessonQuestions(w, day, skill), week: w, day, skill, key: lessonKey(w, day, skill), intro: skill === 'grammar'});
  }
  function begin(config) {
    session = {...config, index: 0, responses: [], checked: false, revealed: false, started: Date.now(), draft: '', chosen: '', earned: 0, finished: false};
    lastResult = null; historicalResult = null;
    persistSession();
    if (location.hash !== '#lesson') location.hash = 'lesson'; else {route = 'lesson'; renderSession();}
  }
  function startPractice(mode) {
    const w = D.weeks[practiceWeek - 1];
    if (mode === 'flashcards') return begin({kind: 'flashcards', title: `Week ${practiceWeek} · Flashcards`, cards: w.vocabulary, week: practiceWeek, skill: 'vocabulary', key: `practice-cards-${practiceWeek}`});
    let questions = w[practiceSkill + 'Questions'];
    if (practiceSkill === 'vocabulary') {
      const offset = {meaning: 0, word: 1, missing: 2, spelling: 3, sentence: 4}[mode];
      questions = questions.filter((q, i) => i % 5 === offset);
    }
    begin({kind: 'practice', title: `Week ${practiceWeek} · ${D.skills[practiceSkill].name}`, questions, week: practiceWeek, skill: practiceSkill, key: `practice-${practiceWeek}-${practiceSkill}-${mode}`, intro: practiceSkill === 'grammar'});
  }
  function stopAudio() {
    audioRun++;
    clearTimeout(audioTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const status = $('#audio-status'); if (status) status.textContent = '';
  }
  function refreshSpeechVoices() {
    if (!('speechSynthesis' in window)) return;
    speechVoices = window.speechSynthesis.getVoices().filter(voice => /^en[-_]/i.test(voice.lang));
  }
  function preferredVoice() {
    const score = voice => {
      const name = `${voice.name} ${voice.voiceURI}`.toLowerCase(), lang = voice.lang.toLowerCase();
      let points = lang.startsWith('en-gb') ? 50 : lang.startsWith('en-au') || lang.startsWith('en-nz') ? 35 : 15;
      if (/(enhanced|premium|natural|neural|siri|microsoft|google)/.test(name)) points += 40;
      if (voice.localService) points += 4;
      if (voice.default) points += 2;
      return points;
    };
    return speechVoices.slice().sort((a, b) => score(b) - score(a))[0];
  }
  function speechParts(text) {
    const sentences = String(text).replace(/\s+/g, ' ').replace(/[—–]/g, ', ').trim().match(/[^.!?;:]+[.!?;:]*/g) || [];
    return sentences.flatMap(sentence => {
      if (sentence.length <= 220) return sentence;
      const words = sentence.split(' '), parts = [], current = [];
      words.forEach(word => { if ((current.join(' ').length + word.length + 1) > 180) { parts.push(current.join(' ')); current.length = 0; } current.push(word); });
      if (current.length) parts.push(current.join(' '));
      return parts;
    }).map(part => part.trim()).filter(Boolean);
  }
  function speak(text) {
    stopAudio();
    if (!('speechSynthesis' in window)) return audioUnavailable();
    refreshSpeechVoices();
    const parts = speechParts(text), voice = preferredVoice(), run = ++audioRun;
    if (!parts.length) return;
    const status = $('#audio-status'); if (status) status.textContent = 'Đang chuẩn bị giọng đọc…';
    const timeout = Math.min(30000, Math.max(7000, text.trim().split(/\s+/).length * 520));
    audioTimer = setTimeout(() => { if (run === audioRun) audioUnavailable(); }, timeout);
    const playPart = index => {
      if (run !== audioRun) return;
      const utterance = new SpeechSynthesisUtterance(parts[index]);
      utterance.lang = voice?.lang || 'en-GB';
      utterance.rate = parts[index].split(/\s+/).length < 4 ? 0.78 : 0.9;
      utterance.pitch = 1;
      if (voice) utterance.voice = voice;
      utterance.onstart = () => { if (run === audioRun) { clearTimeout(audioTimer); if ($('#audio-status')) $('#audio-status').textContent = '♫ Đang đọc…'; } };
      utterance.onend = () => { if (run !== audioRun) return; if (index < parts.length - 1) setTimeout(() => playPart(index + 1), 180); else if ($('#audio-status')) $('#audio-status').textContent = 'Đã nghe xong. Con có thể nghe lại.'; };
      utterance.onerror = event => { if (run === audioRun && !['canceled', 'interrupted'].includes(event.error)) audioUnavailable(); };
      window.speechSynthesis.speak(utterance);
    };
    playPart(0);
  }
  function audioUnavailable() {
    if ($('#audio-status')) $('#audio-status').textContent = 'Chưa phát được giọng tiếng Anh. Nhờ bố mẹ mở lời thoại và đọc giúp con.';
    const fallback = $('#audio-fallback'); if (fallback) fallback.hidden = false;
    else toast('Thiết bị chưa phát được giọng đọc. Bố mẹ có thể đọc câu mẫu giúp con.');
  }
  function renderSession() {
    if (historicalResult) return renderResult(historicalResult, true);
    if (!session) { if (lastResult) return renderResult(lastResult, true); return shell(`${pageHeading('LET’S BEGIN', 'Pick a little adventure.', 'Chọn bài học để bắt đầu.')}<a href="#learn" class="btn primary">Choose a lesson →</a>`); }
    if (session.finished) return renderResult(lastResult);
    persistSession();
    const s = session, flash = s.kind === 'flashcards', list = flash ? s.cards : s.questions, q = list[s.index], lastResponse = s.responses[s.responses.length - 1];
    const progress = Math.round(s.index / list.length * 100);
    const header = `<div class="session-top"><button class="back-link" data-action="leave">← Back to learning</button><span class="pill">${s.kind === 'review' ? '🌱 Fresh start' : flash ? '🃏 Word explorer' : '✧ You’ve got this'}</span>${s.minutes ? '<span id="test-timer" class="test-timer"></span>' : ''}</div><div class="session-heading"><p class="eyebrow">${esc(s.title)}</p><div><h1>${flash ? 'Meet a new word.' : s.kind === 'review' ? 'Let’s try this together.' : 'One little question at a time.'}</h1><span>${s.index + 1} <span class="muted">/ ${list.length}</span></span></div>${bar(progress)}</div>`;
    let content;
    if (s.intro) {
      const grammar = D.weeks[s.week - 1].grammar;
      content = `<section class="exercise-card grammar-intro"><span class="intro-emoji">🧩</span><p class="eyebrow">A LITTLE GRAMMAR FIRST</p><h2>${esc(grammar.title)}</h2><p>${esc(grammar.explanation)}</p><div class="example-list">${grammar.examples.map(e => `<p>✧ ${esc(e)}</p>`).join('')}</div>${button('Got it. Let’s practise →', 'intro-done', 'primary')}</section>`;
    } else if (flash) {
      content = `<section class="flashcard"><span class="pill">${s.reviewRound ? `Ôn lại · ` : ''}${s.index + 1} / ${list.length} words</span>${A.picture(q.word) || `<div class="flash-emoji">${q.emoji || '📖'}</div>`}<h2>${esc(q.word)}</h2>${s.revealed ? `<p class="flash-meaning">${esc(q.meaning)}</p>${q.example ? `<p class="flash-example">${esc(q.example)}</p>` : ''}` : '<p class="flash-prompt">Con đoán nghĩa của từ này là gì?</p>'}<div class="flash-actions">${button(icon('volume') + ' Listen', 'listen', 'secondary')}${button(s.revealed ? '↻ Hide meaning' : '↻ Flip card', 'flip', 'secondary')}</div><div id="audio-status" class="audio-status" role="status"></div></section><div class="exercise-footer"><span class="muted">Nhìn · Nghe · Đọc thành tiếng · Nhớ nghĩa</span>${s.revealed ? `${button(s.index === list.length - 1 ? 'I remember it ✓' : 'I remember it →', 'flash-next', 'primary')}${button('Not yet · review later', 'flash-review', 'secondary')}` : '<span class="muted">Lật thẻ, đọc to và kiểm tra xem con có nhớ không nhé.</span>'}</div>`;
    } else {
      const open = q.type === 'open' || q.type === 'speaking';
      content = `<section class="exercise-card"><div class="question-label"><span class="lesson-icon small ${D.skills[q.skill].color}">${D.skills[q.skill].emoji}</span><span>${D.skills[q.skill].name} <span class="muted">· ${esc(q.topic)}</span></span></div>${q.passage ? `<div class="reading-passage"><h3>${esc(q.title)}</h3><p>${esc(q.passage)}</p></div>` : ''}${sceneHTML(q.scene)}${q.audio ? `<div class="audio-player"><span class="audio-disc">${icon('headphones', 30)}</span><div><strong>Listen closely, little explorer.</strong><p>Nghe cả đoạn trước khi trả lời.</p></div>${button(icon('volume') + ' Listen', 'listen', 'primary')}${button('↻ Again', 'listen', 'secondary')}</div><div id="audio-status" class="audio-status" role="status"></div><details id="audio-fallback" hidden><summary>Lời thoại dành cho bố mẹ đọc</summary><p>${esc(q.audio)}</p></details>` : ''}<h2 class="question-prompt" id="question-prompt">${esc(q.prompt)}</h2>${q.context ? `<p class="muted">${esc(q.context)}</p>` : ''}${q.type === 'choice' ? `<div class="options" role="group" aria-labelledby="question-prompt">${q.options.map((o, i) => `<button class="option ${s.chosen === o ? 'chosen' : ''} ${s.checked && o === q.answer ? 'correct' : ''} ${s.checked && s.chosen === o && o !== q.answer ? 'retry' : ''}" data-action="choose" data-value="${esc(o)}" aria-pressed="${s.chosen === o}" ${s.checked ? 'disabled' : ''}><span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${esc(o)}</span>${s.checked && o === q.answer ? icon('check') : ''}</button>`).join('')}</div>` : q.type === 'input' ? `${q.letterTiles ? letterBoard(q,s) : ''}<form id="answer-form"><label class="answer-label" for="answer-input">Your answer</label><input id="answer-input" class="answer-input" value="${esc(s.draft)}" placeholder="Type your answer here…" autocomplete="off" autocapitalize="off" spellcheck="false" ${s.checked ? 'disabled' : ''}><button type="submit" hidden>Check answer</button></form>` : q.type === 'open' ? `<label class="answer-label" for="open-writing">Your little story</label><textarea id="open-writing" class="answer-input" rows="4" placeholder="Write your sentences here…">${esc(s.draft)}</textarea>` : '<p class="speaking-instruction">🎤 Con nói thành tiếng nhé. Không cần bật micro hay ghi âm.</p>'}${open ? `<div class="hint-box"><strong>💡 A little hint</strong><p>${esc(q.hint)}</p></div>${button(s.revealed ? 'Hide example' : 'Show example answer', 'reveal', 'secondary')} ${q.type === 'speaking' ? button(icon('volume') + ' Listen to the question', 'listen', 'text') : ''}<div id="audio-status" class="audio-status" role="status"></div>${s.revealed ? `<div class="model-answer"><strong>One possible answer</strong><p>${esc(q.answer)}</p><small>Câu của con có thể khác nếu đúng với câu hỏi hoặc tranh.</small></div>` : ''}<div class="self-check"><strong>${q.type === 'speaking' ? 'Con tự kiểm tra sau khi nói:' : 'Con hoặc bố mẹ kiểm tra:'}</strong>${(q.checklist || ['Con đã nói thành tiếng để trả lời câu hỏi.', 'Con dùng từ hoặc câu phù hợp, dễ hiểu.', 'Con đã xem gợi ý nếu cần.']).map((text, i) => `<label><input type="checkbox" class="rubric-check" data-index="${i}" ${s.rubric && s.rubric[i] ? 'checked' : ''}> ${esc(text)}</label>`).join('')}<small>Đây là tự đánh giá; website không tự chấm nội dung hay phát âm.</small></div>` : ''}${s.checked ? feedbackHTML(q) : ''}</section><div class="exercise-footer"><span class="muted">${open ? 'Small sentences. Big confidence.' : 'Take your time. You’re learning.'}</span>${s.checked ? lastResponse && lastResponse.assessed && !lastResponse.correct ? button('Try again ↻', 'retry', 'primary') : button(s.index === list.length - 1 ? 'See my result →' : 'Next question →', 'next', 'primary') : open ? button('I’ve practised this ✓', 'self-complete', 'primary') : button('Check answer ' + icon('check', 18), 'check', 'primary', (q.type === 'choice' ? !s.chosen : !s.draft.trim()) ? 'disabled' : '')}</div>`;
    }
    shell(`<div class="session-wrap">${header}${content}</div>`);
    if (s.minutes) updateTimer();
    if (s.checked) $('#feedback')?.focus();
  }
  function letterBoard(q,s) {
    const tiles=[...q.answer].sort((a,b)=>a.localeCompare(b)).reverse();
    const used=[...s.draft];
    return `<div class="letter-board" role="group" aria-label="Chọn chữ theo thứ tự">${tiles.map((ch,i)=>{const at=used.indexOf(ch),disabled=at>=0;if(disabled)used.splice(at,1);return button(ch===' '?'␣':esc(ch),'letter','secondary',`data-value="${esc(ch)}" aria-label="${ch===' '?'Dấu cách':esc(ch)}" ${s.checked||disabled?'disabled':''}`);}).join('')}${button('Xếp lại','letter-clear','text',s.checked?'disabled':'')}</div>`;
  }
  function feedbackHTML(q) {
    const a = session.responses.at(-1);
    return `<div id="feedback" tabindex="-1" class="feedback ${a.correct ? 'positive' : 'gentle'}" role="status"><strong>${a.correct ? '🎉 Great job!' : '🌱 Good try! Let’s learn this one.'}</strong>${a.correct ? '' : `<p>Đáp án: <strong>${esc(q.answer)}</strong></p>`}<p>${esc(q.explanation || '')}</p>${!a.correct ? '<small>Đã lưu vào Review Mistakes để con luyện lại.</small>' : '<small>One more little step forward.</small>'}</div>`;
  }
  function normalize(v) { return String(v).normalize('NFC').trim().toLowerCase().replace(/[’‘]/g, "'").replace(/[.!?]+$/g, '').replace(/\s+/g, ' '); }
  function isCorrect(q, response) {
    const answers = [q.answer, ...(q.accept || [])];
    if (q.answer === 'café') answers.push('cafe');
    // A comma after a time expression is valid punctuation in a reordered sentence.
    const normalized = v => normalize(q.topic === 'Sentence order' ? v.replace(/,/g, '') : v);
    return answers.some(a => normalized(a) === normalized(response));
  }
  function checkAnswer() {
    if (!session || session.checked || session.intro) return;
    const q = session.questions[session.index];
    if (['open', 'speaking'].includes(q.type)) return;
    const response = q.type === 'choice' ? session.chosen : session.draft.trim();
    if (!response) return toast('Con chọn hoặc viết câu trả lời trước nhé.');
    const correct = isCorrect(q, response);
    session.earned += S.answer(q, response, correct, session.kind === 'review');
    session.responses.push({id: q.id, skill: q.skill, topic: q.topic, response, correct, assessed: true});
    session.checked = true;
    renderSession();
  }
  function chooseAnswer(value) {
    if (!session || session.checked) return;
    session.chosen = value;
    document.querySelectorAll('.option[data-action="choose"]').forEach(option => {
      const chosen = option.dataset.value === value;
      option.classList.toggle('chosen', chosen);
      option.setAttribute('aria-pressed', String(chosen));
    });
    const check = $('[data-action="check"]');
    if (check) check.disabled = false;
    persistSession();
  }
  function selfComplete() {
    const q = session.questions[session.index];
    if (session.checked) return;
    if (q.type === 'open' && session.draft.trim().length < 3) return toast('Con viết câu của mình trước nhé.');
    if (![0, 1, 2].every(i => session.rubric && session.rubric[i])) return toast('Con hoàn thành ba mục tự kiểm tra trước nhé.');
    session.responses.push({id: q.id, skill: q.skill, response: session.draft, assessed: false, correct: null});
    S.touch(); S.save(); nextQuestion();
  }
  function retryQuestion() {
    if (!session || !session.checked) return;
    const questionId = session.questions[session.index].id;
    session.responses = session.responses.filter(response => response.id !== questionId || !response.assessed || response.correct);
    session.checked = false; session.revealed = false; session.draft = ''; session.chosen = ''; session.rubric = {};
    persistSession(); renderSession();
  }
  function nextQuestion() {
    const lastResponse = session?.responses[session.responses.length - 1];
    if (lastResponse?.assessed && !lastResponse.correct) return retryQuestion();
    stopAudio();
    if (session.index === session.questions.length - 1) return finishSession();
    session.index++; session.checked = false; session.revealed = false; session.draft = ''; session.chosen = ''; session.rubric = {};
    renderSession(); window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function flashNext() {
    if (!session.revealed || session.finished) return;
    advanceFlashcard(false);
  }
  function flashReview() {
    if (!session || session.kind !== 'flashcards' || !session.revealed || session.finished) return;
    advanceFlashcard(true);
  }
  function advanceFlashcard(needsReview) {
    const card = session.cards[session.index], review = new Set(session.reviewCards || []);
    S.exploreWord(card);
    if (needsReview) review.add(card.id); else review.delete(card.id);
    session.reviewCards = [...review];
    stopAudio();
    if (session.index < session.cards.length - 1) { session.index++; session.revealed = false; persistSession(); renderSession(); return; }
    if (session.reviewCards.length) {
      session.cards = session.cards.filter(item => review.has(item.id));
      session.index = 0; session.revealed = false; session.reviewRound = (session.reviewRound || 0) + 1;
      persistSession(); renderSession(); toast(`Cùng ôn lại ${session.cards.length} từ nhé!`); return;
    }
    finishSession();
  }
  function finishSession() {
    if (!session || session.finished) return;
    const s = session; s.finished = true; stopAudio(); clearInterval(timer);
    s.earned += S.complete(s.key || s.id || 'review', s.skill);
    const assessed = s.responses.filter(a => a.assessed), breakdown = {};
    assessed.forEach(a => {breakdown[a.skill] = breakdown[a.skill] || {correct: 0, total: 0}; breakdown[a.skill].total++; if (a.correct) breakdown[a.skill].correct++;});
    const record = {id: s.id || s.key, title: s.title, kind: s.kind, score: assessed.filter(a => a.correct).length, total: assessed.length, breakdown, responses: s.responses, stars: s.earned, date: S.dateKey(), time: Date.now(), flashcards: s.cards ? s.cards.length : 0, selfAssessed: s.responses.filter(a => !a.assessed).length, week: s.week, day: s.day, skill: s.skill};
    if (['quiz', 'weekly', 'mock', 'random'].includes(s.kind)) {S.state.history.push(record); S.state.history = S.state.history.slice(-100);}
    if (s.week && s.day && skillKeys.every(skill => S.state.completed[lessonKey(s.week, s.day, skill)])) {
      const upcoming = nextLesson(s.week, s.day);
      S.state.currentWeek = upcoming.week; S.state.currentDay = upcoming.day;
    }
    persistSession(); lastResult = record; renderResult(record);
  }
  function renderResult(r, historical = false) {
    const percentage = r.total ? Math.round(r.score / r.total * 100) : null;
    const tricky = [...new Set(r.responses.filter(a => a.assessed && !a.correct).map(a => a.topic))];
    const strengths = Object.entries(r.breakdown).filter(([s, b]) => b.correct / b.total >= 0.8);
    shell(`<div class="result-wrap"><section class="result-hero"><span class="result-emoji">${percentage === 100 ? '🏆' : '🌟'}</span><p class="eyebrow">${esc(r.title)}</p><h1>${r.total && percentage < 60 ? 'Every try helps you grow.' : 'Great job, little explorer!'}</h1><p>${r.flashcards ? `Con đã khám phá ${r.flashcards} thẻ từ.` : r.total ? 'Con đã hoàn thành một bước trên hành trình của mình.' : 'Con đã hoàn thành lượt luyện có tự đánh giá.'}</p>${r.total ? `<div class="result-score">${r.score}<span> / ${r.total}</span></div><span class="result-percent">${percentage}% · Câu có đáp án cố định</span>` : ''}${r.selfAssessed ? `<p>${r.selfAssessed} hoạt động viết/nói đã tự đánh giá, không tính vào điểm đúng.</p>` : ''}<div class="result-stars">⭐ ${historical ? 'Đã nhận ' : '+'}${r.stars} stars</div></section>${Object.keys(r.breakdown).length ? `<section class="panel"><h2>Your little discoveries</h2>${Object.entries(r.breakdown).map(([s, b]) => `<div class="progress-row"><div><span>${D.skills[s].emoji} ${D.skills[s].name}</span><strong>${Math.round(b.correct / b.total * 100)}% <small>(${b.correct}/${b.total})</small></strong></div>${bar(Math.round(b.correct / b.total * 100), D.skills[s].color)}</div>`).join('')}</section>` : ''}${r.total ? `<div class="two-columns"><section class="result-insight green-soft"><h3>🌿 Your strengths</h3><p>${strengths.length ? strengths.map(([s]) => D.skills[s].name).join(' · ') : 'Con đã hoàn thành bài và biết mình cần luyện gì tiếp theo.'}</p></section><section class="result-insight yellow-soft"><h3>🧩 Needs more practice</h3><p>${tricky.length ? tricky.map(esc).join(' · ') : 'Con đã làm đúng các câu trong lượt này. Thử một hoạt động mới nhé!'}</p></section></div>` : ''}<div class="result-actions"><a href="#review" class="btn secondary">Review mistakes</a>${button('Next lesson ' + icon('arrow', 18), 'continue', 'primary')}<a href="#progress" class="text-link">View progress</a></div>${r.responses.length ? `<details class="info-details"><summary>Xem câu trả lời trong lượt này</summary>${r.responses.map(a => {const q = D.allQuestions[a.id];return `<div class="answer-review"><strong>${esc(q.prompt)}</strong><p>Con: ${esc(a.response || 'Đã luyện nói thành tiếng')}</p><p>${a.assessed ? `${a.correct ? '✓' : '🌱'} Đáp án: ${esc(q.answer)}` : 'Đã tự đánh giá; không chấm tự động.'}</p></div>`;}).join('')}</details>` : ''}</div>`);
  }
  function updateTimer() {
    clearInterval(timer);
    const tick = () => {if (!session || session.finished || !$('#test-timer')) return; const remaining = Math.max(0, session.minutes * 60 - Math.floor((Date.now() - session.started) / 1000)); $('#test-timer').textContent = remaining ? `◷ ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : '◷ Hết giờ gợi ý · Con có thể tiếp tục';};
    tick(); timer = setInterval(tick, 1000);
  }
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.hidden = false;
    clearTimeout(toast.timeout); toast.timeout = setTimeout(() => el.hidden = true, 4200);
  }
  function closeModal() {
    const dialog = $('.modal');
    if (!dialog) return;
    if (dialog.nodeName === 'DIALOG' && typeof dialog.close === 'function') dialog.close();
    else { dialog._cleanup?.(); dialog.remove(); }
  }
  function modal(title, content) {
    const previousFocus = document.activeElement;
    const nativeDialog = typeof HTMLDialogElement !== 'undefined' && typeof document.createElement('dialog').showModal === 'function';
    const dialog = document.createElement(nativeDialog ? 'dialog' : 'div'); dialog.className = 'modal';
    if (!nativeDialog) { dialog.classList.add('modal-fallback'); dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); }
    dialog.innerHTML = `<div class="section-title"><h2>${title}</h2><button class="icon-button" data-action="close-modal" aria-label="Đóng">${icon('close')}</button></div>${content}`;
    const cleanup = () => { dialog.remove(); document.body.classList.remove('modal-open'); previousFocus?.focus(); };
    dialog._cleanup = cleanup;
    document.body.appendChild(dialog);
    if (nativeDialog) {
      dialog.addEventListener('close', cleanup, {once: true});
      try { dialog.showModal(); } catch (_) { dialog.remove(); document.body.classList.add('modal-open'); const fallback = document.createElement('div'); fallback.className = 'modal modal-fallback'; fallback.setAttribute('role', 'dialog'); fallback.setAttribute('aria-modal', 'true'); fallback.innerHTML = `<div class="section-title"><h2>${title}</h2><button class="icon-button" data-action="close-modal" aria-label="Đóng">${icon('close')}</button></div>${content}`; fallback._cleanup = () => { fallback.remove(); document.body.classList.remove('modal-open'); previousFocus?.focus(); }; document.body.appendChild(fallback); }
    } else { document.body.classList.add('modal-open'); requestAnimationFrame(() => dialog.querySelector('button,input,select,textarea')?.focus()); }
  }
  function profile() {
    modal('Góc học của ' + esc(S.state.name), `<div class="profile-switch-row"><span class="pill avatar-pill">${avatarContent(S.state.avatar, `Avatar của ${S.state.name}`)} ${esc(S.state.name)}</span>${button('Đổi người học ⇄', 'learners', 'secondary')}</div><form id="profile-form"><label class="answer-label" for="profile-name">Tên của con</label><input id="profile-name" class="answer-input" maxlength="24" required value="${esc(S.state.name)}">${avatarOptions(S.state.avatar)}<button type="submit" class="btn primary">Lưu tên & avatar ✓</button></form><div class="profile-data"><h3>Tiến độ của ${esc(S.state.name)}</h3><p>Một người lớn có thể lưu bản sao tiến độ của con để cất giữ.</p><div class="profile-file-actions">${button('↓ Sao lưu tiến độ', 'export', 'secondary')}</div><hr><details><summary>Đặt lại tiến độ của ${esc(S.state.name)}</summary><p>Chỉ xóa bài học, điểm, sao và lịch sử của <strong>${esc(S.state.name)}</strong>. Tên, avatar và các hồ sơ khác được giữ lại.</p><label>Nhập RESET để xác nhận<input id="reset-confirm" class="answer-input" autocomplete="off"></label>${button('Đặt lại hồ sơ này', 'reset', 'danger')}</details></div>`);
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(S.exportProfile(), null, 2)], {type: 'application/json'}), url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `little-steps-${S.state.name.replace(/[^\p{L}\p{N}-]/gu, '_')}-${S.activeId.slice(-6)}-${S.dateKey()}.json`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Đã lưu bản sao tiến độ của ' + S.state.name + '.');
  }
  function navigate() {
    const next = location.hash.slice(1).split('?')[0] || 'home';
    if (!learnerChosen || next === 'learners') { route = 'learners'; learners(); window.scrollTo({top: 0}); return; }
    if (route === 'lesson' && next !== 'lesson') {stopAudio(); clearInterval(timer);}
    route = ['home', 'learn', 'practice', 'progress', 'tests', 'review', 'words', 'lesson'].includes(next) ? next : 'home';
    ({home, learn, practice, progress, tests, review, words, lesson: renderSession})[route]();
    window.scrollTo({top: 0});
  }
  const touchActions = new WeakSet();
  function handleAction(target) {
    const {action, week, day, skill, id, mode, value} = target.dataset;
    if (S.conflict && !['export', 'learners', 'select-learner', 'close-modal', 'reload', 'add-learner'].includes(action)) { toast(S.warning); return; }
    switch (action) {
      case 'bank-practice': bankPractice(mode); break;
      case 'word-detail': wordDetail(id); break;
      case 'word-audio': {const v=D.wordById[id];if(v)speak(v.word);break;}
      case 'word-card': {const v=D.wordById[id];if(v){closeModal();begin({kind:'flashcards',title:'Khám phá một từ',cards:[v],skill:'vocabulary',key:'card-'+id});}break;}
      case 'letter': if(session&&!session.checked){session.draft+=value;renderSession();}break;
      case 'letter-clear': if(session&&!session.checked){session.draft='';renderSession();}break;
      case 'select-learner': selectLearner(id); break;
      case 'add-learner': addLearner(); break;
      case 'learners': if (learnerChosen && !S.conflict) persistSession(); closeModal(); if (location.hash === '#learners') learners(); else location.hash = 'learners'; break;
      case 'reload': location.reload(); break;
      case 'continue': {historicalResult = null; if (session && !session.finished) {if (location.hash === '#lesson') renderSession(); else location.hash = 'lesson'; break;} const n = nextLesson(S.state.currentWeek, S.state.currentDay); startLesson(n.week, n.day, n.skill); break;}
      case 'lesson': startLesson(Number(week), Number(day), skill); break;
      case 'week': selectedWeek = Number(week); selectedDay = 1; if (location.hash === '#learn') learn(); else location.hash = 'learn'; break;
      case 'select-week': selectedWeek = Number(week); selectedDay = 1; learn(); break;
      case 'day': selectedDay = Number(day); learn(); break;
      case 'focus': practiceSkill = skill; practiceWeek = S.state.currentWeek; location.hash = 'practice'; break;
      case 'practice-start': startPractice(mode); break;
      case 'quiz': {const q = D.quizzes[Number(week) - 1][Number(day) - 1]; begin({...q, kind: 'quiz'}); break;}
      case 'random-test': begin(randomTest()); break;
      case 'start-test': {const t = [...D.tests, ...D.mockTests].find(t => t.id === id); if (t) begin({...t}); break;}
      case 'review-start': {const questions = activeMistakes().map(([id]) => D.allQuestions[id]); if (questions.length) begin({kind: 'review', title: 'Review mistakes · A fresh start', questions}); break;}
      case 'choose': chooseAnswer(value); break;
      case 'check': checkAnswer(); break;
      case 'retry': retryQuestion(); break;
      case 'next': if (session && session.checked) nextQuestion(); break;
      case 'intro-done': session.intro = false; renderSession(); break;
      case 'flip': session.revealed = !session.revealed; renderSession(); break;
      case 'flash-next': flashNext(); break;
      case 'flash-review': flashReview(); break;
      case 'reveal': session.revealed = !session.revealed; renderSession(); break;
      case 'self-complete': selfComplete(); break;
      case 'listen': {if (!session) break; const q = session.kind === 'flashcards' ? session.cards[session.index] : session.questions[session.index]; speak(q.audio || (q.word ? `${q.word}. ${q.example || ''}` : q.prompt)); break;}
      case 'leave': modal('Take a little break?', `<p>Câu đã trả lời được lưu. Nếu rời bài, lần sau con bắt đầu lại lượt này từ đầu; sao đã nhận không bị mất.</p><div class="modal-actions">${button('Keep learning', 'close-modal', 'primary')}${button('Back to Learn', 'confirm-leave', 'secondary')}</div>`); break;
      case 'confirm-leave': closeModal(); session = null; persistSession(); location.hash = 'learn'; break;
      case 'profile': profile(); break;
      case 'close-modal': closeModal(); break;
      case 'export': exportData(); break;
      case 'reset': if ($('#reset-confirm').value === 'RESET') {try {S.reset(); adoptProfile(); toast('Đã đặt lại tiến độ của ' + S.state.name + '.');} catch (error) {toast(error.message);}} else toast('Nhập chính xác RESET nếu muốn đặt lại hồ sơ.'); break;
      case 'history-result': {const r = S.state.history.find(h => h.time === Number(target.dataset.time)); if (r) {historicalResult = r; route = 'lesson'; if (location.hash !== '#lesson') location.hash = 'lesson'; else renderResult(r, true);} break;}
    }
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || target.disabled || touchActions.has(target)) return;
    handleAction(target);
  });
  document.addEventListener('pointerup', event => {
    if (event.pointerType && event.pointerType !== 'touch') return;
    const target = event.target.closest('[data-action]');
    if (!target || target.disabled) return;
    event.preventDefault();
    touchActions.add(target);
    handleAction(target);
    setTimeout(() => touchActions.delete(target), 800);
  });
  document.addEventListener('input', e => {
    if(e.target.id==='bank-search'){bankSearch=e.target.value;$('#bank-results').innerHTML=bankResults();}
    if (e.target.id === 'answer-input' && session) {session.draft = e.target.value; persistSession(); const b = $('[data-action="check"]'); if (b) b.disabled = !e.target.value.trim();}
    if (e.target.id === 'open-writing' && session) {session.draft = e.target.value; persistSession();}
    if (e.target.classList.contains('rubric-check') && session) {session.rubric = session.rubric || {}; session.rubric[e.target.dataset.index] = e.target.checked; persistSession();}
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'avatar-upload') { uploadAvatar(e.target); return; }
    if (e.target.name === 'learner-avatar') { delete e.target.closest('form').dataset.customAvatar; }
    if (e.target.id === 'learning-track') {S.state.learningTrack=e.target.value;S.save();toast('Đã cập nhật nhịp học cho '+S.state.name+'.');}
    if (['bank-level','bank-topic','bank-status'].includes(e.target.id)) {if(e.target.id==='bank-level')bankLevel=e.target.value;if(e.target.id==='bank-topic')bankTopic=e.target.value;if(e.target.id==='bank-status')bankStatus=e.target.value;$('#bank-results').innerHTML=bankResults();}
    if (e.target.id === 'practice-week') {practiceWeek = Number(e.target.value); practice();}
    if (e.target.id === 'practice-skill') {practiceSkill = e.target.value; practice();}
  });
  document.addEventListener('submit', e => {
    if (['profile-form', 'add-learner-form'].includes(e.target.id)) e.preventDefault();
    if (e.target.id === 'add-learner-form') {
      try {if (learnerChosen && !S.conflict) persistSession(); S.createProfile($('#learner-name').value, selectedAvatar(e.target)); adoptProfile(); toast('Chào mừng ' + S.state.name + '! 🌱');} catch (error) {toast(error.message);} return;
    }
    if (S.conflict) { toast(S.warning); return; }
    if (e.target.id === 'answer-form') {e.preventDefault(); checkAnswer();}
    if (e.target.id === 'profile-form') {const name = $('#profile-name').value.trim(); if (!name) return; try {S.rename(name, selectedAvatar(e.target)); closeModal(); navigate(); toast('Hello, ' + name + '! 👋');} catch (error) {toast(error.message);}}
  });
  window.addEventListener('hashchange', navigate);
  window.addEventListener('pagehide', stopAudio);
  if ('speechSynthesis' in window) { refreshSpeechVoices(); window.speechSynthesis.addEventListener?.('voiceschanged', refreshSpeechVoices); }
  // Expose pure helpers for the offline validation suite; no network or runtime dependency.
  window.MoversApp = {normalize, isCorrect, weekProgress, accuracy, nextLesson, randomTest};
  navigate();
})();
