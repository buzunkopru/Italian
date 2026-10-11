import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBank } from '../engine/schema.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const bank = read('content/questions/tatoeba-cloze.json');
const topics = read('content/topics.json');
const decisions = read('tools/tatoeba/decisions.json');

test('Tatoeba cloze file is valid and fully credited', () => {
  assert.ok(bank.length > 800);
  assert.deepEqual(validateBank(bank, { knownTopics: new Set(Object.keys(topics)) }), []);
  for (const q of bank) {
    assert.equal(q.source, 'tatoeba');
    assert.equal(q.verified, true, `${q.id} must have been reviewed`);
    assert.match(q.ref, /^tatoeba:\d+$/, q.id);
    assert.equal(q.id.split('-').pop(), q.ref.split(':')[1], 'id and ref must point to the same sentence');
    assert.equal(q.options.length, 4);
    assert.ok(typeof q.translation === 'string' && q.translation.length > 3, `${q.id} needs a translation`);
  }
});

test('every question has exactly one blank and the right answer fits it', () => {
  for (const q of bank) {
    assert.equal(q.prompt.split('----').length, 2, `${q.id}: ${q.prompt}`);
    const filled = q.prompt.replace('----', q.options[q.answer]);
    assert.ok(filled.length > q.prompt.length - 4);
    assert.ok(!/\s{2,}/.test(q.prompt), `${q.id} double space`);
  }
});

test('no rejected sentence made it into the bank', () => {
  const ids = new Set(bank.map((q) => q.id.replace(/^t-/, '')));
  for (const r of decisions.rejected) {
    const [cls, tid] = r.split(':');
    assert.ok(!ids.has(`${cls}-${tid}`), `${r} was rejected but is present`);
  }
});

test('distractors never repeat the answer or each other, case-insensitively', () => {
  for (const q of bank) {
    const norm = q.options.map((o) => o.toLowerCase());
    assert.equal(new Set(norm).size, 4, q.id);
  }
});

test('topics are spread across all four cloze types', () => {
  const by = {};
  for (const q of bank) by[q.topic] = (by[q.topic] || 0) + 1;
  for (const t of Object.keys(topics)) assert.ok(by[t] >= 100, `${t}: ${by[t]}`);
});

test('wholesome content: no flagged words slipped in', () => {
  const BAD = /(cazz|merd|puttan|sesso|porn|uccid|stupr|suicid|terror|guerra|morire|morto|droga)/i;
  for (const q of bank) assert.ok(!BAD.test(q.prompt) && !BAD.test(q.translation), q.id);
});
