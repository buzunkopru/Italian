// Level 3 grammar: imperfetto (3.1), passato remoto (3.3), passive (3.5), passive "si" (3.6),
// gerund (3.7), conditional (3.8), present subjunctive (3.9), hypothetical periods (3.10).
import { SUBJECTS, PERSONS, IRREGULAR_COMPS, FUTURE_COMPS } from './data/verbs.js';
import {
  IMPERFECT_IRREGULAR, IMPERFECT_REGULAR, IMPERFECT_TIMES, conjugateImperfect,
  REMOTE_REGULAR, REMOTE_IRREGULAR, conjugateRemote, HISTORY_SUBJECTS, HISTORY_TIMES,
  conditionalFromFuture, SUBJ_IRREGULAR, conjugateSubjunctive, SUBJ_TRIGGERS, SUBJ_CONNECTORS,
  IRREGULAR_PRESENT, REGULAR_VERBS, conjugatePresent, IRREGULAR_FUTURE, REGULAR_FUTURE_VERBS, conjugateFuture,
} from './data/moods.js';
import { definiteArticle, contract, join } from './articles.js';
import { agree } from './tenses.js';
import { makeQuestion, shuffleCopy, pick, mid, cap } from './util.js';

const imperfect3 = (inf) => (IMPERFECT_IRREGULAR[inf] ? IMPERFECT_IRREGULAR[inf].forms[2] : conjugateImperfect(inf)[2]);

const who = (s) => s.label || `${s.text} = ${PERSONS[s.person]}`;

// ---------- 3.1 imperfetto ----------
function imperfectQuestions(rng) {
  const out = [];
  const add = (inf, forms, comps) => {
    for (const s of SUBJECTS) {
      for (const comp of comps) {
        const answer = forms[s.person];
        const q = makeQuestion({
          gen: `impf-${inf}`, topic: 'lesson.3.1', rng,
          prompt: `${pick(IMPERFECT_TIMES, rng)} ${mid(s.text)} ---- ${comp}.`,
          answer,
          distractors: shuffleCopy(forms.filter((f) => f !== answer), rng),
          explain: `${who(s)} → ${answer}. Imperfetto of ${inf}: ${forms.join(', ')}. Habit or background: look for the "v" (-avo, -evo, -ivo).`,
        });
        if (q) out.push(q);
      }
    }
  };
  for (const [inf, v] of Object.entries(IMPERFECT_IRREGULAR)) add(inf, v.forms, v.comps);
  for (const v of IMPERFECT_REGULAR) add(v.inf, conjugateImperfect(v.inf), v.comps);
  return out;
}

// ---------- 3.3 passato remoto (3rd person subjects; all six forms as options) ----------
function remoteQuestions(rng) {
  const out = [];
  const add = (inf, forms, obj) => {
    for (const s of HISTORY_SUBJECTS) {
      const answer = forms[s.person];
      const q = makeQuestion({
        gen: `rem-${inf}`, topic: 'lesson.3.3', rng,
        prompt: `${pick(HISTORY_TIMES, rng)} ${mid(s.text)} ---- ${obj}.`,
        answer,
        distractors: shuffleCopy(forms.filter((f) => f !== answer), rng),
        explain: `${s.text}: ${s.person === 2 ? '3rd person singular' : '3rd person plural'} → ${answer}. Passato remoto of ${inf}: ${forms.join(', ')}.`,
      });
      if (q) out.push(q);
    }
  };
  for (const v of REMOTE_REGULAR) add(v.inf, conjugateRemote(v), v.obj);
  for (const [inf, v] of Object.entries(REMOTE_IRREGULAR)) add(inf, v.forms, v.obj);
  return out;
}

