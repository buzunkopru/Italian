import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak, recordStudyDay, localDay } from '../engine/streak.js';

test('first study day starts a streak of 1', () => {
  assert.deepEqual(recordStudyDay(null, '2026-10-11'), { streak: 1, lastActive: '2026-10-11' });
});

test('studying on consecutive days grows the streak', () => {
  const s = recordStudyDay({ streak: 4, lastActive: '2026-10-10' }, '2026-10-11');
  assert.deepEqual(s, { streak: 5, lastActive: '2026-10-11' });
});

test('studying twice in a day does not double count', () => {
  const s = recordStudyDay({ streak: 4, lastActive: '2026-10-11' }, '2026-10-11');
  assert.equal(s.streak, 4);
});

test('missing a day resets to 1', () => {
  assert.equal(recordStudyDay({ streak: 9, lastActive: '2026-10-08' }, '2026-10-11').streak, 1);
});

test('displayed streak survives until the end of the next day, then drops', () => {
  const st = { streak: 6, lastActive: '2026-10-10' };
  assert.equal(currentStreak(st, '2026-10-10'), 6);
  assert.equal(currentStreak(st, '2026-10-11'), 6);
  assert.equal(currentStreak(st, '2026-10-12'), 0);
  assert.equal(currentStreak(null, '2026-10-12'), 0);
});

test('works across month and year ends', () => {
  assert.equal(recordStudyDay({ streak: 2, lastActive: '2026-12-31' }, '2027-01-01').streak, 3);
});

test('localDay formats as YYYY-MM-DD', () => {
  assert.match(localDay(new Date(2026, 0, 5)), /^2026-01-05$/);
});
