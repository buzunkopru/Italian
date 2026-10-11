// Adjective agreement (1.8), numbers (1.10), adverbs in -mente (2.9).
import { NOUNS, ADJECTIVES } from './data/nouns.js';
import { definiteArticle, join } from './articles.js';
import { makeQuestion, shuffleCopy } from './util.js';

// ---------- 1.8 adjective agreement ----------
const FORM_INDEX = { ms: 0, fs: 1, mp: 2, fp: 3 };
const GN_TEXT = { ms: 'masculine singular', fs: 'feminine singular', mp: 'masculine plural', fp: 'feminine plural' };

function adjectiveQuestions(rng) {
  const out = [];
  const nouns = NOUNS.filter((n) => n.sg !== 'università'); // invariable plural would be ambiguous
  for (const n of nouns) {
    const adjs = ADJECTIVES.filter((a) => a.for.includes(n.kind));
    for (const a of adjs) {
      for (const num of ['s', 'p']) {
        const key = n.g + num;
        const answer = a.forms[FORM_INDEX[key]];
        const noun = num === 's' ? n.sg : n.pl;
        const phrase = num === 's' ? join(definiteArticle(n.sg, n.g, 's'), noun) : join(definiteArticle(n.sg, n.g, 'p'), noun);
        const copula = num === 's' ? 'è' : 'sono';
        const q = makeQuestion({
          gen: 'adj', topic: 'lesson.1.8', rng,
          prompt: `${phrase[0].toUpperCase()}${phrase.slice(1)} ${copula} ----.`,
          answer,
          distractors: shuffleCopy(a.forms.filter((f) => f !== answer), rng),
          explain: `${noun} = ${GN_TEXT[key]} → ${answer}. ${a.forms[0]} has four forms: ${a.forms.join(' / ')} (m.sg / f.sg / m.pl / f.pl).`,
        });
        if (q) out.push(q);
      }
    }
  }
  return out;
}

// ---------- 1.10 numbers ----------
const UNITS = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'];
const TEENS = ['dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
const TENS = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];

/** Italian number words for 0-99, multiples of 100 up to 900, and 1000-9000 by thousands. */
export function numberWords(n) {
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return TENS[t];
    let stem = TENS[t];
    if (u === 1 || u === 8) stem = stem.slice(0, -1); // ventuno, ventotto
    return stem + (u === 3 ? 'tré' : UNITS[u]); // ventitré
  }
  if (n % 100 === 0 && n < 1000) return n === 100 ? 'cento' : UNITS[n / 100] + 'cento';
  if (n % 1000 === 0 && n <= 9000) return n === 1000 ? 'mille' : UNITS[n / 1000] + 'mila';
  throw new Error(`numberWords: unsupported ${n}`);
}

const NUMBER_POOL = [
  ...Array.from({ length: 100 }, (_, i) => i),
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000,
];

function nearNumbers(n) {
  const s = String(n);
  const cands = new Set();
  if (n < 100) {
    cands.add(n + 1); cands.add(n - 1); cands.add(n + 10); cands.add(n - 10);
    if (n >= 10) cands.add(Number(s.split('').reverse().join(''))); // 27 -> 72
    if (n >= 13 && n <= 19) cands.add((n - 10) * 10); // 13 vs 30
    if (n >= 30 && n % 10 === 0) cands.add(n / 10 + 10); // 30 vs 13
  } else {
    cands.add(n + 100); cands.add(n - 100); cands.add(n * 10); cands.add(n / 10);
  }
  cands.delete(n);
  return [...cands].filter((x) => Number.isInteger(x) && x >= 0 && NUMBER_POOL.includes(x));
}

function numberQuestions(rng) {
  const out = [];
  for (const n of NUMBER_POOL) {
    const near = nearNumbers(n);
    const fill = shuffleCopy(NUMBER_POOL.filter((x) => Math.abs(x - n) <= 15 && x !== n), rng);
    const cands = [...near, ...fill];
    const w = numberWords(n);
    out.push(makeQuestion({
      gen: 'num-w', topic: 'lesson.1.10', rng,
      prompt: `Write ${n} in Italian: ----`,
      answer: w,
      distractors: cands.map(numberWords),
      explain: `${n} = ${w}.${n >= 21 && n < 100 && n % 10 === 3 ? ' (tré gets an accent in compounds)' : ''}${n % 10 === 1 || n % 10 === 8 ? ' (the final vowel of the ten drops before uno / otto)' : ''}`,
    }));
    out.push(makeQuestion({
      gen: 'num-d', topic: 'lesson.1.10', rng,
      prompt: `Which number is “${w}”?`,
      answer: String(n),
      distractors: cands.map(String),
      explain: `${w} = ${n}.`,
    }));
  }
  return out.filter(Boolean);
}

// ---------- 2.9 adverbs in -mente ----------
const ADVERB_ADJECTIVES = [
  'chiaro', 'lento', 'rapido', 'attento', 'tranquillo', 'preciso', 'sicuro', 'diverso', 'diretto', 'attivo', 'calmo',
  'facile', 'gentile', 'normale', 'regolare', 'difficile', 'semplice', 'veloce', 'felice', 'paziente', 'elegante', 'probabile',
];

/** Adjective -> adverb. -o -> -amente; -le/-re after a vowel drops the e (facilmente); other -e adds -mente. */
export function adverbOf(adj) {
  if (adj.endsWith('o')) return adj.slice(0, -1) + 'amente';
  if (/[aeiou][lr]e$/.test(adj)) return adj.slice(0, -1) + 'mente';
  return adj + 'mente';
}

const ADV_SUBJECTS = [
  ['Marco', 'risponde'], ['Giulia', 'parla'], ['Il professore', 'spiega'], ['La dottoressa', 'lavora'],
  ['Luca', 'guida'], ['Anna', 'scrive'], ['Il bambino', 'cammina'], ['La studentessa', 'legge'],
];

function adverbQuestions(rng) {
  const out = [];
  for (const adj of ADVERB_ADJECTIVES) {
    const answer = adverbOf(adj);
    const base = adj.slice(0, -1);
    const wrong = [`${base}amente`, `${base}emente`, `${base}omente`, `${base}imente`, `${adj}mente`].filter((w) => w !== answer);
    for (const [name, verb] of shuffleCopy(ADV_SUBJECTS, rng).slice(0, 4)) {
      out.push(makeQuestion({
        gen: 'adv', topic: 'lesson.2.9', rng,
        prompt: `${name} ${verb} in modo ${adj}: ${verb} ----.`,
        answer,
        distractors: shuffleCopy(wrong, rng),
        explain: `${adj} → ${answer}. ` + (adj.endsWith('o') ? 'Adjective in -o: take the feminine (-a) + -mente.' : /[aeiou][lr]e$/.test(adj) ? 'Adjective in -le/-re: drop the final e, then -mente.' : 'Adjective in -e: just add -mente.'),
      }));
    }
  }
  return out.filter(Boolean);
}

export function generate(rng) {
  return [...adjectiveQuestions(rng), ...numberQuestions(rng), ...adverbQuestions(rng)];
}

