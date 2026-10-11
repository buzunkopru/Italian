// Tables for Level 3 grammar: imperfetto, passato remoto, conditional, subjunctive, passive, gerund.
// Person order everywhere: io, tu, lui/lei, noi, voi, loro. Hand-checked.
import { IRREGULAR_PRESENT, REGULAR_VERBS, conjugatePresent, IRREGULAR_FUTURE, REGULAR_FUTURE_VERBS, conjugateFuture } from './verbs.js';

// ---------- imperfetto ----------
const IMPF_ENDS = { are: ['avo', 'avi', 'ava', 'avamo', 'avate', 'avano'], ere: ['evo', 'evi', 'eva', 'evamo', 'evate', 'evano'], ire: ['ivo', 'ivi', 'iva', 'ivamo', 'ivate', 'ivano'] };
export const conjugateImperfect = (inf) => IMPF_ENDS[inf.slice(-3)].map((e) => inf.slice(0, -3) + e);

export const IMPERFECT_IRREGULAR = {
  essere: { forms: ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'], comps: ['a casa', 'in ufficio', 'in Italia', 'a scuola'] },
  fare: { forms: ['facevo', 'facevi', 'faceva', 'facevamo', 'facevate', 'facevano'], comps: ['sport', 'una passeggiata', 'i compiti', 'colazione presto'] },
  dire: { forms: ['dicevo', 'dicevi', 'diceva', 'dicevamo', 'dicevate', 'dicevano'], comps: ['sempre la verità', 'poche parole'] },
  bere: { forms: ['bevevo', 'bevevi', 'beveva', 'bevevamo', 'bevevate', 'bevevano'], comps: ['molto caffè', 'tanto tè'] },
};
export const IMPERFECT_REGULAR = [
  { inf: 'avere', comps: ['molto tempo', 'un cane', 'poca pazienza', 'tanti amici'] },
  { inf: 'andare', comps: ['al mare', 'in biblioteca', 'a Roma', 'in montagna'] },
  { inf: 'parlare', comps: ['italiano con gli amici', 'molto', 'di politica'] },
  { inf: 'lavorare', comps: ['in una banca', 'in un negozio', 'fino a tardi'] },
  { inf: 'abitare', comps: ['in campagna', 'a Napoli', 'vicino al mare'] },
  { inf: 'studiare', comps: ['di sera', 'in biblioteca', 'molto'] },
  { inf: 'giocare', comps: ['a calcio', 'a carte', 'nel parco'] },
  { inf: 'leggere', comps: ['un libro a settimana', 'il giornale', 'molti romanzi'] },
  { inf: 'dormire', comps: ['poco', 'fino a tardi', 'otto ore'] },
  { inf: 'mangiare', comps: ['sempre a casa', 'molta frutta', 'presto'] },
  { inf: 'uscire', comps: ['con gli amici', 'ogni sera', 'presto'] },
  { inf: 'partire', comps: ['presto', 'sempre di sabato'] },
  { inf: 'capire', comps: ['tutto', 'poco'] },
];
export const IMPERFECT_TIMES = ['Ogni estate', 'Allora', 'In quegli anni', 'Di solito', 'Ogni domenica', 'Una volta'];

// ---------- passato remoto (all six persons) ----------
const REM_ENDS = { are: ['ai', 'asti', 'ò', 'ammo', 'aste', 'arono'], ere: ['ei', 'esti', 'é', 'emmo', 'este', 'erono'], ire: ['ii', 'isti', 'ì', 'immo', 'iste', 'irono'] };
export const REMOTE_REGULAR = [
  { inf: 'costruire', obj: 'un grande ponte' },
  { inf: 'conquistare', obj: 'la città' },
  { inf: 'fondare', obj: 'una nuova università' },
  { inf: 'abitare', obj: 'in quel palazzo' },
  { inf: 'decidere', irregular: ['decisi', 'decidesti', 'decise', 'decidemmo', 'decideste', 'decisero'], obj: 'di partire' },
  { inf: 'capire', obj: 'il problema' },
  { inf: 'finire', obj: 'il lavoro' },
  { inf: 'arrivare', obj: 'a Roma' },
  { inf: 'governare', obj: 'per molti anni' },
  { inf: 'viaggiare', obj: 'in Oriente' },
  { inf: 'pubblicare', hard: true, obj: 'un lungo trattato' },
];
export const REMOTE_IRREGULAR = {
  essere: { forms: ['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono'], obj: 'a Roma per molti anni' },
  avere: { forms: ['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero'], obj: 'grande successo' },
  fare: { forms: ['feci', 'facesti', 'fece', 'facemmo', 'faceste', 'fecero'], obj: 'una scoperta importante' },
  dire: { forms: ['dissi', 'dicesti', 'disse', 'dicemmo', 'diceste', 'dissero'], obj: 'la verità' },
  scrivere: { forms: ['scrissi', 'scrivesti', 'scrisse', 'scrivemmo', 'scriveste', 'scrissero'], obj: 'un lungo poema' },
  vedere: { forms: ['vidi', 'vedesti', 'vide', 'vedemmo', 'vedeste', 'videro'], obj: 'la costa' },
  venire: { forms: ['venni', 'venisti', 'venne', 'venimmo', 'veniste', 'vennero'], obj: 'in città' },
  vivere: { forms: ['vissi', 'vivesti', 'visse', 'vivemmo', 'viveste', 'vissero'], obj: 'a lungo in Francia' },
  vincere: { forms: ['vinsi', 'vincesti', 'vinse', 'vincemmo', 'vinceste', 'vinsero'], obj: 'la battaglia' },
  prendere: { forms: ['presi', 'prendesti', 'prese', 'prendemmo', 'prendeste', 'presero'], obj: 'il potere' },
  leggere: { forms: ['lessi', 'leggesti', 'lesse', 'leggemmo', 'leggeste', 'lessero'], obj: 'tutti i libri' },
  mettere: { forms: ['misi', 'mettesti', 'mise', 'mettemmo', 'metteste', 'misero'], obj: 'fine alla guerra' },
  chiedere: { forms: ['chiesi', 'chiedesti', 'chiese', 'chiedemmo', 'chiedeste', 'chiesero'], obj: 'un aiuto' },
  rispondere: { forms: ['risposi', 'rispondesti', 'rispose', 'rispondemmo', 'rispondeste', 'risposero'], obj: 'subito' },
  scegliere: { forms: ['scelsi', 'scegliesti', 'scelse', 'scegliemmo', 'sceglieste', 'scelsero'], obj: 'un nuovo capo' },
  rimanere: { forms: ['rimasi', 'rimanesti', 'rimase', 'rimanemmo', 'rimaneste', 'rimasero'], obj: 'in città' },
};
export function conjugateRemote(v) {
  if (v.irregular) return v.irregular;
  const kind = v.inf.slice(-3);
  let stem = v.inf.slice(0, -3);
  return REM_ENDS[kind].map((e) => stem + e);
}
/** Subjects for historical sentences (3rd person only). */
export const HISTORY_SUBJECTS = [
  { text: 'Il re', person: 2 }, { text: "L'imperatore", person: 2 }, { text: 'La regina', person: 2 },
  { text: 'Gli esploratori', person: 5 }, { text: 'I romani', person: 5 }, { text: 'I due fratelli', person: 5 },
];
export const HISTORY_TIMES = ['Nel 1500', 'Nel 1700', 'Nel Medioevo', 'Un secolo dopo', "Nel XIX secolo", 'Nel 1850'];

// ---------- conditional present ----------
const CONDITIONAL_ENDS = ['ei', 'esti', 'ebbe', 'emmo', 'este', 'ebbero'];
export const conditionalFromFuture = (future1sg) => CONDITIONAL_ENDS.map((e) => future1sg.slice(0, -1) + e);

// ---------- congiuntivo presente ----------
export const SUBJ_IRREGULAR = {
  essere: ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'],
  avere: ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano'],
  fare: ['faccia', 'faccia', 'faccia', 'facciamo', 'facciate', 'facciano'],
  andare: ['vada', 'vada', 'vada', 'andiamo', 'andiate', 'vadano'],
  venire: ['venga', 'venga', 'venga', 'veniamo', 'veniate', 'vengano'],
  potere: ['possa', 'possa', 'possa', 'possiamo', 'possiate', 'possano'],
  volere: ['voglia', 'voglia', 'voglia', 'vogliamo', 'vogliate', 'vogliano'],
  dovere: ['debba', 'debba', 'debba', 'dobbiamo', 'dobbiate', 'debbano'],
  sapere: ['sappia', 'sappia', 'sappia', 'sappiamo', 'sappiate', 'sappiano'],
  dire: ['dica', 'dica', 'dica', 'diciamo', 'diciate', 'dicano'],
  stare: ['stia', 'stia', 'stia', 'stiamo', 'stiate', 'stiano'],
  dare: ['dia', 'dia', 'dia', 'diamo', 'diate', 'diano'],
  uscire: ['esca', 'esca', 'esca', 'usciamo', 'usciate', 'escano'],
};
const SUBJ_ENDS = { are: ['i', 'i', 'i', 'iamo', 'iate', 'ino'], ere: ['a', 'a', 'a', 'iamo', 'iate', 'ano'], ire: ['a', 'a', 'a', 'iamo', 'iate', 'ano'], isc: ['isca', 'isca', 'isca', 'iamo', 'iate', 'iscano'] };
export function conjugateSubjunctive(v) {
  let stem = v.inf.slice(0, -3);
  return SUBJ_ENDS[v.kind].map((e, i) => {
    let s = stem;
    if (v.soft && e.startsWith('i')) s = stem.slice(0, -1); // mangiamo, mangiate (one i)
    if (v.hard && e.startsWith('i')) s = stem + 'h'; // cerchi, cerchiamo
    return s + e;
  });
}
/** Present-subjunctive triggers that work in front of any clause. */
export const SUBJ_TRIGGERS = [
  'Penso che', 'Credo che', 'Sembra che', 'È necessario che', 'È importante che', 'È probabile che', 'Bisogna che',
  'Dubito che', 'Non credo che', 'Voglio che', 'È possibile che', 'È meglio che',
];
export const SUBJ_CONNECTORS = ['Sebbene', 'Benché'];

export { IRREGULAR_PRESENT, REGULAR_VERBS, conjugatePresent, IRREGULAR_FUTURE, REGULAR_FUTURE_VERBS, conjugateFuture };