// ---------- 3.5 passive voice ----------
const SCIENCE_AGENTS = [['ricercatori', 'ricercatore', 'm', 'p'], ['scienziate', 'scienziata', 'f', 'p'], ['esperti', 'esperto', 'm', 'p'], ['studiosi', 'studioso', 'm', 'p']];
const LAW_AGENTS = [['commissione', 'commissione', 'f', 's'], ['parlamento', 'parlamento', 'm', 's'], ['governo', 'governo', 'm', 's'], ['ministro', 'ministro', 'm', 's'], ['deputati', 'deputato', 'm', 'p']];
const TEXT_AGENTS = [['autori', 'autore', 'm', 'p'], ['autrici', 'autrice', 'f', 'p'], ['professoressa', 'professoressa', 'f', 's'], ['giornalisti', 'giornalista', 'm', 'p']];
const PP = {
  analizzare: 'analizzato', pubblicare: 'pubblicato', approvare: 'approvato', confermare: 'confermato', discutere: 'discusso', scrivere: 'scritto',
  proporre: 'proposto', dimostrare: 'dimostrato', accettare: 'accettato', rifiutare: 'rifiutato', criticare: 'criticato', completare: 'completato',
  presentare: 'presentato', ripetere: 'ripetuto', usare: 'usato', trovare: 'trovato',
};
const PASSIVE_NOUNS = [
  { sg: 'risultato', pl: 'risultati', g: 'm', agents: SCIENCE_AGENTS, verbs: ['analizzare', 'pubblicare', 'confermare', 'presentare', 'discutere'] },
  { sg: 'teoria', pl: 'teorie', g: 'f', agents: SCIENCE_AGENTS, verbs: ['dimostrare', 'discutere', 'criticare', 'proporre', 'rifiutare', 'confermare'] },
  { sg: 'studio', pl: 'studi', g: 'm', agents: SCIENCE_AGENTS, verbs: ['pubblicare', 'completare', 'presentare', 'criticare'] },
  { sg: 'metodo', pl: 'metodi', g: 'm', agents: SCIENCE_AGENTS, verbs: ['usare', 'proporre', 'criticare', 'accettare', 'rifiutare', 'presentare'] },
  { sg: 'esperimento', pl: 'esperimenti', g: 'm', agents: SCIENCE_AGENTS, verbs: ['ripetere', 'completare', 'presentare', 'criticare'] },
  { sg: 'ricerca', pl: 'ricerche', g: 'f', agents: SCIENCE_AGENTS, verbs: ['pubblicare', 'completare', 'presentare', 'criticare'] },
  { sg: 'dato', pl: 'dati', g: 'm', agents: SCIENCE_AGENTS, verbs: ['analizzare', 'confermare', 'usare', 'pubblicare', 'trovare'] },
  { sg: 'scoperta', pl: 'scoperte', g: 'f', agents: SCIENCE_AGENTS, verbs: ['confermare', 'pubblicare', 'discutere', 'presentare', 'criticare'] },
  { sg: 'legge', pl: 'leggi', g: 'f', agents: LAW_AGENTS, verbs: ['approvare', 'rifiutare', 'discutere', 'presentare', 'scrivere'] },
  { sg: 'proposta', pl: 'proposte', g: 'f', agents: LAW_AGENTS, verbs: ['approvare', 'accettare', 'rifiutare', 'discutere', 'presentare'] },
  { sg: 'progetto', pl: 'progetti', g: 'm', agents: LAW_AGENTS, verbs: ['approvare', 'completare', 'presentare', 'rifiutare', 'discutere'] },
  { sg: 'articolo', pl: 'articoli', g: 'm', agents: TEXT_AGENTS, verbs: ['pubblicare', 'scrivere', 'criticare', 'accettare', 'rifiutare', 'discutere'] },
  { sg: 'testo', pl: 'testi', g: 'm', agents: TEXT_AGENTS, verbs: ['scrivere', 'pubblicare', 'criticare', 'ripetere'] },
];
const AUX_FORMS = ['è stato', 'è stata', 'sono stati', 'sono state'];

