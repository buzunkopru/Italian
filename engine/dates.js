// Calendar-day helpers. Days are local "YYYY-MM-DD" strings.

export function localDay(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const utc = (day) => {
  const [y, m, d] = day.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Whole days from a to b (DST-safe: compares UTC midnights). */
export function dayDiff(a, b) {
  return Math.round((utc(b) - utc(a)) / 86400000);
}

export function addDays(day, n) {
  const dt = new Date(utc(day) + n * 86400000);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}
