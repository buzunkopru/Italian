// Academic verbs (4.7 argumentation, 4.8 investigation, 4.9 causation): subject-verb agreement drills.
// Each verb: [infinitive, 3sg, 3pl, 1sg, 2pl, complement]. Distractors are the other person forms.
import { makeQuestion, shuffleCopy } from './util.js';

const ARG_VERBS = [
  ['sostenere', 'sostiene', 'sostengono', 'sostengo', 'sostenete', 'che il metodo è efficace'],
  ['affermare', 'afferma', 'affermano', 'affermo', 'affermate', 'che il rischio è alto'],
  ['ritenere', 'ritiene', 'ritengono', 'ritengo', 'ritenete', 'che la teoria sia corretta'],
  ['dichiarare', 'dichiara', 'dichiarano', 'dichiaro', 'dichiarate', 'che i dati sono corretti'],
  ['sottolineare', 'sottolinea', 'sottolineano', 'sottolineo', 'sottolineate', 'l\'importanza della ricerca'],
  ['ammettere', 'ammette', 'ammettono', 'ammetto', 'ammettete', 'alcuni limiti del metodo'],
  ['negare', 'nega', 'negano', 'nego', 'negate', 'ogni responsabilità'],
  ['ipotizzare', 'ipotizza', 'ipotizzano', 'ipotizzo', 'ipotizzate', 'che il fenomeno sia temporaneo'],
  ['suggerire', 'suggerisce', 'suggeriscono', 'suggerisco', 'suggerite', 'una nuova interpretazione'],
  ['ribadire', 'ribadisce', 'ribadiscono', 'ribadisco', 'ribadite', 'la validità del metodo'],
  ['osservare', 'osserva', 'osservano', 'osservo', 'osservate', 'che la situazione è migliorata'],
  ['proporre', 'propone', 'propongono', 'propongo', 'proponete', 'una nuova soluzione'],
];
const ARG_SG = ['L\'autore', 'Il ricercatore', 'La studiosa', 'Il critico', 'Lo studioso'];
const ARG_PL = ['Gli autori', 'I ricercatori', 'Le studiose', 'I critici', 'Gli studiosi'];

const INV_VERBS = [
  ['indagare', 'indaga', 'indagano', 'indago', 'indagate', 'le cause del fenomeno'],
  ['evidenziare', 'evidenzia', 'evidenziano', 'evidenzio', 'evidenziate', 'una forte crescita'],
  ['rilevare', 'rileva', 'rilevano', 'rilevo', 'rilevate', 'un errore nei dati'],
  ['dimostrare', 'dimostra', 'dimostrano', 'dimostro', 'dimostrate', 'la validità della teoria'],
  ['verificare', 'verifica', 'verificano', 'verifico', 'verificate', 'l\'ipotesi iniziale'],
  ['analizzare', 'analizza', 'analizzano', 'analizzo', 'analizzate', 'il campione con cura'],
  ['mostrare', 'mostra', 'mostrano', 'mostro', 'mostrate', 'un chiaro andamento'],
  ['rivelare', 'rivela', 'rivelano', 'rivelo', 'rivelate', 'una differenza importante'],
  ['confermare', 'conferma', 'confermano', 'confermo', 'confermate', 'l\'ipotesi iniziale'],
  ['individuare', 'individua', 'individuano', 'individuo', 'individuate', 'tre problemi principali'],
  ['misurare', 'misura', 'misurano', 'misuro', 'misurate', 'la temperatura ogni ora'],
  ['identificare', 'identifica', 'identificano', 'identifico', 'identificate', 'le cause principali'],
];
const INV_SG = ['La ricerca', 'Lo studio', 'Il test', 'L\'esperimento', 'Il rapporto'];
const INV_PL = ['Le ricerche', 'Gli studi', 'I test', 'Gli esperimenti', 'I rapporti'];

// causation: split by tone so the sentences make sense
const NEG_VERBS = [
  ['comportare', 'comporta', 'comportano', 'comporto', 'comportate', 'gravi rischi'],
  ['provocare', 'provoca', 'provocano', 'provoco', 'provocate', 'gravi danni'],
  ['causare', 'causa', 'causano', 'causo', 'causate', 'molti problemi'],
  ['ostacolare', 'ostacola', 'ostacolano', 'ostacolo', 'ostacolate', 'lo sviluppo del progetto'],
  ['rallentare', 'rallenta', 'rallentano', 'rallento', 'rallentate', 'la crescita'],
];
const POS_VERBS = [
  ['favorire', 'favorisce', 'favoriscono', 'favorisco', 'favorite', 'la crescita economica'],
  ['facilitare', 'facilita', 'facilitano', 'facilito', 'facilitate', 'il lavoro di molti'],
  ['promuovere', 'promuove', 'promuovono', 'promuovo', 'promuovete', 'il benessere'],
  ['generare', 'genera', 'generano', 'genero', 'generate', 'nuove opportunità'],
  ['produrre', 'produce', 'producono', 'produco', 'producete', 'effetti positivi'],
];
const NEUTRAL_VERBS = [
  ['determinare', 'determina', 'determinano', 'determino', 'determinate', 'un cambiamento importante'],
  ['influenzare', 'influenza', 'influenzano', 'influenzo', 'influenzate', 'le scelte dei consumatori'],
];
const NEG_SG = ['L\'inquinamento', 'La crisi', 'Questo fenomeno', 'Il traffico'];
const NEG_PL = ['I tagli', 'Le guerre', 'Questi errori', 'Le crisi'];
const POS_SG = ['La riforma', 'L\'istruzione', 'Questa politica', 'Il progresso'];
const POS_PL = ['Le riforme', 'Le nuove tecnologie', 'Queste politiche', 'Gli investimenti'];

function make(rng, topic, verbs, sg, pl) {
  const out = [];
  for (const [inf, s3, p3, s1, p2, comp] of verbs) {
    for (const [subjects, plural] of [[sg, false], [pl, true]]) {
      for (const subject of subjects) {
        const answer = plural ? p3 : s3;
        out.push(makeQuestion({
          gen: `v4-${inf}`, topic, rng,
          prompt: `${subject} ---- ${comp}.`,
          answer,
          distractors: shuffleCopy([plural ? s3 : p3, s1, p2], rng),
          explain: `${subject} is ${plural ? 'plural' : 'singular'} → ${answer}. ${inf}: ${s1} · ${s3} · ${p2} · ${p3}.`,
        }));
      }
    }
  }
  return out;
}

export function generate(rng) {
  return [
    ...make(rng, 'lesson.4.7', ARG_VERBS, ARG_SG, ARG_PL),
    ...make(rng, 'lesson.4.8', INV_VERBS, INV_SG, INV_PL),
    ...make(rng, 'lesson.4.9', NEG_VERBS, NEG_SG, NEG_PL),
    ...make(rng, 'lesson.4.9', POS_VERBS, POS_SG, POS_PL),
    ...make(rng, 'lesson.4.9', NEUTRAL_VERBS, [...NEG_SG.slice(0, 2), ...POS_SG.slice(0, 2)], [...NEG_PL.slice(0, 2), ...POS_PL.slice(0, 2)]),
  ].filter(Boolean);
}
