// Daily streak, based on the user's LOCAL calendar day (not UTC).
import { localDay, dayDiff } from './dates.js';

export { localDay };

/** Streak to DISPLAY right now: still alive if last study was today or yesterday. */
export function currentStreak(state, today) {
  if (!state || !state.lastActive) return 0;
  return dayDiff(state.lastActive, today) <= 1 ? state.streak || 0 : 0;
}

/** Call when the user studies. Returns the new state {streak, lastActive}. */
export function recordStudyDay(state, today) {
  if (!state || !state.lastActive) return { streak: 1, lastActive: today };
  const gap = dayDiff(state.lastActive, today);
  if (gap <= 0) return { streak: Math.max(1, state.streak || 1), lastActive: state.lastActive };
  if (gap === 1) return { streak: (state.streak || 0) + 1, lastActive: today };
  return { streak: 1, lastActive: today };
}
