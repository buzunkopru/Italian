import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickQuestions, historyOf, shuffleOptions, shuffle } from '../engine/picker.js';
import { seeded, makeQ } from './helpers.js';

const pool = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => makeQ(id, 't'));

test('unseen questions come before missed ones, then the oldest-correct', () => {
  const history = historyOf([
    { qid: 'a', correct: true, at: 100 },
    { qid: 'b', correct: false, at: 200 },
    { qid: 'c', correct: true, at: 50 },
  ]);
  const ids = pickQuestions({ pool, history, n: 5, rng: seeded(3) }).map((q) => q.id).sort();
  // 3 unseen (d,e,f) + the missed one (b) + the oldest correct (c)
  assert.deepEqual(ids, ['b', 'c', 'd', 'e', 'f']);
});

test('never returns more than asked, or excluded ids, or duplicates', () => {
  const out = pickQuestions({ pool, history: new Map(), n: 4, rng: seeded(1), exclude: new Set(['a']) });
  assert.equal(out.length, 4);
  assert.ok(!out.some((q) => q.id === 'a'));
  assert.equal(new Set(out.map((q) => q.id)).size, 4);
  assert.equal(pickQuestions({ pool: [], history: new Map(), n: 5 }).length, 0);
});

test('historyOf tracks the most recent result per question', () => {
  const h = historyOf([{ qid: 'a', correct: false, at: 1 }, { qid: 'a', correct: true, at: 5 }, { qid: 'a', correct: false, at: 3 }]);
  assert.deepEqual(h.get('a'), { n: 3, lastCorrect: true, lastAt: 5 });
});

test('shuffleOptions keeps the right answer pointing at the right text', () => {
  const q = { ...makeQ('x', 't'), options: ['one', 'two', 'three', 'four', 'five'], answer: 2 };
  for (let seed = 1; seed < 30; seed++) {
    const s = shuffleOptions(q, seeded(seed));
    assert.equal(s.options[s.answer], 'three');
    assert.deepEqual([...s.options].sort(), [...q.options].sort());
  }
  assert.equal(q.answer, 2); // original untouched
});

test('shuffle is a permutation', () => {
  assert.deepEqual(shuffle([1, 2, 3, 4, 5], seeded(9)).sort(), [1, 2, 3, 4, 5]);
});
