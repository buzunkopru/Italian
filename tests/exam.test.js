import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBank } from '../engine/schema.js';
import { buildExam } from '../tools/build-exam.js';
import { EXAM_VOCAB } from '../generators/handwritten/exam-vocab.js';
import { EXAM_CLOZE_PASSAGES } from '../generators/handwritten/exam-cloze.js';
import { EXAM_DIALOGUE } from '../generators/handwritten/exam-dialogue.js';
import { EXAM_READING } from '../generators/handwritten/exam-reading.js';
import { EXAM_PARAPHRASE } from '../generators/handwritten/exam-paraphrase.js';
import { EXAM_GRAMMAR } from '../generators/handwritten/exam-grammar.js';
import { EXAM_TRANSLATION } from '../generators/handwritten/exam-translation.js';
import { EXAM_PARAGRAPH } from '../generators/handwritten/exam-paragraph.js';
import { EXAM_IRRELEVANT } from '../generators/handwritten/exam-irrelevant.js';
import { EXAM_COMPLETION } from '../generators/handwritten/exam-completion.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = buildExam();

test('exam questions are valid exam-section items with 5 options', () => {
  assert.deepEqual(validateBank(bank), []);
  for (const q of bank) {
    assert.ok(['vocab', 'cloze', 'completion', 'dialogue', 'paraphrase', 'reading', 'grammar', 'translation', 'paragraph', 'irrelevant'].includes(q.section), q.id);
    assert.equal(q.options.length, 5, q.id);
    assert.equal(q.verified, true);
    if (!['paraphrase', 'reading', 'translation', 'irrelevant'].includes(q.section)) assert.equal(q.prompt.split('----').length, 2, `exactly one blank: ${q.prompt}`);
    else assert.ok(!q.prompt.includes('----'), q.prompt);
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

test('dialogue items alternate A:/B: with the blank on a B line; paraphrase items are distinct sentences', () => {
  for (const [, prompt, answer, wrong] of EXAM_DIALOGUE) {
    const lines = prompt.split('\n');
    assert.ok(lines.every((l) => /^[AB]: /.test(l)), prompt);
    assert.ok(lines.some((l) => l.startsWith('B: ----')), prompt);
    assert.equal(new Set([answer, ...wrong].map((o) => o.toLowerCase())).size, 5, prompt);
  }
  for (const [, sentence, answer, wrong] of EXAM_PARAPHRASE) {
    assert.equal(wrong.length, 4, sentence);
    assert.ok(![answer, ...wrong].includes(sentence), `option repeats the stem: ${sentence}`);
    assert.equal(new Set([answer, ...wrong].map((o) => o.toLowerCase())).size, 5, sentence);
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

test('reading passages: 4 questions each, unique ids, passage and group carried on every question', () => {
  const reading = bank.filter((q) => q.section === 'reading');
  assert.equal(reading.length, EXAM_READING.length * 4);
  assert.equal(new Set(reading.map((q) => q.id)).size, reading.length);
  for (const p of EXAM_READING) {
    assert.equal(p.questions.length, 4, p.id);
    assert.ok(p.text.split(/\s+/).length >= 70, `${p.id} is too short`);
    const qs = reading.filter((q) => q.group === `read-${p.id}`);
    assert.equal(qs.length, 4, p.id);
    for (const q of qs) assert.equal(q.passage, p.text);
  }
});

test('grammar, translation, paragraph and irrelevant-sentence items are well formed', () => {
  const uniq = (answer, wrong) => new Set([answer, ...wrong].map((o) => o.toLowerCase())).size === 5;
  for (const [, prompt, answer, wrong] of EXAM_GRAMMAR) assert.ok(wrong.length === 4 && uniq(answer, wrong), prompt);
  for (const [, dir, sentence, answer, wrong] of EXAM_TRANSLATION) {
    assert.ok(['en-it', 'it-en'].includes(dir), sentence);
    assert.ok(wrong.length === 4 && uniq(answer, wrong), sentence);
  }
  for (const [, prompt, answer, wrong] of EXAM_PARAGRAPH) assert.ok(wrong.length === 4 && uniq(answer, wrong), prompt);
  for (const [, sentences, odd] of EXAM_IRRELEVANT) {
    assert.equal(sentences.length, 5);
    assert.ok(odd >= 1 && odd <= 5);
  }
  const irr = bank.filter((q) => q.section === 'irrelevant');
  assert.equal(irr.length, EXAM_IRRELEVANT.length);
  for (const q of irr) assert.deepEqual(q.options, ['Frase 1', 'Frase 2', 'Frase 3', 'Frase 4', 'Frase 5']);
  const both = bank.filter((q) => q.section === 'translation');
  assert.ok(both.some((q) => q.prompt.startsWith('Best Italian')) && both.some((q) => q.prompt.startsWith('Best English')));
});
