// Lesson 1.2: definite / indefinite articles and preposition + article contractions.
import { NOUNS, DEFINITE_FORMS, INDEFINITE_FORMS, CONTRACTIONS } from './data/nouns.js';
import { makeQuestion, pickN } from './util.js';

const VOWEL = /^[aeiouàèéìòù]/i;
// masculine nouns that take lo/uno: z, gn, ps, pn, x, y, s + consonant
const LO_CLASS = /^(z|gn|ps|pn|x|y|s[^aeiou])/i;

export const startsWithVowel = (w) => VOWEL.test(w);
export const takesLo = (w) => LO_CLASS.test(w);

/** Definite article for a noun: g = 'm'|'f', num = 's'|'p'. Class is decided by the SINGULAR form. */
export function definiteArticle(sg, g, num) {
  if (g === 'f') return num === 'p' ? 'le' : startsWithVowel(sg) ? "l'" : 'la';
  if (num === 'p') return takesLo(sg) || startsWithVowel(sg) ? 'gli' : 'i';
  if (startsWithVowel(sg)) return "l'";
  return takesLo(sg) ? 'lo' : 'il';
}

export function indefiniteArticle(sg, g) {
  if (g === 'f') return startsWithVowel(sg) ? "un'" : 'una';
  return takesLo(sg) ? 'uno' : 'un';
}

/** 'l'' + noun joins without a space. */
export const join = (art, noun) => (art.endsWith("'") ? art + noun : `${art} ${noun}`);

/** Contracted preposition + article. */
export function contract(prep, article) {
  return CONTRACTIONS[prep][DEFINITE_FORMS.indexOf(article)];
}

const ARTICLE_RULE_TEXT = {
  il: "'il' = masculine singular before a normal consonant",
  lo: "'lo' = masculine singular before z, gn, ps, x, y or s + consonant",
  "l'": "'l'' = singular before a vowel",
  la: "'la' = feminine singular before a consonant",
  i: "'i' = plural of 'il'",
  gli: "'gli' = plural of 'lo' and of masculine 'l''",
  le: "'le' = feminine plural",
};

function definiteQuestions(rng) {
  const out = [];
  for (const n of NOUNS) {
    for (const num of ['s', 'p']) {
      const noun = num === 's' ? n.sg : n.pl;
      const answer = definiteArticle(n.sg, n.g, num);
      const fem = n.g === 'f';
      const frame = num === 's' ? `${fem ? 'Questa' : 'Questo'} è ---- ${noun}.` : `${fem ? 'Queste' : 'Questi'} sono ---- ${noun}.`;
      // never offer a debatable alternative: 'la' before a vowel-initial feminine noun
      const pool = DEFINITE_FORMS.filter((f) => f !== answer && !(fem && startsWithVowel(n.sg) && f === 'la'));
      const q = makeQuestion({
        gen: 'def', topic: 'lesson.1.2', rng, prompt: frame, answer,
        distractors: pickN(pool, 6, rng),
        explain: `${noun}: ${num === 's' ? 'singular' : 'plural'}, ${fem ? 'feminine' : 'masculine'} → ${join(answer, noun)}. ${ARTICLE_RULE_TEXT[answer]}.`,
      });
      if (q) out.push(q);
    }
  }
  return out;
}

function indefiniteQuestions(rng) {
  const out = [];
  for (const n of NOUNS) {
    const answer = indefiniteArticle(n.sg, n.g);
    const fem = n.g === 'f';
    const pool = INDEFINITE_FORMS.filter((f) => f !== answer && !(fem && startsWithVowel(n.sg) && f === 'una'));
    // for a feminine vowel noun only 3 other forms exist minus 'una' -> 2 distractors: pad with a definite article
    const padded = [...pool, ...(pool.length < 3 ? ['il', 'lo'] : [])];
    const q = makeQuestion({
      gen: 'indef', topic: 'lesson.1.2', rng, prompt: `C'è ---- ${n.sg}.`, answer,
      distractors: padded,
      explain: `${n.sg} is ${fem ? 'feminine' : 'masculine'}: ${join(answer, n.sg)}. ` +
        (answer === 'uno' ? "'uno' before z, gn, ps, x, y, s + consonant." : answer === "un'" ? "'un'' = feminine before a vowel." : answer === 'una' ? "'una' = feminine before a consonant." : "'un' = masculine (no apostrophe!)."),
    });
    if (q) out.push(q);
  }
  return out;
}

const FRAMES = {
  a: { kind: 'person', sg: (n) => `Telefono ---- ${n}.`, pl: (n) => `Telefono ---- ${n}.` },
  di: { kind: 'person', sg: (n) => `Questo è il libro ---- ${n}.`, pl: (n) => `Questo è il libro ---- ${n}.` },
  da: { kind: 'person', sg: (n) => `Vado ---- ${n}.`, pl: (n) => `Vado ---- ${n}.` },
  in: { kind: 'thing', place: 'in', sg: (n) => `Il libro è ---- ${n}.`, pl: (n) => `I libri sono ---- ${n}.` },
  su: { kind: 'thing', place: 'on', sg: (n) => `Il gatto è ---- ${n}.`, pl: (n) => `I gatti sono ---- ${n}.` },
};

function contractionQuestions(rng) {
  const out = [];
  for (const [prep, f] of Object.entries(FRAMES)) {
    for (const n of NOUNS.filter((x) => x.kind === f.kind && (!f.place || x.place === f.place))) {
      for (const num of ['s', 'p']) {
        const noun = num === 's' ? n.sg : n.pl;
        const art = definiteArticle(n.sg, n.g, num);
        const answer = contract(prep, art);
        const others = CONTRACTIONS[prep].filter((x) => x !== answer);
        const q = makeQuestion({
          gen: 'contr', topic: 'lesson.1.2', rng, answer,
          prompt: (num === 's' ? f.sg : f.pl)(noun),
          distractors: pickN(others, 6, rng),
          explain: `${prep} + ${join(art, noun)} → ${join(answer, noun)}.`,
        });
        if (q) out.push(q);
      }
    }
  }
  return out;
}

export function generate(rng) {
  return [...definiteQuestions(rng), ...indefiniteQuestions(rng), ...contractionQuestions(rng)];
}
