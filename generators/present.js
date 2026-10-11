// Present tense: essere/avere (1.1), regular verbs (1.3), fare/andare (1.4), venire/dare/stare (1.5), modals (2.1).
import {
  PERSONS, SUBJECTS, IRREGULAR_PRESENT, IRREGULAR_COMPS, REGULAR_VERBS, conjugatePresent, MODALS, MODAL_INFINITIVES,
} from './data/verbs.js';
import { makeQuestion, shuffleCopy } from './util.js';

const paradigm = (forms) => forms.join(', ');
const who = (s) => s.label || `${s.text} = ${PERSONS[s.person]}`;

/** Extra, deliberately tempting wrong answers (accent / silent-h traps). */
function traps(verb, person) {
  if (verb === 'essere' && person === 2) return ['e'];
  if (verb === 'avere' && person === 2) return ['a'];
  if (verb === 'avere' && person === 5) return ['anno'];
  return [];
}

function ask({ topic, gen, verb, forms, comps, infinitive, rng, extra = [] }) {
  const out = [];
  for (const s of SUBJECTS) {
    for (const comp of comps) {
      const answer = forms[s.person];
      const others = forms.filter((f) => f !== answer);
      const pool = [...traps(verb, s.person), ...shuffleCopy([...others, ...extra], rng)];
      const q = makeQuestion({
        gen, topic, rng,
        prompt: `${s.text} ---- ${comp}.`,
        answer,
        distractors: pool,
        explain: `${who(s)} → ${answer}. ${verb}: ${paradigm(forms)}.`,
      });
      if (q) out.push(q);
    }
  }
  return out;
}

export function generate(rng) {
  const out = [];

  const GROUPS = [
    { topic: 'lesson.1.1', verbs: ['essere', 'avere'] },
    { topic: 'lesson.1.4', verbs: ['fare', 'andare'] },
    { topic: 'lesson.1.5', verbs: ['venire', 'dare', 'stare'] },
  ];
  for (const g of GROUPS) {
    for (const verb of g.verbs) {
      out.push(...ask({ topic: g.topic, gen: `pres-${verb}`, verb, forms: IRREGULAR_PRESENT[verb], comps: IRREGULAR_COMPS[verb], rng }));
    }
  }

  for (const v of REGULAR_VERBS) {
    const forms = conjugatePresent(v);
    out.push(...ask({ topic: 'lesson.1.3', gen: `pres-${v.inf}`, verb: v.inf, forms, comps: v.comps, rng, extra: [v.inf] }));
  }

  // modals: the verb is always one modal; only the PERSON form changes, so exactly one option fits
  for (const m of MODALS) {
    const forms = IRREGULAR_PRESENT[m];
    for (const s of SUBJECTS) {
      for (const inf of MODAL_INFINITIVES) {
        const answer = forms[s.person];
        const q = makeQuestion({
          gen: `modal-${m}`, topic: 'lesson.2.1', rng,
          prompt: `${s.text} ---- ${inf}.`,
          answer,
          distractors: shuffleCopy(forms.filter((f) => f !== answer), rng),
          explain: `${who(s)} → ${answer}. ${m}: ${paradigm(forms)}. A modal is followed by the infinitive.`,
        });
        if (q) out.push(q);
      }
    }
  }
  return out;
}
