import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateQuestion, validateBank } from '../engine/schema.js';

const good = {
  id: 'g-1', section: 'grammar', topic: 'congiuntivo.presente', level: 3,
  prompt: 'Penso che Marco ---- stanco.', options: ['è', 'sia', 'era', 'sarebbe', 'fosse'],
  answer: 1, explain: "'Penso che' needs the subjunctive.", source: 'hand', verified: true,
};

test('accepts a valid exam question', () => {
  assert.deepEqual(validateQuestion(good), []);
});

test('exam sections need exactly 5 options; drills may have 4', () => {
  const four = { ...good, options: ['è', 'sia', 'era', 'fosse'] };
  assert.match(validateQuestion(four).join(), /5 options/);
  assert.deepEqual(validateQuestion({ ...four, section: 'drill' }), []);
});

test('rejects bad answer index, duplicates, empty fields', () => {
  assert.match(validateQuestion({ ...good, answer: 5 }).join(), /out of range/);
  assert.match(validateQuestion({ ...good, options: ['a', 'A', 'b', 'c', 'd'] }).join(), /duplicate options/);
  assert.match(validateQuestion({ ...good, prompt: ' ' }).join(), /prompt/);
  assert.match(validateQuestion({ ...good, section: 'nope' }).join(), /section/);
  assert.match(validateQuestion({ ...good, level: 9 }).join(), /level/);
});

test('unknown topics are caught when a topic list is given', () => {
  const known = new Set(['congiuntivo.presente']);
  assert.deepEqual(validateQuestion(good, { knownTopics: known }), []);
  assert.match(validateQuestion({ ...good, topic: 'made.up' }, { knownTopics: known }).join(), /unknown topic/);
});

test('generated items must be marked verified', () => {
  assert.match(validateQuestion({ ...good, source: 'generated', verified: false }).join(), /verified/);
});

test('validateBank reports duplicate ids', () => {
  const problems = validateBank([good, { ...good }]);
  assert.equal(problems.length, 1);
  assert.match(problems[0].errors.join(), /duplicate id/);
});
