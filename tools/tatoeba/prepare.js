// Turn the raw Tatoeba export into CLOZE CANDIDATES. Nothing here is trusted yet: candidates are reviewed by hand
// (tools/tatoeba/review.js) before build.js writes them into the question bank.
//
// usage: node tools/tatoeba/prepare.js <dir with ita_sentences.tsv, ita-eng_links.tsv, eng_sentences.tsv> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REGULAR_VERBS, IRREGULAR_PRESENT, conjugatePresent } from '../../generators/data/verbs.js';
import { seeded } from '../../generators/util.js';
import { shuffle } from '../../engine/picker.js';

const [dir, outFile] = process.argv.slice(2);
if (!dir || !outFile) { console.error('usage: prepare.js <tatoeba dir> <out.json>'); process.exit(1); }

const read = (f) => readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t'));
const ita = new Map(read('ita_sentences.tsv').map(([id, , text]) => [id, text]));
const eng = new Map(read('eng_sentences.tsv').map(([id, , text]) => [id, text]));
const links = new Map(); // ita id -> first english text
for (const [a, b] of read('ita-eng_links.tsv')) if (!links.has(a) && eng.has(b)) links.set(a, eng.get(b));
console.log(`italian ${ita.size}, with english ${links.size}`);

// ---------- tokens and frequency ----------
const TOKEN = /[\p{L}]+'|[\p{L}]+/gu;
const tokens = (s) => s.match(TOKEN) || [];
const freq = new Map();
const capMid = new Map(); // token (lowercase) -> times seen capitalised in the middle of a sentence
const lowMid = new Map();
for (const text of ita.values()) {
  const raw = text.match(TOKEN) || [];
  raw.forEach((t, i) => {
    const l = t.toLowerCase();
    freq.set(l, (freq.get(l) || 0) + 1);
    if (i > 0) {
      if (t[0] !== t[0].toLowerCase()) capMid.set(l, (capMid.get(l) || 0) + 1);
      else lowMid.set(l, (lowMid.get(l) || 0) + 1);
    }
  });
}
const rank = new Map([...freq.entries()].sort((a, b) => b[1] - a[1]).map(([w], i) => [w, i + 1]));
const isName = (l) => (capMid.get(l) || 0) > 2 * (lowMid.get(l) || 0) + 2;
const NAMES = new Set(['tom', 'mary', 'john', 'maria', 'marco', 'giulia', 'luca', 'anna', 'paolo', 'mario', 'sami', 'layla', 'ken', 'bob', 'alice', 'bill', 'dio', 'lui']);

const BAD = /(cazz|merd|puttan|fottut|stronz|sesso|sessual|porn|uccid|ucciso|stupr|suicid|bomba|terror|guerra|morto|morire|morte|cadavere|ammazz|droga|cancro|nazi|hitler|gay|lesbic|negro|ebre|musulman|cristian|religio|pregh|dio\b|gesù|chiesa|papa\b|politic)/i;

