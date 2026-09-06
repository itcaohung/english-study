/* Local-only storage. A denied/corrupt store never prevents a lesson from running. */
(function () {
  'use strict';
  const KEY = 'littleStepsMovers.v1';
  let warning = '';
  const fresh = () => ({version: 1, name: 'Alex', currentWeek: 1, currentDay: 1, stars: 0, completed: {}, answers: {}, mistakes: {}, learnedWords: [], activityDays: [], daily: {}, rewards: {}, history: [], activeSession: null});
  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      const saved = JSON.parse(raw);
      const maps = ['completed', 'answers', 'mistakes', 'daily', 'rewards'];
      if (!saved || saved.version !== 1 || maps.some(k => !saved[k] || typeof saved[k] !== 'object' || Array.isArray(saved[k])) || ['learnedWords', 'activityDays', 'history'].some(k => !Array.isArray(saved[k]))) throw new Error('Invalid save');
      return {...fresh(), ...saved, name: typeof saved.name === 'string' ? saved.name.slice(0, 24) : 'Alex', stars: Number.isFinite(saved.stars) ? Math.max(0, saved.stars) : 0, currentWeek: Math.max(1, Math.min(8, Number(saved.currentWeek) || 1)), currentDay: Math.max(1, Math.min(5, Number(saved.currentDay) || 1))};
    } catch (error) {
      warning = 'Không đọc được dữ liệu đã lưu. Buổi học vẫn dùng được; hãy xuất bản sao tiến độ trước khi đóng trang.';
      return fresh();
    }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (error) { warning = 'Trình duyệt không cho lưu tiến độ. Tiến độ chỉ giữ trong phiên này; hãy dùng Xuất tiến độ.'; }
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
  function reset() { state = fresh(); warning = ''; save(); }
  window.MoversStore = {get state() { return state; }, get warning() { return warning; }, dateKey, save, reward, touch, streak, answer, complete, reset};
})();
