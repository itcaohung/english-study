// Run with: node --test tests/storage.test.cjs (no installed dependencies).
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const INDEX = 'littleStepsMovers.profiles.v2';
const OLD = 'littleStepsMovers.v1';
const key = id => 'littleStepsMovers.profile.' + id;
let sequence = 0;
function context(db = new Map(), deny = false) {
  const sandbox = {window: {crypto: {randomUUID: () => `test-profile-${++sequence}`}}, localStorage: {
    getItem: k => {if (deny) throw Error('denied'); return db.get(k) ?? null;},
    setItem: (k, v) => {if (deny) throw Error('denied'); db.set(k, String(v));}
  }};
  vm.createContext(sandbox);
  for (const file of ['data.js', 'lexicon.js', 'vocabulary.js', 'storage.js']) vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), sandbox);
  return {store: sandbox.window.MoversStore, data: sandbox.window.MoversData, db};
}
function plain(v) {return JSON.parse(JSON.stringify(v));}
test('No fake learner; same-name learners get distinct IDs and independent rewards', () => {
  const {store: s, data: d, db} = context();
  assert.equal(s.listProfiles().length, 0);
  const a = s.createProfile('Mai', '🐼');
  s.answer(d.grammarQuestions[0], 'am', false, false);
  s.complete('lesson-1-1-grammar', 'grammar');
  const b = s.createProfile('Mai', '🦊');
  assert.notEqual(a, b); assert.equal(s.state.stars, 0); assert.equal(Object.keys(s.state.mistakes).length, 0);
  s.complete('lesson-1-1-grammar', 'grammar'); assert.equal(s.state.stars, 10);
  s.selectProfile(a); assert.equal(s.state.stars, 10); assert.equal(Object.keys(s.state.mistakes).length, 1);
  s.rename('An', '🐬'); s.reset();
  assert.equal(s.state.name, 'An'); assert.equal(s.state.avatar, '🐬'); assert.equal(s.state.stars, 0);
  s.selectProfile(b); assert.equal(s.state.name, 'Mai'); assert.equal(s.state.stars, 10);
  assert.ok(db.has(key(a)) && db.has(key(b)));
});
test('Legacy progress migrates exactly once; original key and data survive', () => {
  const fixture = context(); fixture.store.createProfile('Alex', '🦉');
  fixture.store.state.stars = 250;
  fixture.store.state.completed['lesson-3-2-reading'] = true;
  fixture.store.state.currentWeek = 3;
  const legacy = plain(fixture.store.state); delete legacy.avatar;
  const db = new Map([[OLD, JSON.stringify(legacy)]]);
  const {store: first} = context(db);
  assert.equal(first.listProfiles().length, 1);
  const id = first.listProfiles()[0].id;
  assert.equal(first.state.stars, 250);
  assert.equal(first.state.currentWeek, 3);
  assert.equal(first.state.completed['lesson-3-2-reading'], true);
  assert.equal(db.get(OLD), JSON.stringify(legacy));
  const {store: reloaded} = context(db);
  assert.equal(reloaded.listProfiles().length, 1);
  reloaded.selectProfile(id); assert.equal(reloaded.state.stars, 250);
});
test('Validated export/import creates a new ID or replaces only target progress', () => {
  const {store: s, db} = context();
  const a = s.createProfile('Alex', '🐯'); s.state.stars = 75; s.save();
  const backup = JSON.stringify(s.exportProfile());
  const parsed = s.previewImport(backup);
  const before = db.get(INDEX); s.previewImport(backup); assert.equal(db.get(INDEX), before);
  const b = s.importProgress(parsed, 'new');
  assert.notEqual(a, b); assert.equal(s.state.stars, 75);
  s.rename('Mai', '🐱'); s.state.stars = 12; s.save();
  s.importProgress(parsed, 'replace'); assert.equal(s.state.stars, 75); assert.equal(s.state.name, 'Mai'); assert.equal(s.state.avatar, '🐱');
  s.selectProfile(a); assert.equal(s.state.name, 'Alex'); assert.equal(s.state.avatar, '🐯');
  assert.equal(s.previewImport(JSON.stringify(parsed)).stars, 75); // Original v1 export format.
});
test('Malformed/nested invalid/prototype-polluting imports are rejected before mutation', () => {
  const {store: s, db} = context(); s.createProfile('An');
  const before = [...db.entries()];
  assert.throws(() => s.previewImport('{broken'));
  assert.throws(() => s.previewImport('{"__proto__":{"polluted":true}}'));
  const bad = plain(s.state); bad.answers.fake = {correct: true};
  assert.throws(() => s.previewImport(JSON.stringify(bad)));
  const invalidDaily = plain(s.state); invalidDaily.daily['2026-09-12'] = 'grammar';
  assert.throws(() => s.previewImport(JSON.stringify(invalidDaily)));
  const invalidWeek = plain(s.state); invalidWeek.currentWeek = 99;
  assert.throws(() => s.previewImport(JSON.stringify(invalidWeek)));
  const invalidSession = plain(s.state); invalidSession.activeSession = {kind: 'lesson', index: 999};
  assert.throws(() => s.previewImport(JSON.stringify(invalidSession)));
  assert.deepEqual([...db.entries()], before);
});
test('Different tabs cannot overwrite sibling profiles or a newer same-profile save', () => {
  const db = new Map(), tab1 = context(db).store;
  const a = tab1.createProfile('An'), b = tab1.createProfile('Bình'); tab1.selectProfile(a);
  const tab2 = context(db).store; tab2.selectProfile(b); tab2.state.stars = 20; tab2.save();
  tab1.state.stars = 10; tab1.save();
  assert.equal(JSON.parse(db.get(key(a))).stars, 10); assert.equal(JSON.parse(db.get(key(b))).stars, 20);
  tab2.selectProfile(a); tab2.state.stars = 40; tab2.save();
  tab1.state.stars = 11; assert.equal(tab1.save(), false); assert.equal(tab1.conflict, true);
  assert.equal(JSON.parse(db.get(key(a))).stars, 40);
  tab1.selectProfile(a); assert.equal(tab1.state.stars, 40); assert.equal(tab1.conflict, false);
  tab1.selectProfile(b); assert.equal(tab1.state.stars, 20);
});
test('Denied storage supports multiple in-memory profiles and export without silent loss', () => {
  const {store: s} = context(new Map(), true);
  const a = s.createProfile('An'); s.state.stars = 25; s.save();
  const b = s.createProfile('Bình'); assert.equal(s.state.stars, 0);
  s.selectProfile(a); assert.equal(s.state.stars, 25); assert.ok(s.warning);
  assert.equal(s.exportProfile().progress.stars, 25);
  s.selectProfile(b); assert.equal(s.listProfiles().length, 2);
});

