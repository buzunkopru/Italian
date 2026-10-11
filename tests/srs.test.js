import { test } from 'node:test';
import assert from 'node:assert/strict';
import { review, newState, dueKeys, isDue, INTERVALS } from '../engine/srs.js';
import { addDays, dayDiff } from '../engine/dates.js';

test('correct answers climb the boxes with growing gaps, capped at box 5', () => {
  let s = newState('2026-10-01');
  const seen = [];
  let day = '2026-10-01';
  for (let i = 0; i < 6; i++) {
    s = review(s, true, day);
    seen.push([s.box, dayDiff(day, s.due)]);
    day = s.due;
  }
  assert.deepEqual(seen, [[2, 3], [3, 7], [4, 16], [5, 35], [5, 35], [5, 35]]);
});

test('a wrong answer drops to box 1, due tomorrow, and counts a lapse', () => {
  const s = review({ box: 4, due: '2026-10-01', reps: 5, lapses: 0 }, false, '2026-10-01');
  assert.deepEqual(s, { box: 1, due: '2026-10-02', reps: 6, lapses: 1 });
});

test('review does not mutate its input and handles a missing state', () => {
  const before = { box: 2, due: '2026-10-01', reps: 1, lapses: 0 };
  const copy = { ...before };
  review(before, true, '2026-10-01');
  assert.deepEqual(before, copy);
  assert.equal(review(undefined, true, '2026-10-01').box, 2);
});

test('dueKeys returns only due items, most overdue first', () => {
  const m = { a: { due: '2026-10-05' }, b: { due: '2026-10-01' }, c: { due: '2026-10-20' }, d: { due: '2026-10-11' } };
  assert.deepEqual(dueKeys(m, '2026-10-11'), ['b', 'a', 'd']);
  assert.equal(isDue(m.c, '2026-10-11'), false);
});

test('addDays crosses months, years and leap days', () => {
  assert.equal(addDays('2026-12-30', 3), '2027-01-02');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2026-03-28', 35), '2026-05-02');
  assert.equal(INTERVALS[5], 35);
});
