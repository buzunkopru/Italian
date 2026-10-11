import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  conjugateImperfect, IMPERFECT_IRREGULAR, conjugateRemote, REMOTE_REGULAR, REMOTE_IRREGULAR,
  conditionalFromFuture, IRREGULAR_FUTURE, conjugateSubjunctive, SUBJ_IRREGULAR, REGULAR_VERBS, conjugateFuture, REGULAR_FUTURE_VERBS,
} from '../generators/data/moods.js';
import { HAND_SETS } from '../generators/hand.js';
import { validateQuestion } from '../engine/schema.js';

const reg = (inf) => REGULAR_VERBS.find((v) => v.inf === inf);
const remote = (inf) => REMOTE_REGULAR.find((v) => v.inf === inf);

test('imperfetto golden forms', () => {
  assert.deepEqual(conjugateImperfect('parlare'), 'parlavo parlavi parlava parlavamo parlavate parlavano'.split(' '));
  assert.deepEqual(conjugateImperfect('leggere'), 'leggevo leggevi leggeva leggevamo leggevate leggevano'.split(' '));
  assert.deepEqual(conjugateImperfect('dormire'), 'dormivo dormivi dormiva dormivamo dormivate dormivano'.split(' '));
  assert.deepEqual(conjugateImperfect('avere'), 'avevo avevi aveva avevamo avevate avevano'.split(' '));
  assert.deepEqual(conjugateImperfect('uscire'), 'uscivo uscivi usciva uscivamo uscivate uscivano'.split(' '));
  assert.equal(IMPERFECT_IRREGULAR.essere.forms.join(' '), 'ero eri era eravamo eravate erano');
  assert.equal(IMPERFECT_IRREGULAR.fare.forms[2], 'faceva');
  assert.equal(IMPERFECT_IRREGULAR.dire.forms[5], 'dicevano');
});

test('passato remoto golden forms', () => {
  assert.deepEqual(conjugateRemote(remote('costruire')), 'costruii costruisti costruì costruimmo costruiste costruirono'.split(' '));
  assert.deepEqual(conjugateRemote(remote('conquistare')), 'conquistai conquistasti conquistò conquistammo conquistaste conquistarono'.split(' '));
  assert.deepEqual(conjugateRemote(remote('capire')), 'capii capisti capì capimmo capiste capirono'.split(' '));
  assert.equal(REMOTE_IRREGULAR.essere.forms.join(' '), 'fui fosti fu fummo foste furono');
  assert.equal(REMOTE_IRREGULAR.avere.forms[2], 'ebbe');
  assert.equal(REMOTE_IRREGULAR.fare.forms[5], 'fecero');
  assert.equal(REMOTE_IRREGULAR.scrivere.forms[2], 'scrisse');
  assert.equal(REMOTE_IRREGULAR.vedere.forms[5], 'videro');
  assert.equal(REMOTE_IRREGULAR.venire.forms[5], 'vennero');
  assert.equal(REMOTE_IRREGULAR.vivere.forms[2], 'visse');
  assert.equal(REMOTE_IRREGULAR.leggere.forms[2], 'lesse');
});

test('conditional golden forms', () => {
  assert.deepEqual(conditionalFromFuture('sarò'), 'sarei saresti sarebbe saremmo sareste sarebbero'.split(' '));
  assert.deepEqual(conditionalFromFuture(IRREGULAR_FUTURE.avere[0]), 'avrei avresti avrebbe avremmo avreste avrebbero'.split(' '));
  assert.deepEqual(conditionalFromFuture(IRREGULAR_FUTURE.venire[0]), 'verrei verresti verrebbe verremmo verreste verrebbero'.split(' '));
  assert.deepEqual(conditionalFromFuture(IRREGULAR_FUTURE.potere[0]), 'potrei potresti potrebbe potremmo potreste potrebbero'.split(' '));
  const parlare = REGULAR_FUTURE_VERBS.find((v) => v.inf === 'parlare');
  assert.deepEqual(conditionalFromFuture(conjugateFuture(parlare)[0]), 'parlerei parleresti parlerebbe parleremmo parlereste parlerebbero'.split(' '));
  const cercare = REGULAR_FUTURE_VERBS.find((v) => v.inf === 'cercare');
  assert.equal(conditionalFromFuture(conjugateFuture(cercare)[0])[2], 'cercherebbe');
  const mangiare = REGULAR_FUTURE_VERBS.find((v) => v.inf === 'mangiare');
  assert.equal(conditionalFromFuture(conjugateFuture(mangiare)[0])[5], 'mangerebbero');
});

test('present subjunctive golden forms', () => {
  assert.deepEqual(conjugateSubjunctive(reg('parlare')), 'parli parli parli parliamo parliate parlino'.split(' '));
  assert.deepEqual(conjugateSubjunctive(reg('leggere')), 'legga legga legga leggiamo leggiate leggano'.split(' '));
  assert.deepEqual(conjugateSubjunctive(reg('dormire')), 'dorma dorma dorma dormiamo dormiate dormano'.split(' '));
  assert.deepEqual(conjugateSubjunctive(reg('finire')), 'finisca finisca finisca finiamo finiate finiscano'.split(' '));
  assert.deepEqual(conjugateSubjunctive(reg('mangiare')), 'mangi mangi mangi mangiamo mangiate mangino'.split(' '));
  assert.deepEqual(conjugateSubjunctive(reg('cercare')), 'cerchi cerchi cerchi cerchiamo cerchiate cerchino'.split(' '));
  assert.equal(SUBJ_IRREGULAR.essere.join(' '), 'sia sia sia siamo siate siano');
  assert.equal(SUBJ_IRREGULAR.avere.join(' '), 'abbia abbia abbia abbiamo abbiate abbiano');
  assert.equal(SUBJ_IRREGULAR.andare.join(' '), 'vada vada vada andiamo andiate vadano');
  assert.equal(SUBJ_IRREGULAR.potere[5], 'possano');
  assert.equal(SUBJ_IRREGULAR.dovere[5], 'debbano');
  assert.equal(SUBJ_IRREGULAR.fare[4], 'facciate');
});

test('hand-written items: valid, exactly one correct option, no duplicate prompts', () => {
  const seen = new Set();
  HAND_SETS.forEach(([topic, prompt, answer, wrong, explain], i) => {
    const q = { id: `x${i}`, section: 'drill', topic, level: Number(topic[7]), prompt, options: [answer, ...wrong], answer: 0, explain, source: 'hand', verified: true };
    assert.deepEqual(validateQuestion(q), [], `${i}: ${prompt}`);
    assert.ok(prompt.includes('----'), `no blank: ${prompt}`);
    assert.equal(wrong.length, 3, prompt);
    assert.ok(!wrong.includes(answer), `answer repeated: ${prompt}`);
    const key = `${prompt}|${answer}`;
    assert.ok(!seen.has(key), `duplicate: ${prompt}`);
    seen.add(key);
  });
  assert.ok(HAND_SETS.length > 350);
});