function passiveQuestions(rng) {
  const out = [];
  for (const n of PASSIVE_NOUNS) {
    for (const num of ['s', 'p']) {
      const noun = num === 's' ? n.sg : n.pl;
      const subject = cap(join(definiteArticle(n.sg, n.g, num), noun));
      const auxIdx = (num === 's' ? 0 : 2) + (n.g === 'm' ? 0 : 1);
      const aux = AUX_FORMS[auxIdx];
      for (const inf of n.verbs) {
        const pp = PP[inf];
        const [agent, agentSg, ag, an] = pick(n.agents, rng);
        const art = definiteArticle(agentSg, ag, an);
        const by = `${contract('da', art)} ${agent}`.replace("' ", "'");
        const ppForms = [agree(pp, 'm', 's'), agree(pp, 'f', 's'), agree(pp, 'm', 'p'), agree(pp, 'f', 'p')];
        const right = agree(pp, n.g, num);
        const info = `${noun} = ${n.g === 'm' ? 'masculine' : 'feminine'} ${num === 's' ? 'singular' : 'plural'}`;
        // A: participle agrees with the subject
        out.push(makeQuestion({
          gen: 'pas-pp', topic: 'lesson.3.5', rng, prompt: `${subject} ${aux} ---- ${by}.`, answer: right,
          distractors: shuffleCopy(ppForms.filter((f) => f !== right), rng),
          explain: `${info} → ${right}. Passive = essere + past participle (agreeing with the subject) + da + agent.`,
        }));
        // B: auxiliary agrees too
        out.push(makeQuestion({
          gen: 'pas-aux', topic: 'lesson.3.5', rng, prompt: `${subject} ---- ${right} ${by}.`, answer: aux,
          distractors: shuffleCopy(AUX_FORMS.filter((f) => f !== aux), rng),
          explain: `${info} → ${aux} ${right}. In the passato prossimo passive BOTH "stato" and the participle agree with the subject.`,
        }));
        // C: agent introduced by da + article
        const dA = contract('da', art);
        out.push(makeQuestion({
          gen: 'pas-agent', topic: 'lesson.3.5', rng, prompt: `${subject} ${aux} ${right} ---- ${agent}.`, answer: dA,
          distractors: shuffleCopy(['dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle'].filter((f) => f !== dA), rng),
          explain: `The agent of a passive is introduced by da: da + ${art} ${agent} → ${dA} ${agent}.`,
        }));
      }
    }
  }
  return out.filter(Boolean);
}

// ---------- 3.6 passive si ----------
const SI_ITEMS = [
  { inf: 'parlare', pp: 'parlato', sg: ['parla', 'In Brasile si ---- portoghese.'], pl: ['parlano', 'In Svizzera si ---- quattro lingue.'] },
  { inf: 'vendere', pp: 'venduto', sg: ['vende', 'In questo negozio si ---- pane fresco.'], pl: ['vendono', 'In questo negozio si ---- libri usati.'] },
  { inf: 'usare', pp: 'usato', sg: ['usa', 'In laboratorio si ---- molta cautela.'], pl: ['usano', 'In laboratorio si ---- strumenti molto precisi.'] },
  { inf: 'trovare', pp: 'trovato', sg: ['trova', 'In questa zona si ---- un buon ristorante.'], pl: ['trovano', 'In questa zona si ---- molti musei.'] },
  { inf: 'leggere', pp: 'letto', sg: ['legge', 'Oggi si ---- poco la poesia.'], pl: ['leggono', 'Oggi si ---- pochi giornali.'] },
  { inf: 'vedere', pp: 'visto', sg: ['vede', 'Da qui si ---- il mare.'], pl: ['vedono', 'Da qui si ---- le montagne.'] },
  { inf: 'produrre', pp: 'prodotto', sg: ['produce', "In questa regione si ---- olio d'oliva."], pl: ['producono', 'In questa regione si ---- molti vini.'] },
  { inf: 'mangiare', pp: 'mangiato', sg: ['mangia', 'In Italia si ---- molta pasta.'], pl: ['mangiano', 'In Italia si ---- molti dolci.'] },
  { inf: 'bere', pp: 'bevuto', sg: ['beve', 'Qui si ---- caffè forte.'], pl: ['bevono', 'Qui si ---- molti caffè.'] },
  { inf: 'costruire', pp: 'costruito', sg: ['costruisce', 'In questa zona si ---- una nuova scuola.'], pl: ['costruiscono', 'In questa zona si ---- nuove case.'] },
  { inf: 'osservare', pp: 'osservato', sg: ['osserva', 'Nel grafico si ---- un aumento.'], pl: ['osservano', 'Nel grafico si ---- due picchi.'] },
  { inf: 'notare', pp: 'notato', sg: ['nota', 'Nei dati si ---- una differenza.'], pl: ['notano', 'Nei dati si ---- differenze importanti.'] },
  { inf: 'discutere', pp: 'discusso', sg: ['discute', 'Nel convegno si ---- il problema.'], pl: ['discutono', 'Nel convegno si ---- vari problemi.'] },
  { inf: 'fare', pp: 'fatto', sg: ['fa', 'In questa città si ---- poco sport.'], pl: ['fanno', 'In estate si ---- molte passeggiate.'] },
  { inf: 'organizzare', pp: 'organizzato', sg: ['organizza', 'Ogni anno si ---- una grande festa.'], pl: ['organizzano', 'Ogni anno si ---- molte feste.'] },
];
function siQuestions(rng) {
  const out = [];
  for (const it of SI_ITEMS) {
    for (const [num, [form, prompt]] of [['s', it.sg], ['p', it.pl]]) {
      const other = num === 's' ? it.pl[0] : it.sg[0];
      out.push(makeQuestion({
        gen: 'si', topic: 'lesson.3.6', rng, prompt, answer: form,
        distractors: [other, it.inf, it.pp],
        explain: `Passive "si": the verb agrees with the noun that follows (${num === 's' ? 'singular' : 'plural'}) → si ${form}. (${it.inf})`,
      }));
    }
  }
  return out.filter(Boolean);
}

