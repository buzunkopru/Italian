// Daily streak, based on the user's LOCAL calendar day (not UTC).

export function localDay(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dayDiff(a, b) {
  // whole days from a to b (both YYYY-MM-DD), DST-safe because we use UTC midnights
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

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
