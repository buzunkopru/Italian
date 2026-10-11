// Builds the daily "Today" session. Pure: everything it needs is passed in.
import { dueKeys } from './srs.js';
import { pickQuestions, historyOf } from './picker.js';
import { topicStats, weakestTopic } from './mastery.js';
import { EXAM_SECTIONS } from './schema.js';

export const SIZES = {
  full: { reviews: 20, newWords: 10, lesson: 10, weak: 10, exam: 5 },
  short: { reviews: 8, newWords: 0, lesson: 0, weak: 7, exam: 0 },
};

/**
 * @param {object} p
 * @param {string} p.today            'YYYY-MM-DD'
 * @param {number} p.now              ms timestamp (for recency weighting)
 * @param {object} p.srs              key -> srs state
 * @param {object[]} p.answers        answer log
 * @param {object[]} p.questions      whole question bank
 * @param {object[]} p.words          whole word deck
 * @param {object} p.lessonsRead      lessonId -> timestamp
 * @param {object[]} p.lessons        flat ordered lessons [{id, topic}]
 * @param {'full'|'short'} p.mode
 * @returns {{groups: {id:string,title:string,refs:string[]}[], total:number}}
 */
export function buildSession({ today, now = Date.now(), srs, answers, questions, words, lessonsRead = {}, lessons = [], mode = 'full', rng = Math.random }) {
  const size = SIZES[mode] || SIZES.full;
  const history = historyOf(answers);
  const used = new Set();
  const groups = [];
  const add = (id, title, refs) => {
    const fresh = refs.filter((r) => !used.has(r));
    fresh.forEach((r) => used.add(r));
    if (fresh.length) groups.push({ id, title, refs: fresh });
  };

  const usedQ = () => new Set([...used].filter((r) => r.startsWith('q:')).map((r) => r.slice(2)));
  const qById = new Map(questions.map((q) => [q.id, q]));
  const wById = new Map(words.map((w) => [w.id, w]));
  const exists = (key) => (key.startsWith('w:') ? wById.has(key.slice(2)) : qById.has(key));

  // 1. Reviews that are due (skip items whose content no longer exists)
  add('review', 'Reviews', dueKeys(srs, today).filter(exists).slice(0, size.reviews).map((k) => (k.startsWith('w:') ? k : `q:${k}`)));

  // 2. New words (lowest stage first, deck order)
  if (size.newWords) {
    const fresh = words.filter((w) => !srs[`w:${w.id}`]).sort((a, b) => a.stage - b.stage).slice(0, size.newWords);
    add('words', 'New words', fresh.map((w) => `w:${w.id}`));
  }

  // 3. Drill on the lesson you read most recently (if it still has unseen/missed questions)
  let lessonTopic = null;
  if (size.lesson) {
    const readLessons = lessons
      .filter((l) => lessonsRead[l.id])
      .sort((a, b) => lessonsRead[b.id] - lessonsRead[a.id]);
    for (const l of readLessons) {
      const pool = questions.filter((q) => q.topic === l.topic && q.section === 'drill');
      const picked = pickQuestions({ pool, history, n: size.lesson, rng, exclude: usedQ() }).filter((q) => {
        const h = history.get(q.id);
        return !h || !h.lastCorrect;
      });
      if (picked.length) {
        lessonTopic = l.topic;
        add('lesson', `Practice: lesson ${l.id}`, picked.map((q) => `q:${q.id}`));
        break;
      }
    }
  }

  // 4. Weak spot: lowest-accuracy topic, else anything not yet seen
  const stats = topicStats(answers, now);
  const weak = weakestTopic(stats, { minN: 5, exclude: lessonTopic ? [lessonTopic] : [] });
  const drillBank = questions.filter((q) => q.section === 'drill' && !used.has(`q:${q.id}`));
  let weakPool = weak ? drillBank.filter((q) => q.topic === weak) : [];
  let weakTitle = weak ? 'Weak spot' : 'Mixed practice';
  if (!weakPool.length) { weakPool = drillBank; weakTitle = 'Mixed practice'; }
  add('weak', weakTitle, pickQuestions({ pool: weakPool, history, n: size.weak, rng, exclude: usedQ() }).map((q) => `q:${q.id}`));

  // 5. Exam set: verified exam-section questions only; rotate the section by day of year
  if (size.exam) {
    const sections = Object.keys(EXAM_SECTIONS);
    const doy = Math.floor(Date.parse(`${today}T00:00:00Z`) / 86400000);
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[(doy + i) % sections.length];
      const pool = questions.filter((q) => q.section === sec && q.verified);
      if (pool.length) {
        add('exam', `Exam set: ${sec}`, pickQuestions({ pool, history, n: size.exam, rng, exclude: usedQ() }).map((q) => `q:${q.id}`));
        break;
      }
    }
  }

  const total = groups.reduce((a, g) => a + g.refs.length, 0);
  return { groups, total };
}