function sentenceOk(text) {
  if (!/^[A-ZÀ-Ý]/.test(text)) return false;
  if (!/[.?]$/.test(text)) return false;
  if (/[0-9"«»()\[\]:;!…]/.test(text) || /[.?].+[.?]$/.test(text)) return false;
  if (!/^[\p{L}\s,.'?-]+$/u.test(text)) return false;
  if (BAD.test(text)) return false;
  const t = tokens(text);
  if (t.length < 5 || t.length > 13) return false;
  for (const [i, w] of t.entries()) {
    const l = w.toLowerCase();
    if (NAMES.has(l) || isName(l)) return false;
    if (i > 0 && w[0] !== w[0].toLowerCase()) return false; // capital mid-sentence
    if (!rank.has(l) || rank.get(l) > 4000) return false;
  }
  return true;
}
const levelOf = (toks) => {
  const worst = Math.max(...toks.map((w) => rank.get(w.toLowerCase())));
  return worst <= 600 ? 1 : worst <= 1500 ? 2 : worst <= 3000 ? 3 : 4;
};

// ---------- target classes ----------
const CONN_GROUPS = {
  contrast: { ma: 'but', però: 'but / however', tuttavia: 'however', sebbene: 'although', benché: 'although', nonostante: 'despite / although' },
  cause: { perché: 'because', poiché: 'since / because', siccome: 'since / as' },
  result: { quindi: 'therefore', dunque: 'so / therefore', perciò: 'so / for that reason' },
  time: { quando: 'when', mentre: 'while', finché: 'until / as long as' },
  condition: { se: 'if', purché: 'provided that' },
  addition: { inoltre: 'moreover', infatti: 'in fact' },
};
const CONN_INDEX = new Map();
for (const [g, words] of Object.entries(CONN_GROUPS)) for (const [w, gloss] of Object.entries(words)) CONN_INDEX.set(w, { group: g, gloss });

const PREPS = { di: ['del', 'dello', 'della', 'dei', 'degli', 'delle'], a: ['al', 'allo', 'alla', 'ai', 'agli', 'alle'], da: ['dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle'], in: ['nel', 'nello', 'nella', 'nei', 'negli', 'nelle'], su: ['sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle'] };
const ARTICLE_OF = { 0: 'il', 1: 'lo', 2: 'la', 3: 'i', 4: 'gli', 5: 'le' };
const ARTPREP_INDEX = new Map();
for (const [prep, forms] of Object.entries(PREPS)) forms.forEach((f, i) => ARTPREP_INDEX.set(f, { prep, art: ARTICLE_OF[i], set: forms }));
const ARTICLES = ['il', 'lo', 'la', 'i', 'gli', 'le'];
const INDEF = ['un', 'uno', 'una'];

// nouns whose number or gender cannot be told from the form: never blank an article before them
const AMBIGUOUS_NEXT = new Set(['film', 'città', 'caffè', 'università', 'sport', 'bar', 'crisi', 'tesi', 'analisi', 'ipotesi', 'serie', 'specie', 'computer', 'mano', 'mani', 'radio', 'foto', 'moto', 'auto', 'problema', 'problemi', 'sistema', 'sistemi', 'programma', 'programmi', 'tema', 'temi', 'cinema', 'poeta', 'poeti', 'pianeta', 'pianeti', 'clima', 'collega', 'colleghi', 'colleghe', 'turista', 'turisti', 'turiste', 'artista', 'artisti', 'artiste', 'dentista', 'dentisti', 'dentiste', 'giornalista', 'giornalisti', 'giornaliste', 'pilota', 'piloti', 'idea', 'giorno', 'dopo', 'prima', 'sera', 'mattina', 'altro', 'altra', 'altri', 'altre', 'stesso', 'stessa', 'stessi', 'stesse', 'tutto', 'tutta', 'tutti', 'tutte']);

// present-tense verb forms (hand tables from the generators) -> persons
const FORMS = new Map(); // form -> [{verb, person}]
const PARADIGMS = {};
const addVerb = (verb, forms) => {
  PARADIGMS[verb] = forms;
  forms.forEach((f, person) => { if (!FORMS.has(f)) FORMS.set(f, []); FORMS.get(f).push({ verb, person }); });
};
for (const [v, forms] of Object.entries(IRREGULAR_PRESENT)) addVerb(v, forms);
for (const v of REGULAR_VERBS) addVerb(v.inf, conjugatePresent(v));
const SUBJ = { io: [0], tu: [1], lui: [2], lei: [2], noi: [3], voi: [4], loro: [5] };

// ---------- scan ----------
const out = { conn: [], artprep: [], art: [], verb: [] };
const seen = new Set();
const lc = (s) => s.toLowerCase();

for (const [id, text] of ita) {
  if (!links.has(id) || !sentenceOk(text)) continue;
  const key = lc(text);
  if (seen.has(key)) continue;
  const tk = tokens(text);
  const low = tk.map(lc);
  const level = levelOf(tk);
  const base = { tid: id, text, en: links.get(id), level };

  const only = (pred) => { const idx = low.map((w, i) => (pred(w) ? i : -1)).filter((i) => i >= 0); return idx.length === 1 ? idx[0] : -1; };
  const push = (cls, i, extra) => { out[cls].push({ ...base, cls, target: tk[i], idx: i, ...extra }); seen.add(key); };

  // connectors: exactly one connector in the sentence, not at the very end
  const ci = only((w) => CONN_INDEX.has(w));
  const isQuestion = text.endsWith('?');
  const afterPrep = ci > 0 && ['di', 'a', 'da', 'in', 'con', 'per', 'tra', 'fra', 'su'].includes(low[ci - 1]);
  if (ci >= 0 && ci < tk.length - 1 && !(ci === 0 && isQuestion) && !(low[ci] === 'se' && afterPrep) && !isQuestion) { push('conn', ci, {}); continue; }

  // articulated prepositions: exactly one, non-elided, followed by an unambiguous noun-ish word
  const pi = only((w) => ARTPREP_INDEX.has(w));
  if (pi >= 0 && pi < tk.length - 1) {
    const next = low[pi + 1];
    if (!AMBIGUOUS_NEXT.has(next) && /[oai]$/.test(next) && !next.endsWith("'")) { push('artprep', pi, { next }); continue; }
  }

  // plain articles / indefinite articles: exactly one, directly before an unambiguous word
  const ai = only((w) => ARTICLES.includes(w) || INDEF.includes(w));
  if (ai >= 0 && ai < tk.length - 1) {
    const next = low[ai + 1];
    if (!AMBIGUOUS_NEXT.has(next) && /[oai]$/.test(next) && !next.endsWith("'")) { push('art', ai, { next }); continue; }
  }

  // present-tense verb with an explicit subject pronoun right before it (optionally with "non")
  const vi = low.findIndex((w, i) => {
    if (!FORMS.has(w) || i === 0) return false;
    const prev = low[i - 1] === 'non' ? low[i - 2] : low[i - 1];
    if (!prev || !SUBJ[prev]) return false;
    return FORMS.get(w).some((f) => SUBJ[prev].includes(f.person));
  });
  if (vi > 0) {
    const w = low[vi];
    const prev = low[vi - 1] === 'non' ? low[vi - 2] : low[vi - 1];
    const cand = FORMS.get(w).find((f) => SUBJ[prev].includes(f.person));
    const nVerbForms = low.filter((x) => FORMS.has(x)).length;
    if (nVerbForms <= 2) push('verb', vi, { verb: cand.verb, person: cand.person, subject: prev });
  }
}

const by = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length]));
console.log('candidates:', by);
const rng = seeded(7);
const LIMITS = { conn: 700, artprep: 650, art: 450, verb: 650 };
const picked = {};
const PER = { conn: 70, artprep: 55, art: 80, verb: 45 };
for (const [cls, list] of Object.entries(out)) {
  const used = {};
  picked[cls] = shuffle(list, rng).filter((c) => { const k = c.target.toLowerCase(); used[k] = (used[k] || 0) + 1; return used[k] <= PER[cls]; }).slice(0, LIMITS[cls]);
}
writeFileSync(outFile, JSON.stringify({ conn: CONN_GROUPS, preps: PREPS, paradigms: PARADIGMS, picked }));
console.log('written', outFile, Object.fromEntries(Object.entries(picked).map(([k, v]) => [k, v.length])));
