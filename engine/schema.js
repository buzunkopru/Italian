// Question schema: shared by the validator tool, the tests and the app.

// Exam sections and how many questions each has in the real 80-question paper
// (template from the 2013 English YDS booklet).
export const EXAM_SECTIONS = {
  vocab: 6,
  grammar: 10,
  cloze: 10,
  completion: 10,
  translation: 6,
  reading: 20,
  dialogue: 5,
  paraphrase: 4,
  paragraph: 4,
  irrelevant: 5,
};

// 'drill' = quick practice that is not tied to an exam section.
export const SECTIONS = [...Object.keys(EXAM_SECTIONS), 'drill'];
export const SOURCES = ['v1', 'hand', 'generated', 'tatoeba'];

const TOPIC_RE = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

/**
 * Validate one question. Returns an array of problem strings (empty = valid).
 * @param {object} q
 * @param {{knownTopics?: Set<string>}} [opts]
 */
export function validateQuestion(q, opts = {}) {
  const errs = [];
  const need = (cond, msg) => { if (!cond) errs.push(msg); };

  if (!q || typeof q !== 'object') return ['not an object'];
  need(typeof q.id === 'string' && q.id.length > 0, 'missing id');
  need(SECTIONS.includes(q.section), `unknown section "${q.section}"`);
  need(typeof q.topic === 'string' && TOPIC_RE.test(q.topic), `bad topic "${q.topic}"`);
  if (opts.knownTopics && typeof q.topic === 'string') {
    need(opts.knownTopics.has(q.topic), `unknown topic "${q.topic}"`);
  }
  need(Number.isInteger(q.level) && q.level >= 1 && q.level <= 4, 'level must be 1-4');
  need(typeof q.prompt === 'string' && q.prompt.trim().length > 0, 'missing prompt');
  need(typeof q.explain === 'string' && q.explain.trim().length > 0, 'missing explain');
  need(SOURCES.includes(q.source), `unknown source "${q.source}"`);
  need(typeof q.verified === 'boolean', 'verified must be true/false');

  const isExam = q.section !== 'drill';
  if (Array.isArray(q.options)) {
    const n = q.options.length;
    need(isExam ? n === 5 : n === 4 || n === 5, `needs ${isExam ? 5 : '4 or 5'} options, has ${n}`);
    need(q.options.every((o) => typeof o === 'string' && o.trim()), 'empty option');
    const norm = q.options.map((o) => String(o).trim().toLowerCase());
    need(new Set(norm).size === norm.length, 'duplicate options');
    need(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < n, 'answer index out of range');
  } else {
    errs.push('options must be an array');
  }

  if (q.section === 'reading') {
    need(typeof q.passage === 'string' && q.passage.trim().length > 0, 'reading questions need a passage');
    need(typeof q.group === 'string' && q.group.length > 0, 'reading questions need a group');
  }

  // Exam sections only ever serve verified items, so require a verified flag consistent with source.
  if (q.source === 'generated') need(q.verified === true, 'generated items must be verified (rule-tested)');
  return errs;
}

/** Validate a list; also checks id uniqueness. Returns [{id, errors}] for the bad ones. */
export function validateBank(questions, opts = {}) {
  const problems = [];
  const seen = new Set();
  for (const q of questions) {
    const errors = validateQuestion(q, opts);
    if (q && seen.has(q.id)) errors.push('duplicate id');
    if (q) seen.add(q.id);
    if (errors.length) problems.push({ id: q?.id ?? '(no id)', errors });
  }
  return problems;
}