test('Vocabulary evidence tracks exposure, recognition, spelling and review separately', () => {
  const {store: s, data: d} = context();
  s.createProfile('An');
  const word = d.wordById['lex-movers-penguin'];
  s.exploreWord(word);
  assert.equal(s.wordStatus(word.id), 'seen');
  const recognition = d.allQuestions[`${word.id}-meaning`];
  const spelling = d.allQuestions[`${word.id}-spelling`];
  s.answer(recognition, recognition.answer, true, false);
  assert.equal(s.wordStatus(word.id), 'recognition');
  s.answer(spelling, spelling.answer, true, false);
  assert.equal(s.wordStatus(word.id), 'spelling');
  s.answer(spelling, 'pengin', false, false);
  assert.equal(s.wordStatus(word.id), 'review');
  s.answer(spelling, spelling.answer, true, true);
  s.answer(spelling, spelling.answer, true, true);
  assert.equal(s.wordStatus(word.id), 'spelling');
});

test('A compact custom avatar is accepted and preserved in an exported profile', () => {
  const {store: s} = context();
  const avatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAE//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9k=';
  s.createProfile('An', avatar);
  assert.equal(s.state.avatar, avatar);
  assert.equal(s.previewImport(JSON.stringify(s.exportProfile())).avatar, avatar);
});