// ---------- 3.7 gerund ----------
// [infinitive, gerund, participle, present 3sg, sentence with ---- at the start]
const GERUNDS = [
  ['analizzare', 'analizzando', 'analizzato', 'analizza', '---- i dati, i ricercatori hanno trovato un errore.'],
  ['studiare', 'studiando', 'studiato', 'studia', "---- ogni giorno, Marco ha superato l'esame."],
  ['leggere', 'leggendo', 'letto', 'legge', '---- il giornale, ho scoperto la notizia.'],
  ['lavorare', 'lavorando', 'lavorato', 'lavora', '---- molto, hanno finito il progetto in tempo.'],
  ['esaminare', 'esaminando', 'esaminato', 'esamina', '---- il campione, il medico ha notato una differenza.'],
  ['ascoltare', 'ascoltando', 'ascoltato', 'ascolta', '---- la radio, mia madre prepara la cena.'],
  ['camminare', 'camminando', 'camminato', 'cammina', '---- per strada, ho incontrato un vecchio amico.'],
  ['aprire', 'aprendo', 'aperto', 'apre', '---- la finestra, ha sentito un rumore.'],
  ['scrivere', 'scrivendo', 'scritto', 'scrive', '---- una lettera, ha capito i suoi errori.'],
  ['dormire', 'dormendo', 'dormito', 'dorme', '---- poco, siamo sempre stanchi.'],
  ['fare', 'facendo', 'fatto', 'fa', '---- attenzione, potete evitare molti errori.'],
  ['dire', 'dicendo', 'detto', 'dice', '---- la verità, ha perso la fiducia dei colleghi.'],
  ['osservare', 'osservando', 'osservato', 'osserva', '---- il fenomeno, gli studiosi hanno formulato una teoria.'],
  ['confrontare', 'confrontando', 'confrontato', 'confronta', '---- i due testi, ho notato molte differenze.'],
  ['usare', 'usando', 'usato', 'usa', '---- un metodo nuovo, hanno ottenuto risultati migliori.'],
  ['bere', 'bevendo', 'bevuto', 'beve', '---- troppo caffè, non riesco a dormire.'],
  ['viaggiare', 'viaggiando', 'viaggiato', 'viaggia', '---- in treno, si vedono bei paesaggi.'],
  ['ripetere', 'ripetendo', 'ripetuto', 'ripete', '---- gli esercizi, si impara meglio.'],
  ['pensare', 'pensando', 'pensato', 'pensa', '---- a lungo, ha trovato la soluzione.'],
  ['correre', 'correndo', 'corso', 'corre', '---- ogni mattina, è diventato più forte.'],
  ['mangiare', 'mangiando', 'mangiato', 'mangia', '---- troppo in fretta, ha avuto mal di stomaco.'],
  ['parlare', 'parlando', 'parlato', 'parla', '---- con gli esperti, abbiamo capito il problema.'],
  ['aspettare', 'aspettando', 'aspettato', 'aspetta', '---- il treno, ho letto un libro.'],
  ['guardare', 'guardando', 'guardato', 'guarda', '---- il film, ha pianto.'],
  ['discutere', 'discutendo', 'discusso', 'discute', '---- il problema, hanno trovato una soluzione.'],
];
const PAST_GERUNDS = [
  ['Essendo', ['Avendo', 'Essere', 'Stato'], '---- arrivato tardi, ha perso il treno.', 'arrivare takes essere → essendo arrivato.'],
  ['Avendo', ['Essendo', 'Avere', 'Stato'], '---- studiato molto, ha superato l\'esame.', 'studiare takes avere → avendo studiato.'],
  ['Essendo', ['Avendo', 'Essere', 'Stato'], '---- partiti presto, siamo arrivati in orario.', 'partire takes essere → essendo partiti.'],
  ['Avendo', ['Essendo', 'Avere', 'Stato'], '---- capito il problema, hanno trovato la soluzione.', 'capire takes avere → avendo capito.'],
  ['Essendo', ['Avendo', 'Essere', 'Stato'], '---- tornata a casa, ha chiamato sua madre.', 'tornare takes essere → essendo tornata.'],
  ['Avendo', ['Essendo', 'Avere', 'Stato'], '---- letto tutto il libro, ho scritto una recensione.', 'leggere takes avere → avendo letto.'],
  ['Essendo', ['Avendo', 'Essere', 'Stato'], '---- usciti tardi, abbiamo perso l\'autobus.', 'uscire takes essere → essendo usciti.'],
];
function gerundQuestions(rng) {
  const out = [];
  for (const [inf, ger, pp, pres, sentence] of GERUNDS) {
    out.push(makeQuestion({
      gen: 'ger', topic: 'lesson.3.7', rng, prompt: sentence.replace('----', '----'), answer: cap(ger),
      distractors: [cap(inf), cap(pres), cap(imperfect3(inf))],
      explain: `Gerund of ${inf} = ${ger} (-ando for -are verbs, -endo for -ere/-ire). It means "by / while doing" the action. The other options are the infinitive, the present and the imperfect.`,
    }));
  }
  for (const [ans, d, sentence, why] of PAST_GERUNDS) {
    out.push(makeQuestion({ gen: 'ger-past', topic: 'lesson.3.7', rng, prompt: sentence, answer: ans, distractors: d, explain: `Past gerund = avendo / essendo + participle. ${why}` }));
  }
  return out.filter(Boolean);
}

