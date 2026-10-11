// Accuracy per topic / section. Recent answers count more (exponential half-life).

export const HALF_LIFE_DAYS = 14;

function stats(answers, keyOf, now, halfLife) {
  const out = new Map();
  for (const a of answers) {
    const key = keyOf(a);
    if (!key) continue;
    const ageDays = Math.max(0, (now - a.at) / 86400000);
    const w = Math.pow(0.5, ageDays / halfLife);
    const s = out.get(key) || { n: 0, wSum: 0, wRight: 0, last: 0 };
    s.n += 1;
    s.wSum += w;
    s.wRight += a.correct ? w : 0;
    s.last = Math.max(s.last, a.at);
    out.set(key, s);
  }
  for (const s of out.values()) s.acc = s.wSum ? s.wRight / s.wSum : 0;
  return out;
}

export const topicStats = (answers, now = Date.now(), halfLife = HALF_LIFE_DAYS) => stats(answers, (a) => a.topic, now, halfLife);
export const sectionStats = (answers, now = Date.now(), halfLife = HALF_LIFE_DAYS) => stats(answers, (a) => a.section, now, halfLife);

/** Lowest-accuracy topic with at least `minN` answers. Ties go to the least recently practised. */
export function weakestTopic(topicStatMap, { minN = 5, exclude = [] } = {}) {
  let best = null;
  for (const [topic, s] of topicStatMap) {
    if (s.n < minN || exclude.includes(topic)) continue;
    if (!best || s.acc < best.acc || (s.acc === best.acc && s.last < best.last)) best = { topic, acc: s.acc, last: s.last };
  }
  return best ? best.topic : null;
}
