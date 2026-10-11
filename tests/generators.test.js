import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { conjugatePresent, conjugateFuture, REGULAR_VERBS, REGULAR_FUTURE_VERBS } from '../generators/data/verbs.js';
import { definiteArticle, indefiniteArticle, contract } from '../generators/articles.js';
import { numberWords, adverbOf } from '../generators/words.js';
import { agree } from '../generators/tenses.js';
import { mid } from '../generators/util.js';
import { validateBank } from '../engine/schema.js';
import { buildAll } from '../tools/build-generated.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const regular = (inf) => REGULAR_VERBS.find((v) => v.inf === inf);
const futureVerb = (inf) => REGULAR_FUTURE_VERBS.find((v) => v.inf === inf);

// ---- golden tables: forms checked by hand against Italian grammar ----

test('regular present tense golden forms', () => {
  const g = {
    parlare: 'parlo parli parla parliamo parlate parlano',
    mangiare: 'mangio mangi mangia mangiamo mangiate mangiano',
    studiare: 'studio studi studia studiamo studiate studiano',
    cercare: 'cerco cerchi cerca cerchiamo cercate cercano',
    pagare: 'pago paghi paga paghiamo pagate pagano',
    giocare: 'gioco giochi gioca giochiamo giocate giocano',
    leggere: 'leggo leggi legge leggiamo leggete leggono',
    dormire: 'dormo dormi dorme dormiamo dormite dormono',
    aprire: 'apro apri apre apriamo aprite aprono',
    capire: 'capisco capisci capisce capiamo capite capiscono',
    finire: 'finisco finisci finisce finiamo finite finiscono',
  };
  for (const [inf, forms] of Object.entries(g)) assert.deepEqual(conjugatePresent(regular(inf)), forms.split(' '), inf);
});

test('regular future golden forms', () => {
  const g = {
    parlare: 'parlerò parlerai parlerà parleremo parlerete parleranno',
    cercare: 'cercherò cercherai cercherà cercheremo cercherete cercheranno',
    pagare: 'pagherò pagherai pagherà pagheremo pagherete pagheranno',
    mangiare: 'mangerò mangerai mangerà mangeremo mangerete mangeranno',
    cominciare: 'comincerò comincerai comincerà cominceremo comincerete cominceranno',
    dormire: 'dormirò dormirai dormirà dormiremo dormirete dormiranno',
    capire: 'capirò capirai capirà capiremo capirete capiranno',
    leggere: 'leggerò leggerai leggerà leggeremo leggerete leggeranno',
  };
  for (const [inf, forms] of Object.entries(g)) assert.deepEqual(conjugateFuture(futureVerb(inf)), forms.split(' '), inf);
});

test('number words golden', () => {
  const g = {
    0: 'zero', 1: 'uno', 13: 'tredici', 16: 'sedici', 17: 'diciassette', 19: 'diciannove', 20: 'venti', 21: 'ventuno',
    23: 'ventitré', 28: 'ventotto', 31: 'trentuno', 33: 'trentatré', 48: 'quarantotto', 55: 'cinquantacinque',
    67: 'sessantasette', 71: 'settantuno', 88: 'ottantotto', 99: 'novantanove', 100: 'cento', 200: 'duecento',
    300: 'trecento', 900: 'novecento', 1000: 'mille', 2000: 'duemila', 3000: 'tremila',
  };
  for (const [n, w] of Object.entries(g)) assert.equal(numberWords(Number(n)), w, n);
  assert.throws(() => numberWords(123));
});

test('adverbs golden', () => {
  const g = {
    chiaro: 'chiaramente', lento: 'lentamente', facile: 'facilmente', gentile: 'gentilmente', normale: 'normalmente',
    regolare: 'regolarmente', difficile: 'difficilmente', semplice: 'semplicemente', veloce: 'velocemente',
    felice: 'felicemente', paziente: 'pazientemente', elegante: 'elegantemente', probabile: 'probabilmente',
    tranquillo: 'tranquillamente',
  };
  for (const [a, adv] of Object.entries(g)) assert.equal(adverbOf(a), adv, a);
});

