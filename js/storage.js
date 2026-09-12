/* Each learner has an independent key. The v1 save is retained during migration. */
(function () {
  'use strict';
  const LEGACY_KEY = 'littleStepsMovers.v1';
  const INDEX_KEY = 'littleStepsMovers.profiles.v2';
  const PREFIX = 'littleStepsMovers.profile.';
  const avatars = ['🦉', '🦊', '🐼', '🐱', '🐬', '🐰', '🐯', '🐨'];
  const customAvatar = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length <= 140000;
  const validAvatar = value => avatars.includes(value) || customAvatar(value);
  let warning = '';
  let conflict = false, activeId = null, lastRaw = null;
  let registry = {version: 2, profiles: []};
  const memory = new Map();
  const savedCopies = new Map();
  const fresh = (name = 'Alex', avatar = '🦉') => ({version: 1, name, avatar, currentWeek: 1, currentDay: 1, stars: 0, completed: {}, answers: {}, mistakes: {}, learnedWords: [], wordProgress: {}, learningTrack: 'movers', activityDays: [], daily: {}, rewards: {}, history: [], activeSession: null});
  let state = fresh();
  const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const integer = (n, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(n) && n >= min && n <= max;
  const date = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const knownSkill = s => Object.hasOwn(window.MoversData.skills, s);
  const knownQuestion = id => typeof id === 'string' && Object.hasOwn(window.MoversData.allQuestions, id);
  function invalid() { throw new Error('File không đúng định dạng tiến độ Little Steps, hoặc có dữ liệu không hợp lệ.'); }
  function parse(text) {
    if (typeof text !== 'string' || text.length > 2 * 1024 * 1024) invalid();
    return JSON.parse(text, (key, value) => {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) invalid();
      return value;
    });
  }
  function validateProgress(input) {
    const v = JSON.parse(JSON.stringify(input));
    if (!object(v) || v.version !== 1 || typeof v.name !== 'string' || !v.name.trim() || v.name.length > 24 || !integer(v.currentWeek, 1, 8) || !integer(v.currentDay, 1, 5) || !integer(v.stars)) invalid();
    for (const k of ['completed', 'answers', 'mistakes', 'daily', 'rewards']) if (!object(v[k])) invalid();
    for (const k of ['learnedWords', 'activityDays', 'history']) if (!Array.isArray(v[k])) invalid();
    if (Object.values(v.completed).some(x => x !== true) || Object.values(v.rewards).some(x => x !== true) || v.learnedWords.some(x => typeof x !== 'string') || v.activityDays.some(x => !date(x))) invalid();
    if (Object.entries(v.completed).some(([k]) => k.startsWith('lesson-') && !/^lesson-[1-8]-[1-5]-(vocabulary|grammar|listening|reading|writing|speaking)$/.test(k))) invalid();
    if (Object.entries(v.daily).some(([day, items]) => !date(day) || !Array.isArray(items) || items.some(s => !knownSkill(s)))) invalid();
    if (Object.entries(v.answers).some(([id, a]) => !knownQuestion(id) || !object(a) || typeof a.correct !== 'boolean' || a.skill !== window.MoversData.allQuestions[id].skill || typeof a.response !== 'string' || !date(a.date))) invalid();
    if (Object.entries(v.mistakes).some(([id, m]) => !knownQuestion(id) || !object(m) || typeof m.response !== 'string' || !integer(m.correctRuns) || typeof m.mastered !== 'boolean' || !date(m.date))) invalid();
    if (v.learningTrack != null && !['foundation','movers'].includes(v.learningTrack)) invalid();
    if (v.wordProgress != null && (!object(v.wordProgress) || Object.entries(v.wordProgress).some(([id,p]) => !Object.hasOwn(window.MoversData.wordById || {},id) || !object(p) || typeof p.seen !== 'boolean' || !integer(p.recognition) || !integer(p.spelling) || !integer(p.reviewRuns) || typeof p.needsReview !== 'boolean' || !date(p.due) || !date(p.lastSeen)))) invalid();
    const responseValid = a => object(a) && knownQuestion(a.id) && a.skill === window.MoversData.allQuestions[a.id].skill && typeof a.response === 'string' && typeof a.assessed === 'boolean' && (a.assessed ? typeof a.correct === 'boolean' : a.correct === null);
    if (v.history.length > 100) invalid();
    for (const h of v.history) {
      if (!object(h) || typeof h.id !== 'string' || typeof h.title !== 'string' || !['quiz', 'weekly', 'mock', 'random'].includes(h.kind) || !integer(h.total, 1) || !integer(h.score, 0, h.total) || !integer(h.time) || !integer(h.stars) || !date(h.date) || !object(h.breakdown) || !Array.isArray(h.responses) || h.responses.some(a => !responseValid(a))) invalid();
      if (Object.entries(h.breakdown).some(([s, b]) => !knownSkill(s) || !object(b) || !integer(b.total, 1) || !integer(b.correct, 0, b.total))) invalid();
    }
    if (v.activeSession != null) {
      const s = v.activeSession;
      if (!object(s) || !['flashcards', 'lesson', 'practice', 'quiz', 'weekly', 'mock', 'random', 'review'].includes(s.kind) || typeof s.title !== 'string' || !integer(s.index) || !integer(s.started) || !integer(s.earned) || !Array.isArray(s.responses) || s.responses.some(a => !responseValid(a)) || typeof s.draft !== 'string' || typeof s.chosen !== 'string') invalid();
      if (s.week != null && !integer(s.week, 1, 8) || s.day != null && !integer(s.day, 1, 5) || s.skill != null && !knownSkill(s.skill) || s.minutes != null && !integer(s.minutes, 1, 180)) invalid();
      if (s.intro && (!s.week || s.skill !== 'grammar')) invalid();
      if (s.rubric != null && (!object(s.rubric) || Object.entries(s.rubric).some(([k, x]) => !['0', '1', '2'].includes(k) || typeof x !== 'boolean'))) invalid();
      const list = s.kind === 'flashcards' ? s.cards : s.questions;
      if (!Array.isArray(list) || !list.length || s.index >= list.length || list.length > 1500) invalid();
      if (s.kind === 'flashcards') {
        const cards = new Map(window.MoversData.vocabulary.map(c => [c.id, c]));
        if (list.some(q => !object(q) || !cards.has(q.id))) invalid();
        s.cards = list.map(q => cards.get(q.id));
      } else {
        if (list.some(q => !object(q) || !knownQuestion(q.id))) invalid();
        s.questions = list.map(q => window.MoversData.allQuestions[q.id]);
        if (s.checked && !s.responses.length) invalid();
      }
    }
    const result = fresh(v.name.trim(), validAvatar(v.avatar) ? v.avatar : '🦉');
    for (const key of Object.keys(result)) if (Object.hasOwn(v, key) && !['name', 'avatar'].includes(key)) result[key] = v[key];
    result.learnedWords = [...new Set(result.learnedWords)];
    result.activityDays = [...new Set(result.activityDays)];
    // Old "learned" flags indicate exposure only, never inferred mastery.
    if (!v.wordProgress) for (const word of result.learnedWords) {
      const id=window.MoversData.wordByLegacy?.[word];
      if (id) result.wordProgress[id]=wordRecord();
    }
    return result;
  }
  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function readRegistry() {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return {version: 2, profiles: []};
    const index = parse(raw);
    if (!object(index) || index.version !== 2 || !Array.isArray(index.profiles) || index.profiles.some(p => !object(p) || typeof p.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(p.id) || typeof p.name !== 'string' || p.name.length > 24 || !validAvatar(p.avatar)) || new Set(index.profiles.map(p => p.id)).size !== index.profiles.length) invalid();
    return index;
  }
  function listProfiles() {
    try {
      const latest = readRegistry();
      for (const p of registry.profiles) if (memory.has(p.id) && !latest.profiles.some(x => x.id === p.id)) latest.profiles.push(p);
      registry = latest;
    } catch (_) { /* Keep session data usable when localStorage is unavailable. */ }
    return registry.profiles.map(p => ({...p}));
  }
  function save() {
    if (!activeId || conflict) return false;
    memory.set(activeId, state);
    try {
      const current = localStorage.getItem(PREFIX + activeId);
      if (current !== lastRaw) {
        conflict = true;
        warning = 'Hồ sơ này vừa thay đổi ở tab khác. Hãy xuất bản nháp nếu cần, rồi tải lại trang trước khi học tiếp.';
        return false;
      }
      const raw = JSON.stringify(state);
      localStorage.setItem(PREFIX + activeId, raw);
      lastRaw = raw;
      savedCopies.set(activeId, raw);
      return true;
    } catch (_) {
      warning = 'Trình duyệt chưa lưu được dữ liệu. Hồ sơ được giữ trong phiên này; hãy xuất tiến độ trước khi đóng trang.';
      return false;
    }
  }
  function updateMetadata() {
    const list = listProfiles();
    const meta = list.find(p => p.id === activeId);
    if (meta) { meta.name = state.name; meta.avatar = state.avatar; }
    registry.profiles = list;
    try { localStorage.setItem(INDEX_KEY, JSON.stringify(registry)); }
    catch (_) { warning = 'Chưa lưu được danh sách người học. Hãy xuất tiến độ từng hồ sơ trước khi đóng trang.'; }
  }
  function selectProfile(id) {
    if (!listProfiles().some(p => p.id === id)) throw new Error('Không tìm thấy hồ sơ.');
    let raw = null, next;
    try { raw = localStorage.getItem(PREFIX + id); }
    catch (_) { /* Use the in-memory profile when storage is denied. */ }
    if (memory.has(id) && (raw === savedCopies.get(id) || raw === null)) next = memory.get(id);
    else {
      if (!raw) throw new Error('Không đọc được tiến độ của hồ sơ này. Hãy nhập bản sao lưu để khôi phục.');
      next = validateProgress(parse(raw));
    }
    // A profile changed in another tab must be loaded from its latest saved copy.
    if (id === activeId && conflict && raw) next = validateProgress(parse(raw));
    activeId = id; state = next; lastRaw = raw; conflict = false;
    savedCopies.set(id, raw);
    memory.set(id, state);
    return id;
  }
  function createProfile(name, avatar = '🦉', progress = null) {
    name = String(name).trim();
    if (!name || name.length > 24 || !validAvatar(avatar)) throw new Error('Nhập tên từ 1–24 ký tự và chọn avatar hợp lệ.');
    const id = window.crypto?.randomUUID ? window.crypto.randomUUID() : 'learner-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    const next = progress ? validateProgress(progress) : fresh(name, avatar);
    next.name = name; next.avatar = avatar;
    listProfiles();
    registry.profiles.push({id, name, avatar, createdAt: new Date().toISOString()});
    activeId = id; state = next; lastRaw = null; conflict = false;
    save(); updateMetadata();
    return id;
  }
  function rename(name, avatar) {
    name = name.trim();
    if (!name || name.length > 24 || !validAvatar(avatar)) throw new Error('Tên hoặc avatar không hợp lệ.');
    state.name = name; state.avatar = avatar;
    if (!conflict) { save(); if (!conflict) updateMetadata(); }
  }
  function previewImport(text) {
    const file = parse(text);
    if (file?.format === 'little-steps-profile') {
      if (file.version !== 2 || !object(file.profile)) invalid();
      return validateProgress(file.progress);
    }
    return validateProgress(file); // Accept v1 JSON exports too.
  }
  function importProgress(progress, mode) {
    const data = validateProgress(progress);
    if (mode === 'new') return createProfile(data.name, data.avatar, data);
    if (mode !== 'replace' || !activeId) throw new Error('Hãy chọn hồ sơ cần khôi phục.');
    // Keep the target identity; importing never links two local learners by name or ID.
    const name = state.name, avatar = state.avatar;
    if (!save() && conflict) throw new Error(warning);
    state = {...data, name, avatar}; save();
    return activeId;
  }
  function exportProfile() {
    return {format: 'little-steps-profile', version: 2, exportedAt: new Date().toISOString(), profile: {id: activeId, name: state.name, avatar: state.avatar}, progress: state};
  }
  function initialize() {
    try {
      const hasIndex = localStorage.getItem(INDEX_KEY) !== null;
      registry = readRegistry();
      if (!hasIndex) {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const old = validateProgress(parse(legacy));
          createProfile(old.name, old.avatar, old);
        }
      }
    } catch (_) { warning = 'Chưa đọc được dữ liệu đã lưu. Bản lưu cũ được giữ nguyên; con có thể tạo hồ sơ mới hoặc nhập bản sao JSON.'; }
  }
  function reward(key, amount) {
    if (state.rewards[key]) return 0;
    state.rewards[key] = true;
    state.stars += amount;
    return amount;
  }
  function touch() {
    const today = dateKey();
    if (!state.activityDays.includes(today)) state.activityDays.push(today);
  }
  function streak() {
    const days = new Set(state.activityDays);
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    if (!days.has(dateKey(date))) date.setDate(date.getDate() - 1);
    let count = 0;
    while (days.has(dateKey(date))) { count++; date.setDate(date.getDate() - 1); }
    return count;
  }
  function answer(q, response, correct, review) {
    touch();
    if (q.wordId) {
      const p=state.wordProgress[q.wordId] ||= wordRecord();
      p.seen=true; p.lastSeen=dateKey();
      const kind=q.evidence==='spelling'?'spelling':'recognition';
      if (correct) {p[kind]++; if(p.needsReview && ++p.reviewRuns>=2)p.needsReview=false;}
      else {p[kind]=0;p.needsReview=true;p.reviewRuns=0;}
      const due=new Date(); due.setDate(due.getDate()+(correct?Math.min(7,1+p.recognition+p.spelling):1));
      p.due=dateKey(due);
    }
    state.answers[q.id] = {correct, skill: q.skill, topic: q.topic, week: q.week, response, date: dateKey()};
    if (!correct) state.mistakes[q.id] = {response, correctRuns: 0, mastered: false, date: dateKey()};
    else if (review && state.mistakes[q.id]) {
      state.mistakes[q.id].correctRuns++;
      state.mistakes[q.id].mastered = state.mistakes[q.id].correctRuns >= 2;
    }
    const stars = correct ? reward('answer:' + q.id, 2) : 0;
    save();
    return stars;
  }
  function complete(key, skill) {
    touch();
    state.completed[key] = true;
    let stars = reward('complete:' + key, 10);
    const today = dateKey();
    state.daily[today] = state.daily[today] || [];
    if (skill && !state.daily[today].includes(skill)) state.daily[today].push(skill);
    if (['vocabulary', 'grammar', 'listening', 'reading'].every(s => state.daily[today].includes(s))) stars += reward('daily:' + today, 20);
    save();
    return stars;
  }
  function reset() {
    if (conflict) throw new Error(warning);
    const previous = state;
    state = fresh(previous.name, previous.avatar);
    save();
    if (conflict) { state = previous; throw new Error(warning); }
  }
  function wordRecord() {return {seen:true,recognition:0,spelling:0,reviewRuns:0,needsReview:false,lastSeen:dateKey(),due:dateKey()};}
  function exploreWord(card) {
    const id=card.wordId || card.id;
    if (window.MoversData.wordById?.[id]) {
      const p=state.wordProgress[id] ||= wordRecord();p.seen=true;p.lastSeen=dateKey();
    }
    if(!state.learnedWords.includes(card.word))state.learnedWords.push(card.word);
    touch();save();
  }
  function wordStatus(id) {
    const p=state.wordProgress[id];
    return !p?'new':p.needsReview?'review':p.spelling?'spelling':p.recognition?'recognition':'seen';
  }
  function wordStats() {
    const counts={new:0,seen:0,recognition:0,spelling:0,review:0};
    (window.MoversData.wordBank || []).forEach(v=>counts[wordStatus(v.id)]++);return counts;
  }
  initialize();
  window.MoversStore = {get state() { return state; }, get warning() { return warning; }, get conflict() { return conflict; }, get activeId() { return activeId; }, avatars, listProfiles, createProfile, selectProfile, rename, previewImport, importProgress, exportProfile, validateProgress, dateKey, save, reward, touch, streak, answer, complete, reset, exploreWord, wordStatus, wordStats};
})();
