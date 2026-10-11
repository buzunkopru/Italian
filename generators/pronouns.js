// Direct object pronouns (2.4), indirect object pronouns (2.5), reflexive pronouns (2.6).
import { REFLEXIVES, REFLEXIVE_PRONOUNS, SUBJECTS, PERSONS } from './data/verbs.js';
import { makeQuestion, shuffleCopy } from './util.js';

// ---- 2.4 direct: "Leggi il libro? Sì, lo leggo." Only consonant-initial verbs (before a vowel lo/la become l'). ----
// each object: [text, gender, number]
const DIRECT_VERBS = [
  { q: 'Leggi', a: 'leggo', objs: [['il libro', 'm', 's'], ['i libri', 'm', 'p'], ['la rivista', 'f', 's'], ['le riviste', 'f', 'p'], ['il giornale', 'm', 's'], ['i giornali', 'm', 'p'], ['la lettera', 'f', 's'], ['le lettere', 'f', 'p']] },
  { q: 'Compri', a: 'compro', objs: [['il pane', 'm', 's'], ['i biglietti', 'm', 'p'], ['le scarpe', 'f', 'p'], ['il giornale', 'm', 's'], ['la borsa', 'f', 's'], ['le mele', 'f', 'p']] },
  { q: 'Prendi', a: 'prendo', objs: [['il treno', 'm', 's'], ['i biglietti', 'm', 'p'], ['le chiavi', 'f', 'p'], ["l'autobus", 'm', 's'], ['la metro', 'f', 's']] },
  { q: 'Chiudi', a: 'chiudo', objs: [['la porta', 'f', 's'], ['le finestre', 'f', 'p'], ['la valigia', 'f', 's'], ['il cassetto', 'm', 's'], ['i cassetti', 'm', 'p']] },
  { q: 'Scrivi', a: 'scrivo', objs: [['la lettera', 'f', 's'], ['le lettere', 'f', 'p'], ['il messaggio', 'm', 's'], ['i messaggi', 'm', 'p'], ['la mail', 'f', 's'], ['le mail', 'f', 'p']] },
  { q: 'Vedi', a: 'vedo', objs: [['il film', 'm', 's'], ['i film', 'm', 'p'], ['la partita', 'f', 's'], ['le partite', 'f', 'p'], ['il professore', 'm', 's'], ['la dottoressa', 'f', 's']] },
  { q: 'Mangi', a: 'mangio', objs: [['la mela', 'f', 's'], ['le mele', 'f', 'p'], ['il pane', 'm', 's'], ['i panini', 'm', 'p'], ['la pasta', 'f', 's'], ['gli spaghetti', 'm', 'p']] },
  { q: 'Conosci', a: 'conosco', objs: [['Marco', 'm', 's'], ['Giulia', 'f', 's'], ['i suoi amici', 'm', 'p'], ['le sue amiche', 'f', 'p'], ['il professore', 'm', 's'], ['la signora', 'f', 's']] },
];
const DIRECT = { ms: 'lo', fs: 'la', mp: 'li', fp: 'le' };

function directQuestions(rng) {
  const out = [];
  for (const v of DIRECT_VERBS) {
    for (const [noun, g, n] of v.objs) {
      const answer = DIRECT[g + n];
      const q = makeQuestion({
        gen: 'dir', topic: 'lesson.2.4', rng,
        prompt: `${v.q} ${noun}? Sì, ---- ${v.a}.`,
        answer,
        distractors: Object.values(DIRECT).filter((x) => x !== answer),
        explain: `${noun} = ${g === 'm' ? 'masculine' : 'feminine'} ${n === 's' ? 'singular' : 'plural'} → ${answer}. Direct pronouns: lo (m.sg) · la (f.sg) · li (m.pl) · le (f.pl).`,
      });
      if (q) out.push(q);
    }
  }
  return out;
}

// ---- 2.5 indirect: "Marco è mio fratello. Gli telefono spesso." ----
const INDIRECT_WHO = [
  { ctx: 'Marco è mio fratello.', a: 'gli', note: 'Marco = a lui' },
  { ctx: 'Luca è un mio collega.', a: 'gli', note: 'Luca = a lui' },
  { ctx: 'Il professore è molto gentile.', a: 'gli', note: 'il professore = a lui' },
  { ctx: 'Giulia è mia sorella.', a: 'le', note: 'Giulia = a lei' },
  { ctx: 'La professoressa è molto gentile.', a: 'le', note: 'la professoressa = a lei' },
  { ctx: 'Anna è una mia amica.', a: 'le', note: 'Anna = a lei' },
  { ctx: 'I miei amici abitano a Londra.', a: 'gli', note: 'i miei amici = a loro (gli)' },
  { ctx: 'I ragazzi sono in classe.', a: 'gli', note: 'i ragazzi = a loro (gli)' },
];
const INDIRECT_VERBS = [
  { v: 'telefono spesso', inf: 'telefonare a' },
  { v: 'scrivo ogni settimana', inf: 'scrivere a' },
  { v: 'rispondo sempre', inf: 'rispondere a' },
  { v: 'mando un messaggio', inf: 'mandare a' },
  { v: 'regalo un libro', inf: 'regalare a' },
  { v: 'spiego la lezione', inf: 'spiegare a' },
  { v: 'dico la verità', inf: 'dire a' },
  { v: 'parlo ogni giorno', inf: 'parlare a' },
];

function indirectQuestions(rng) {
  const out = [];
  for (const w of INDIRECT_WHO) {
    for (const v of INDIRECT_VERBS) {
      const q = makeQuestion({
        gen: 'ind', topic: 'lesson.2.5', rng,
        prompt: `${w.ctx} ---- ${v.v}.`,
        answer: w.a,
        distractors: ['lo', 'la', 'li', w.a === 'gli' ? 'le' : 'gli'],
        explain: `${v.inf} + person → INDIRECT pronoun. ${w.note}: ${w.a}. (lo/la/li are for direct objects.)`,
      });
      if (q) out.push(q);
    }
  }
  return out;
}

// ---- 2.6 reflexive ----
function reflexiveQuestions(rng) {
  const out = [];
  for (const r of REFLEXIVES) {
    for (const s of SUBJECTS) {
      const answer = REFLEXIVE_PRONOUNS[s.person];
      const q = makeQuestion({
        gen: `refl-${r.inf}`, topic: 'lesson.2.6', rng,
        prompt: `${s.text} ---- ${r.forms[s.person]} ${r.comp}.`,
        answer,
        distractors: shuffleCopy(['mi', 'ti', 'si', 'ci', 'vi'].filter((p) => p !== answer), rng),
        explain: `${s.label || `${s.text} = ${PERSONS[s.person]}`} → ${answer} ${r.forms[s.person]}. ${r.inf}: mi, ti, si, ci, vi, si + the verb.`,
      });
      if (q) out.push(q);
    }
  }
  return out;
}

export function generate(rng) {
  return [...directQuestions(rng), ...indirectQuestions(rng), ...reflexiveQuestions(rng)];
}