test('definite and indefinite articles golden', () => {
  const d = [
    ['tavolo', 'm', 's', 'il'], ['libri', null], ['studente', 'm', 's', 'lo'], ['zaino', 'm', 's', 'lo'],
    ['psicologo', 'm', 's', 'lo'], ['specchio', 'm', 's', 'lo'], ['amico', 'm', 's', "l'"], ['uomo', 'm', 's', "l'"],
    ['isola', 'f', 's', "l'"], ['ragazza', 'f', 's', 'la'], ['tavolo', 'm', 'p', 'i'], ['studente', 'm', 'p', 'gli'],
    ['amico', 'm', 'p', 'gli'], ['zaino', 'm', 'p', 'gli'], ['ragazza', 'f', 'p', 'le'], ['isola', 'f', 'p', 'le'],
  ].filter((x) => x[1]);
  for (const [sg, g, n, art] of d) assert.equal(definiteArticle(sg, g, n), art, `${sg} ${g}${n}`);
  const ind = [['zio', 'm', 'uno'], ['amico', 'm', 'un'], ['libro', 'm', 'un'], ['amica', 'f', "un'"], ['borsa', 'f', 'una'], ['studentessa', 'f', 'una'], ['studente', 'm', 'uno']];
  for (const [sg, g, art] of ind) assert.equal(indefiniteArticle(sg, g), art, sg);
});

test('contractions golden', () => {
  const c = [['a', 'il', 'al'], ['a', 'lo', 'allo'], ['a', "l'", "all'"], ['a', 'la', 'alla'], ['a', 'i', 'ai'], ['a', 'gli', 'agli'], ['a', 'le', 'alle'],
    ['di', "l'", "dell'"], ['di', 'i', 'dei'], ['da', 'i', 'dai'], ['da', 'la', 'dalla'], ['in', 'gli', 'negli'], ['in', 'la', 'nella'],
    ['in', 'il', 'nel'], ['su', 'le', 'sulle'], ['su', 'lo', 'sullo'], ['su', 'il', 'sul']];
  for (const [p, a, r] of c) assert.equal(contract(p, a), r, `${p}+${a}`);
});

test('participle agreement golden', () => {
  assert.equal(agree('andato', 'f', 's'), 'andata');
  assert.equal(agree('partito', 'm', 'p'), 'partiti');
  assert.equal(agree('arrivato', 'f', 'p'), 'arrivate');
  assert.equal(agree('sceso', 'm', 's'), 'sceso');
});

test('mid() lowercases ordinary subjects but keeps names', () => {
  assert.equal(mid('Marco'), 'Marco');
  assert.equal(mid('Marco e io'), 'Marco e io');
  assert.equal(mid('Tu e Luca'), 'tu e Luca');
  assert.equal(mid('Il professore'), 'il professore');
  assert.equal(mid('Io'), 'io');
});

// ---- guards on the generator source and output ----

test('generator sources contain no stray control characters', () => {
  const files = [
    ...readdirSync(join(root, 'generators')).filter((f) => f.endsWith('.js')).map((f) => join('generators', f)),
    ...readdirSync(join(root, 'generators', 'data')).map((f) => join('generators', 'data', f)),
  ];
  for (const f of files) {
    const text = readFileSync(join(root, f), 'utf8');
    for (const ch of text) {
      const c = ch.charCodeAt(0);
      assert.ok(!(c < 32 && c !== 9 && c !== 10 && c !== 13), `${f} contains control char ${c}`);
    }
  }
});

const bank = buildAll();

test('every generated question is valid, unique, and well-formed', () => {
  assert.ok(bank.length > 1000);
  assert.deepEqual(validateBank(bank), []);
  for (const q of bank) {
    assert.equal(q.options.length, 4, q.id);
    assert.equal(q.source, 'generated');
    assert.ok(q.prompt.includes('----') || q.prompt.startsWith('Which number'), `no blank: ${q.prompt}`);
    assert.ok(!/\b(marco|giulia|anna|luca)\b/.test(q.prompt), `lowercase name: ${q.prompt}`);
    assert.ok(!/\s{2,}/.test(q.prompt) && !/\s[.,?]/.test(q.prompt), `spacing: ${q.prompt}`);
    assert.ok(/^[A-ZÀ-Ý0-9]/.test(q.prompt), `sentence should start capitalised: ${q.prompt}`);
  }
});

test('generation is deterministic and the checked-in files are up to date', () => {
  const again = buildAll();
  assert.deepEqual(again, bank);
  for (const level of [1, 2]) {
    const file = JSON.parse(readFileSync(join(root, 'content', 'questions', `gen-level-${level}.json`), 'utf8'));
    assert.deepEqual(file, bank.filter((q) => q.level === level), `gen-level-${level}.json is stale: run node tools/build-generated.js`);
  }
});

test('every lesson-1/2 topic with a generator has a healthy number of questions', () => {
  const by = {};
  for (const q of bank) by[q.topic] = (by[q.topic] || 0) + 1;
  for (const t of ['1.1', '1.2', '1.3', '1.4', '1.5', '1.8', '1.10', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.9', '2.11']) {
    assert.ok((by[`lesson.${t}`] || 0) >= 40, `lesson.${t} has only ${by[`lesson.${t}`] || 0}`);
  }
});
