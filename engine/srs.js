// Leitner spaced repetition. State per item: { box, due, reps, lapses }.
import { addDays } from './dates.js';

export const INTERVALS = { 1: 1, 2: 3, 3: 7, 4: 16, 5: 35 };
export const MAX_BOX = 5;

export const newState = (today) => ({ box: 1, due: today, reps: 0, lapses: 0 });

export const isDue = (state, today) => !!state && state.due <= today;

/** Apply one answer. Returns a NEW state (never mutates). A missing state starts in box 1. */
export function review(state, correct, today) {
  const s = state || newState(today);
  if (correct) {
    const box = Math.min(MAX_BOX, s.box + 1);
    return { box, due: addDays(today, INTERVALS[box]), reps: s.reps + 1, lapses: s.lapses };
  }
  return { box: 1, due: addDays(today, INTERVALS[1]), reps: s.reps + 1, lapses: s.lapses + 1 };
}

/** Keys of items due today or earlier, most overdue first. */
export function dueKeys(srsMap, today) {
  return Object.entries(srsMap)
    .filter(([, s]) => isDue(s, today))
    .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : a[0] < b[0] ? -1 : 1))
    .map(([k]) => k);
}