// ---------- 3.8 conditional ----------
const IF_FRAMES = ['Se avessi più tempo,', 'Se potessi scegliere,', 'Se fosse possibile,'];
function conditionalQuestions(rng) {
  const out = [];
  const add = (inf, fut, comps) => {
    const cond = conditionalFromFuture(fut[0]);
    for (const s of SUBJECTS) {
      for (const comp of comps) {
        const answer = cond[s.person];
        const q = makeQuestion({
          gen: `cond-${inf}`, topic: 'lesson.3.8', rng,
          prompt: `${pick(IF_FRAMES, rng)} ${mid(s.text)} ---- ${comp}.`,
          answer,
          // the future of the same person is offered on purpose: it is the classic wrong choice after "se + imperfect subjunctive"
          distractors: [fut[s.person], ...shuffleCopy(cond.filter((f) => f !== answer), rng)],
          explain: `${who(s)} → ${answer}. Conditional of ${inf}: ${cond.join(', ')}. A hypothetical "if" clause (imperfect subjunctive) needs the conditional, not the future.`,
        });
        if (q) out.push(q);
      }
    }
  };
  for (const [inf, fut] of Object.entries(IRREGULAR_FUTURE)) add(inf, fut, FUTURE_COMPS[inf]);
  for (const v of REGULAR_FUTURE_VERBS) add(v.inf, conjugateFuture(v), v.comps);
  return out.filter(Boolean);
}

