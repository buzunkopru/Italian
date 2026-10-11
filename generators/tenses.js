// Passato prossimo with avere (2.2) and essere + agreement (2.3); future tense (2.11).
import {
  PERSONS, SUBJECTS, IRREGULAR_PRESENT, AVERE_PP, ESSERE_PP, ESSERE_SUBJECTS, PAST_TIMES,
  IRREGULAR_FUTURE, FUTURE_COMPS, REGULAR_FUTURE_VERBS, conjugateFuture, FUTURE_TIMES,
} from './data/verbs.js';
import { makeQuestion, shuffleCopy, pick, mid } from './util.js';

const AUX = { avere: IRREGULAR_PRESENT.avere, essere: IRREGULAR_PRESENT.essere };
const who = (s) => s.label || `${s.text} = ${PERSONS[s.person]}`;

/** Agree a participle in -o with gender g and number n. */
export function agree(pp, g, n) {
  const stem = pp.slice(0, -1);
  if (n === 's') return stem + (g === 'm' ? 'o' : 'a');
  return stem + (g === 'm' ? 'i' : 'e');
}

function avereQuestions(rng) {
  const out = [];
  // only subjects whose person is unambiguous and any gender is fine for avere verbs
  const subjects = SUBJECTS.filter((s) => ['Io', 'Tu', 'Marco', 'Giulia', 'Il professore', 'Noi', 'Voi', 'I ragazzi', 'Le studentesse'].includes(s.text));
  for (const v of AVERE_PP) {
    for (const s of subjects) {
      for (const comp of v.comps) {
        const answer = `${AUX.avere[s.person]} ${v.pp}`;
        const others = AUX.avere.map((a) => `${a} ${v.pp}`).filter((x) => x !== answer);
        const wrongAux = `${AUX.essere[s.person]} ${v.pp}`; // the classic mistake: essere instead of avere
        const q = makeQuestion({
          gen: `pp-av-${v.inf}`, topic: 'lesson.2.2', rng,
          prompt: `${pick(PAST_TIMES, rng)} ${mid(s.text)} ---- ${comp}.`,
          answer,
          distractors: [wrongAux, ...shuffleCopy(others, rng)],
          explain: `${who(s)} → ${answer}. ${v.inf} takes AVERE: ${AUX.avere.map((a) => `${a} ${v.pp}`).join(', ')}.`,
        });
        if (q) out.push(q);
      }
    }
  }
  return out;
}

function essereQuestions(rng) {
  const out = [];
  for (const v of ESSERE_PP) {
    for (const s of ESSERE_SUBJECTS) {
      for (const comp of v.comps) {
        const aux = AUX.essere[s.person];
        const right = agree(v.pp, s.g, s.n);
        const answer = `${aux} ${right}`;
        // same auxiliary, wrong agreement (3 other gender/number combos)
        const wrongAgree = [['m', 's'], ['f', 's'], ['m', 'p'], ['f', 'p']]
          .filter(([g, n]) => agree(v.pp, g, n) !== right)
          .map(([g, n]) => `${aux} ${agree(v.pp, g, n)}`);
        const wrongAux = `${AUX.avere[s.person]} ${v.pp}`;
        const q = makeQuestion({
          gen: `pp-es-${v.inf}`, topic: 'lesson.2.3', rng,
          prompt: `${pick(PAST_TIMES, rng)} ${mid(s.text)} ---- ${comp}.`,
          answer,
          distractors: [wrongAux, ...shuffleCopy(wrongAgree, rng)],
          explain: `${s.text}: ${s.g === 'm' ? 'masculine' : 'feminine'} ${s.n === 's' ? 'singular' : 'plural'} → ${answer}. ${v.inf} takes ESSERE, so the participle agrees with the subject (-o/-a/-i/-e).`,
        });
        if (q) out.push(q);
      }
    }
  }
  return out;
}

function futureQuestions(rng) {
  const out = [];
  const add = (verb, forms, comps) => {
    for (const s of SUBJECTS) {
      for (const comp of comps) {
        const answer = forms[s.person];
        const others = forms.filter((f) => f !== answer);
        const q = makeQuestion({
          gen: `fut-${verb}`, topic: 'lesson.2.11', rng,
          prompt: `${pick(FUTURE_TIMES, rng)} ${mid(s.text)} ---- ${comp}.`,
          answer,
          // other persons only: the present tense is also correct after 'domani', so it is never offered
          distractors: shuffleCopy(others, rng),
          explain: `${who(s)} → ${answer}. Future of ${verb}: ${forms.join(', ')}.`,
        });
        if (q) out.push(q);
      }
    }
  };
  for (const [verb, forms] of Object.entries(IRREGULAR_FUTURE)) add(verb, forms, FUTURE_COMPS[verb]);
  for (const v of REGULAR_FUTURE_VERBS) add(v.inf, conjugateFuture(v), v.comps);
  return out;
}

export function generate(rng) {
  return [...avereQuestions(rng), ...essereQuestions(rng), ...futureQuestions(rng)];
}
