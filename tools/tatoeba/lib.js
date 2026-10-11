// Build a cloze question from a Tatoeba candidate (shared by review.js and build.js).
import { seeded, hash } from '../../generators/util.js';
import { shuffle } from '../../engine/picker.js';

const ARTICLES = ['il', 'lo', 'la', 'i', 'gli', 'le'];
const INDEF = ['un', 'uno', 'una'];
const PERSON_NAME = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];

const sameCase = (word, like) => (like[0] !== like[0].toLowerCase() ? word[0].toUpperCase() + word.slice(1) : word);
const lower = (s) => s.toLowerCase();

/** Replace the token at word index idx with ---- , keeping the rest of the text exactly as written. */
export function blankAt(text, idx) {
  const re = /[\p{L}]+'|[\p{L}]+/gu;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (i === idx) return text.slice(0, m.index) + '----' + text.slice(m.index + m[0].length);
    i++;
  }
  return null;
}

/** @returns {null | {answer:string, distractors:string[], topic:string, explain:string}} */
export function describe(c, ctx) {
  const rng = seeded(parseInt(hash(c.tid), 36));
  const t = lower(c.target);
  const fix = (w) => sameCase(w, c.target);

  if (c.cls === 'conn') {
    const myGroup = Object.entries(ctx.conn).find(([, ws]) => t in ws);
    if (!myGroup) return null;
    // one word from each of three different other groups -> a different meaning each time.
    // 'se / quando / perché / mentre / finché' are often interchangeable, so they are never offered against each other.
    const SUB = ['time', 'cause', 'condition'];
    const others = Object.entries(ctx.conn).filter(([g]) => g !== myGroup[0] && !(SUB.includes(myGroup[0]) && SUB.includes(g)));
    const picks = shuffle(others, rng).slice(0, 3).map(([, ws]) => shuffle(Object.keys(ws), rng)[0]);
    return {
      answer: c.target,
      distractors: picks.map(fix),
      topic: 'cloze.connectors',
      explain: `${t} = ${myGroup[1][t]}.`,
    };
  }

  if (c.cls === 'artprep') {
    const prep = Object.entries(ctx.preps).find(([, forms]) => forms.includes(t));
    if (!prep) return null;
    const others = prep[1].filter((f) => f !== t);
    const art = ARTICLES[prep[1].indexOf(t)];
    return {
      answer: c.target,
      distractors: shuffle(others, rng).slice(0, 3).map(fix),
      topic: 'cloze.prepositions',
      explain: `${t} = ${prep[0]} + ${art}: the word that follows (“${c.next}”) needs “${art}”.`,
    };
  }

  if (c.cls === 'art') {
    const pool = INDEF.includes(t) ? INDEF : ARTICLES;
    const others = shuffle(pool.filter((f) => f !== t), rng);
    const extra = INDEF.includes(t) ? ['il', 'la'] : [];
    return {
      answer: c.target,
      distractors: [...others, ...extra].slice(0, 3).map(fix),
      topic: 'cloze.articles',
      explain: `“${c.next}” takes “${t}”.`,
    };
  }

  if (c.cls === 'verb') {
    const forms = ctx.paradigms[c.verb];
    if (!forms) return null;
    const others = shuffle(forms.filter((f) => f !== t), rng);
    return {
      answer: c.target,
      distractors: others.slice(0, 3).map(fix),
      topic: 'cloze.verbs',
      explain: `${c.subject} → ${t}. ${c.verb}: ${forms.join(', ')}.`,
    };
  }
  return null;
}

export function toQuestion(c, ctx) {
  const d = describe(c, ctx);
  const prompt = blankAt(c.text, c.idx);
  if (!d || !prompt) return null;
  const rng = seeded(parseInt(hash('o' + c.tid), 36));
  const options = shuffle([d.answer, ...d.distractors], rng);
  if (new Set(options.map(lower)).size !== 4) return null;
  return {
    id: `t-${c.cls}-${c.tid}`,
    section: 'drill',
    topic: d.topic,
    level: c.level,
    prompt,
    options,
    answer: options.indexOf(d.answer),
    explain: d.explain,
    translation: c.en,
    source: 'tatoeba',
    ref: `tatoeba:${c.tid}`,
    verified: false,
  };
}

export const PERSON_LABEL = PERSON_NAME;
