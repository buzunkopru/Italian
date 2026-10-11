import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBank } from '../engine/schema.js';
import { buildExam } from '../tools/build-exam.js';
import { EXAM_VOCAB } from '../generators/handwritten/exam-vocab.js';
import { EXAM_CLOZE_PASSAGES } from '../generators/handwritten/exam-cloze.js';
import { EXAM_COMPLETION } from '../generators/handwritten/exam-completion.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = buildExam();

test('exam questions are valid exam-section items with 5 options', () => {
  assert.deepEqual(validateBank(bank), []);
  for (const q of bank) {
    assert.ok(['vocab', 'cloze', 'completion'].includes(q.section), q.id);
    assert.equal(q.options.length, 5, q.id);
    assert.equal(q.verified, true);
    assert.equal(q.prompt.split('----').length, 2, `exactly one blank: ${q.prompt}`);
    assert.ok(!/[{}]/.test(q.prompt), `unfilled placeholder: ${q.prompt}`);
    assert.ok(!/\s{2,}/.test(q.prompt) && !/\s[.,;:?]/.test(q.prompt), `spacing: ${q.prompt}`);
  }
});

test('every vocab item has 4 distinct wrong answers that differ from the answer', () => {
  for (const [level, prompt, answer, wrong] of EXAM_VOCAB) {
    assert.ok([2, 3, 4].includes(level), prompt);
    assert.equal(wrong.length, 4, prompt);
    const all = [answer, ...wrong].map((x) => x.toLowerCase());
    assert.equal(new Set(all).size, 5, `duplicate option in: ${prompt}`);
  }
});

test('every completion item has one blank and 4 distinct wrong answers', () => {
  for (const [level, prompt, answer, wrong] of EXAM_COMPLETION) {
    assert.ok([3, 4].includes(level), prompt);
    assert.equal(wrong.length, 4, prompt);
    assert.equal(new Set([answer, ...wrong].map((o) => o.toLowerCase())).size, 5, `duplicate option: ${prompt}`);
  }
});

test('every cloze passage has five placeholders matching its five blanks', () => {
  for (const p of EXAM_CLOZE_PASSAGES) {
    assert.equal(p.blanks.length, 5, p.text.slice(0, 40));
    for (let n = 1; n <= 5; n++) assert.equal(p.text.split(`{${n}}`).length, 2, `{${n}} in: ${p.text.slice(0, 40)}`);
    for (const [answer, wrong] of p.blanks) {
      assert.equal(wrong.length, 4);
      assert.equal(new Set([answer, ...wrong].map((x) => x.toLowerCase())).size, 5, `duplicate option for ${answer}`);
    }
  }
});

test('checked-in exam-hand.json is up to date', () => {
  const file = JSON.parse(readFileSync(join(root, 'content', 'questions', 'exam-hand.json'), 'utf8'));
  assert.deepEqual(file, bank, 'run: npm run exam');
});