// ---------- 3.9 present subjunctive ----------
const SUBJ_COMPS = { ...IRREGULAR_COMPS, ...Object.fromEntries(['potere', 'volere', 'dovere', 'sapere', 'dire'].map((v) => [v, FUTURE_COMPS[v]])), uscire: ['con gli amici', 'ogni sera', 'presto'] };
function subjunctiveQuestions(rng) {
  const out = [];
  const add = (inf, subj, ind, comps) => {
    for (const s of SUBJECTS) {
      const answer = subj[s.person];
      if (answer === ind[s.person]) continue; // identical to the indicative: nothing to test
      const triggers = [...SUBJ_TRIGGERS.filter((t) => !(t === 'Voglio che' && s.person === 0)), ...SUBJ_CONNECTORS];
      for (const comp of comps.slice(0, 3)) {
        const trigger = pick(triggers, rng);
        const prompt = SUBJ_CONNECTORS.includes(trigger)
          ? `${trigger} ${mid(s.text)} ---- ${comp}, non cambia idea.`
          : `${trigger} ${mid(s.text)} ---- ${comp}.`;
        const q = makeQuestion({
          gen: `subj-${inf}`, topic: 'lesson.3.9', rng, prompt, answer,
          distractors: [ind[s.person], ...shuffleCopy(subj.filter((f) => f !== answer && f !== ind[s.person]), rng)],
          explain: `"${trigger}" triggers the subjunctive. ${who(s)} → ${answer}. Present subjunctive of ${inf}: ${subj.join(', ')}.`,
        });
        if (q) out.push(q);
      }
    }
  };
  for (const [inf, subj] of Object.entries(SUBJ_IRREGULAR)) add(inf, subj, IRREGULAR_PRESENT[inf], SUBJ_COMPS[inf]);
  for (const v of REGULAR_VERBS) add(v.inf, conjugateSubjunctive(v), conjugatePresent(v), v.comps);
  return out.filter(Boolean);
}

