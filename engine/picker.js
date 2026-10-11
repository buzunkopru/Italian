// Choosing questions for a round.

export function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** qid -> { n, lastCorrect, lastAt } from the answer log. */
export function historyOf(answers) {
  const h = new Map();
  for (const a of answers) {
    const cur = h.get(a.qid);
    if (!cur) h.set(a.qid, { n: 1, lastCorrect: a.correct, lastAt: a.at });
    else {
      cur.n += 1;
      if (a.at >= cur.lastAt) { cur.lastCorrect = a.correct; cur.lastAt = a.at; }
    }
  }
  return h;
}

/**
 * Pick up to n questions from pool: unseen first, then last-answered-wrong,
 * then the ones practised longest ago. Random within each tier.
 */
export function pickQuestions({ pool, history, n, rng = Math.random, exclude = new Set() }) {
  const tiers = [[], [], []];
  for (const q of pool) {
    if (exclude.has(q.id)) continue;
    const h = history.get(q.id);
    if (!h) tiers[0].push(q);
    else if (!h.lastCorrect) tiers[1].push(q);
    else tiers[2].push(q);
  }
  tiers[2].sort((a, b) => history.get(a.id).lastAt - history.get(b.id).lastAt);
  const picked = [...shuffle(tiers[0], rng), ...shuffle(tiers[1], rng), ...tiers[2]].slice(0, n);
  return shuffle(picked, rng);
}

/** Copy of q with options in random order and `answer` re-pointed. */
export function shuffleOptions(q, rng = Math.random) {
  if (q.ordered) return q; // options like "Frase 1…5" keep their order
  const idx = shuffle(q.options.map((_, i) => i), rng);
  return { ...q, options: idx.map((i) => q.options[i]), answer: idx.indexOf(q.answer) };
}
