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
function context(db = new Map(), deny = false, withoutObjectHasOwn = false) {
  const sandbox = {window: {crypto: {randomUUID: () => `test-profile-${++sequence}`}}, localStorage: {
    getItem: k => {if (deny) throw Error('denied'); return db.get(k) ?? null;},
    setItem: (k, v) => {if (deny) throw Error('denied'); db.set(k, String(v));}
  }};
  vm.createContext(sandbox);
  if (withoutObjectHasOwn) vm.runInContext('Object.hasOwn = undefined;', sandbox);
  for (const file of ['data.js', 'lexicon.js', 'vocabulary.js', 'storage.js']) vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), sandbox);
  return {store: sandbox.window.MoversStore, data: sandbox.window.MoversData, db};
}
function plain(v) {return JSON.parse(JSON.stringify(v));}
test('First visit creates a default learner; same-name learners get distinct IDs and independent rewards', () => {
  const {store: s, data: d, db} = context();
  assert.equal(s.listProfiles().length, 1);
  assert.equal(s.state.name, 'Bạn nhỏ');
  assert.equal(s.state.avatar, '🦉');
  assert.ok(db.has(key(s.activeId)));
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
test('Storage API keeps backup export but does not expose file restore', () => {
  const {store: s} = context();
  const backup = s.exportProfile();
  assert.equal(backup.format, 'little-steps-profile');
  assert.equal(backup.progress.name, s.state.name);
  assert.equal(s.previewImport, undefined);
  assert.equal(s.importProgress, undefined);
});
test('Storage validation works when Object.hasOwn is unavailable', () => {
  const {store: s} = context(new Map(), false, true);
  assert.equal(s.listProfiles().length, 1);
  assert.equal(s.state.name, 'Bạn nhỏ');
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
test('Denied storage creates the default in memory and supports multiple profiles without silent loss', () => {
  const {store: s} = context(new Map(), true);
  assert.equal(s.state.name, 'Bạn nhỏ');
  const a = s.createProfile('An'); s.state.stars = 25; s.save();
  const b = s.createProfile('Bình'); assert.equal(s.state.stars, 0);
  s.selectProfile(a); assert.equal(s.state.stars, 25); assert.ok(s.warning);
  assert.equal(s.exportProfile().progress.stars, 25);
  s.selectProfile(b); assert.equal(s.listProfiles().length, 3);
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
  assert.equal(s.exportProfile().progress.avatar, avatar);
});
