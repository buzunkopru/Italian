// Full timed mock exams: choosing the questions and scoring them.
import { pickQuestions, shuffle } from './picker.js';

// The real paper: 80 questions in 180 minutes, in this section order (see EXAM_SECTIONS).
// Cloze and reading come in whole passages (5 and 4 questions), so they are picked by passage.
export const MOCK_SIZES = {
  full: {
    label: 'Full paper', minutes: 180,
    counts: { vocab: 6, grammar: 10, cloze: 10, completion: 10, translation: 6, reading: 20, dialogue: 5, paraphrase: 4, paragraph: 4, irrelevant: 5 },
  },
  half: {
    label: 'Half paper', minutes: 85,
    counts: { vocab: 3, grammar: 5, cloze: 5, completion: 5, translation: 3, reading: 8, dialogue: 3, paraphrase: 2, paragraph: 2, irrelevant: 3 },
  },
};
const PER_PASSAGE = { cloze: 5, reading: 4 };

export const totalOf = (size) => Object.values(MOCK_SIZES[size].counts).reduce((a, b) => a + b, 0);

/** Group a pool by `group`, keeping file order inside each group. */
function groupsOf(pool) {
  const m = new Map();
  for (const q of pool) {
    if (!m.has(q.group)) m.set(q.group, []);
    m.get(q.group).push(q);
  }
  return [...m.values()];
}

/**
 * Pick the questions for one mock. Unseen material first (fewest previous answers),
 * random among equals. Returns { size, ids, minutes }.
 */
export function buildMock({ questions, size, history, rng = Math.random }) {
  const spec = MOCK_SIZES[size];
  const ids = [];
  for (const [section, n] of Object.entries(spec.counts)) {
    const pool = questions.filter((q) => q.section === section && q.verified);
    if (PER_PASSAGE[section]) {
      const want = Math.round(n / PER_PASSAGE[section]);
      const seen = (qs) => qs.reduce((a, q) => a + (history.get(q.id)?.n || 0), 0);
      const ranked = shuffle(groupsOf(pool), rng).sort((a, b) => seen(a) - seen(b));
      for (const g of ranked.slice(0, want)) ids.push(...g.map((q) => q.id));
    } else {
      ids.push(...pickQuestions({ pool, history, n, rng }).map((q) => q.id));
    }
  }
  return { size, ids, minutes: spec.minutes };
}

/**
 * @param {Map<string, object>} byId
 * @param {string[]} ids
 * @param {Record<string, number>} answers qid -> chosen option index
 */
export function scoreMock(byId, ids, answers) {
  const bySection = {};
  const wrong = [];
  let correct = 0;
  for (const id of ids) {
    const q = byId.get(id);
    if (!q) continue;
    const s = (bySection[q.section] ||= { c: 0, t: 0 });
    s.t++;
    const chosen = answers[id];
    if (chosen === q.answer) { s.c++; correct++; } else wrong.push({ qid: id, chosen: chosen ?? null });
  }
  const total = Object.values(bySection).reduce((a, s) => a + s.t, 0);
  return { correct, total, points: total ? Math.round((correct / total) * 1000) / 10 : 0, bySection, wrong };
}