// ---------- 3.10 hypothetical periods (hand-written pairs) ----------
// [prompt, answer, [3 wrong], explanation]
const UNREAL = 'Unreal condition (se + imperfect subjunctive) → conditional.';
const UNREAL_IF = 'The "if" clause of an unreal condition takes the imperfect subjunctive.';
const PAST_UNREAL = 'Impossible in the past (se + trapassato congiuntivo) → past conditional (avrei / sarei + participle).';
const PAST_IF = 'The "if" clause of a past unreal condition takes the trapassato congiuntivo (avessi / fossi + participle).';
const HYP = [
  ['Se fossi ricco, io ---- una casa grande.', 'comprerei', ['compro', 'comprerò', 'comprassi'], UNREAL],
  ['Se avessi più tempo, io ---- di più.', 'viaggerei', ['viaggio', 'viaggerò', 'viaggiassi'], UNREAL],
  ['Se potessimo, noi ---- subito.', 'partiremmo', ['partiamo', 'partiremo', 'partissimo'], UNREAL],
  ['Se sapessi la risposta, te la ----.', 'direi', ['dico', 'dirò', 'dicessi'], UNREAL],
  ['Se fossero qui, loro ci ----.', 'aiuterebbero', ['aiutano', 'aiuteranno', 'aiutassero'], UNREAL],
  ['Se il tempo fosse bello, noi ---- al mare.', 'andremmo', ['andiamo', 'andremo', 'andassimo'], UNREAL],
  ['Se vincessi la lotteria, tu cosa ----?', 'faresti', ['fai', 'farai', 'facessi'], UNREAL],
  ['Se studiassero di più, loro ---- l\'esame.', 'supererebbero', ['superano', 'supereranno', 'superassero'], UNREAL],
  ['Se avessimo una macchina, noi ---- più liberi.', 'saremmo', ['siamo', 'saremo', 'fossimo'], UNREAL],
  ['Se lui parlasse meglio inglese, ---- un lavoro migliore.', 'troverebbe', ['trova', 'troverà', 'trovasse'], UNREAL],
  ['Se avessi fame, io ---- qualcosa.', 'mangerei', ['mangio', 'mangerò', 'mangiassi'], UNREAL],
  ['Se lei sapesse la verità, ---- molto arrabbiata.', 'sarebbe', ['è', 'sarà', 'fosse'], UNREAL],
  ['Se ci fosse più tempo, noi ---- tutto.', 'finiremmo', ['finiamo', 'finiremo', 'finissimo'], UNREAL],
  ['Se avessero più soldi, loro ---- una casa nuova.', 'comprerebbero', ['comprano', 'compreranno', 'comprassero'], UNREAL],
  ['Se fossi un uccello, io ---- sopra le montagne.', 'volerei', ['volo', 'volerò', 'volassi'], UNREAL],
  ['Se studiassi medicina, tu ---- un bravo dottore.', 'saresti', ['sei', 'sarai', 'fossi'], UNREAL],
  ['Se piovesse, noi ---- a casa.', 'resteremmo', ['restiamo', 'resteremo', 'restassimo'], UNREAL],
  ['Se io ---- più tempo, imparerei il cinese.', 'avessi', ['ho', 'avrei', 'avrò'], UNREAL_IF],
  ['Se tu ---- ricco, compreresti una casa.', 'fossi', ['sei', 'saresti', 'sarai'], UNREAL_IF],
  ['Se noi ---- il tempo, verremmo volentieri.', 'avessimo', ['abbiamo', 'avremmo', 'avremo'], UNREAL_IF],
  ['Se lui ---- qui, ci aiuterebbe.', 'fosse', ['è', 'sarebbe', 'sarà'], UNREAL_IF],
  ['Se loro ---- di più, supererebbero l\'esame.', 'studiassero', ['studiano', 'studierebbero', 'studieranno'], UNREAL_IF],
  ['Se io ---- la risposta, te la direi.', 'sapessi', ['so', 'saprei', 'saprò'], UNREAL_IF],
  ['Se voi ---- più attenti, fareste meno errori.', 'foste', ['siete', 'sareste', 'sarete'], UNREAL_IF],
  ['Se noi ---- partire, partiremmo subito.', 'potessimo', ['possiamo', 'potremmo', 'potremo'], UNREAL_IF],
  ['Se ---- bel tempo, andremmo al mare.', 'facesse', ['fa', 'farebbe', 'farà'], UNREAL_IF],
  ['Se tu ---- a Roma, vedresti il Colosseo.', 'andassi', ['vai', 'andresti', 'andrai'], UNREAL_IF],
  ['Se lui ---- più paziente, avrebbe più amici.', 'fosse', ['è', 'sarebbe', 'sarà'], UNREAL_IF],
  ['Se voi ---- venire, sareste i benvenuti.', 'voleste', ['volete', 'vorreste', 'vorrete'], UNREAL_IF],
  ['Se loro ---- la verità, cambierebbero idea.', 'sapessero', ['sanno', 'saprebbero', 'sapranno'], UNREAL_IF],
  ['Se lei ---- più tempo, finirebbe il lavoro.', 'avesse', ['ha', 'avrebbe', 'avrà'], UNREAL_IF],
  ['Se avessi studiato, io ---- l\'esame.', 'avrei superato', ['ho superato', 'supererò', 'avessi superato'], PAST_UNREAL],
  ['Se fossimo partiti prima, ---- il treno.', 'avremmo preso', ['abbiamo preso', 'prenderemo', 'avessimo preso'], PAST_UNREAL],
  ['Se lei avesse chiamato, noi ---- subito.', 'saremmo venuti', ['siamo venuti', 'verremo', 'fossimo venuti'], PAST_UNREAL],
  ['Se avessi saputo la verità, ---- diversamente.', 'avrei agito', ['ho agito', 'agirò', 'avessi agito'], PAST_UNREAL],
  ['Se tu avessi studiato di più, ---- un voto migliore.', 'avresti preso', ['hai preso', 'prenderai', 'avessi preso'], PAST_UNREAL],
  ['Se avessimo avuto più tempo, ---- la visita.', 'avremmo finito', ['abbiamo finito', 'finiremo', 'avessimo finito'], PAST_UNREAL],
  ['Se loro avessero ascoltato, ---- il problema.', 'avrebbero capito', ['hanno capito', 'capiranno', 'avessero capito'], PAST_UNREAL],
  ['Se avessi letto il libro, ---- la risposta.', 'avresti trovato', ['hai trovato', 'troverai', 'avessi trovato'], PAST_UNREAL],
  ['Se voi aveste chiamato prima, ---- un posto.', 'avreste trovato', ['avete trovato', 'troverete', 'aveste trovato'], PAST_UNREAL],
  ['Se non avesse piovuto, noi ---- una passeggiata.', 'avremmo fatto', ['abbiamo fatto', 'faremo', 'avessimo fatto'], PAST_UNREAL],
  ['Se lei avesse accettato, ---- molto contenta.', 'sarebbe stata', ['è stata', 'sarà', 'fosse stata'], PAST_UNREAL],
  ['Se ---- studiato, avresti superato l\'esame.', 'avessi', ['ho', 'avrei', 'avrò'], PAST_IF],
  ['Se lui ---- chiamato, saremmo venuti.', 'avesse', ['ha', 'avrebbe', 'avrà'], PAST_IF],
  ['Se noi ---- partiti prima, avremmo preso il treno.', 'fossimo', ['siamo', 'saremmo', 'saremo'], PAST_IF],
  ['Se loro ---- ascoltato, avrebbero capito.', 'avessero', ['hanno', 'avrebbero', 'avranno'], PAST_IF],
  ['Se tu ---- venuto, ti saresti divertito.', 'fossi', ['sei', 'saresti', 'sarai'], PAST_IF],
  ['Se voi ---- arrivati prima, avreste visto tutto.', 'foste', ['siete', 'sareste', 'sarete'], PAST_IF],
  ['Se io ---- saputo, ti avrei avvisato.', 'avessi', ['ho', 'avrei', 'avrò'], PAST_IF],
  ['Se lei ---- accettato, sarebbe stata felice.', 'avesse', ['ha', 'avrebbe', 'avrà'], PAST_IF],
  // real condition: the present indicative; the conditional / subjunctive options are wrong here
  ['Se piove domani, noi ---- a casa.', 'restiamo', ['resteremmo', 'restassimo', 'saremmo restati'], 'Real condition (se + present indicative) → present or future, never the conditional.'],
  ['Se studi, ---- l\'esame.', 'superi', ['supereresti', 'superassi', 'avresti superato'], 'Real condition (se + present) → present or future.'],
  ['Se domani ---- freddo, resteremo a casa.', 'fa', ['facesse', 'farebbe', 'avesse fatto'], 'Real condition: se + present indicative (fa).'],
  ['Se hai fame, ---- qualcosa!', 'mangia', ['mangerebbe', 'mangiasse', 'avresti mangiato'], 'Real condition (se + present) → imperative or present.'],
  ['Se i dati ---- corretti, il risultato è valido.', 'sono', ['fossero', 'sarebbero', 'siano stati'], 'Real condition: se + present indicative.'],
  ['Se arrivi presto, ---- un buon posto.', 'trovi', ['troveresti', 'trovassi', 'avresti trovato'], 'Real condition (se + present) → present or future.'],
  ['Se loro ---- in ritardo, aspettiamo.', 'sono', ['fossero', 'sarebbero', 'siano stati'], 'Real condition: se + present indicative.'],
];
function hypotheticalQuestions(rng) {
  return HYP.map(([prompt, answer, wrong, explain]) => makeQuestion({
    gen: 'hyp', topic: 'lesson.3.10', rng, prompt, answer, distractors: wrong, explain: `${explain} → ${answer}.`,
  })).filter(Boolean);
}

export function generate(rng) {
  return [
    ...imperfectQuestions(rng), ...remoteQuestions(rng), ...passiveQuestions(rng), ...siQuestions(rng),
    ...gerundQuestions(rng), ...conditionalQuestions(rng), ...subjunctiveQuestions(rng), ...hypotheticalQuestions(rng),
  ];
}
