// Verb tables. Hand-checked; forms are in person order: io, tu, lui/lei, noi, voi, loro.
// Regular verbs are conjugated by rule (see conjugatePresent); everything irregular is spelled out.

export const PERSONS = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];

/** Subjects for present-tense sentences. person: index into PERSONS. */
export const SUBJECTS = [
  { text: 'Io', person: 0 },
  { text: 'Tu', person: 1 },
  { text: 'Marco', person: 2, label: 'Marco = lui' },
  { text: 'Giulia', person: 2, label: 'Giulia = lei' },
  { text: 'Il professore', person: 2, label: 'Il professore = lui' },
  { text: 'La dottoressa', person: 2, label: 'La dottoressa = lei' },
  { text: 'Noi', person: 3 },
  { text: 'Marco e io', person: 3, label: 'Marco e io = noi' },
  { text: 'Voi', person: 4 },
  { text: 'Tu e Luca', person: 4, label: 'Tu e Luca = voi' },
  { text: 'Loro', person: 5 },
  { text: 'I ragazzi', person: 5, label: 'I ragazzi = loro' },
  { text: 'Le studentesse', person: 5, label: 'Le studentesse = loro' },
  { text: 'Gli studenti', person: 5, label: 'Gli studenti = loro' },
];

export const IRREGULAR_PRESENT = {
  essere: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'],
  avere: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'],
  fare: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'],
  andare: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'],
  venire: ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono'],
  dare: ['do', 'dai', 'dà', 'diamo', 'date', 'danno'],
  stare: ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno'],
  potere: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'],
  volere: ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono'],
  dovere: ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono'],
  sapere: ['so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno'],
  dire: ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono'],
  uscire: ['esco', 'esci', 'esce', 'usciamo', 'uscite', 'escono'],
};

/**
 * Regular verbs. kind: 'are' | 'ere' | 'ire' | 'isc' (-ire with -isc-).
 * soft: -iare verbs that lose the i before i-endings (mangiare); hard: -care/-gare get an h (cercare).
 */
export const REGULAR_VERBS = [
  { inf: 'parlare', kind: 'are', comps: ['italiano con gli amici', 'con il direttore', 'di politica'] },
  { inf: 'lavorare', kind: 'are', comps: ['in una banca', 'in un ufficio', 'molto'] },
  { inf: 'abitare', kind: 'are', comps: ['a Istanbul', 'in centro', 'vicino alla stazione'] },
  { inf: 'comprare', kind: 'are', comps: ['il pane', 'un libro', 'due biglietti'] },
  { inf: 'ascoltare', kind: 'are', comps: ['la musica', 'la radio', 'il professore'] },
  { inf: 'mangiare', kind: 'are', soft: true, comps: ['la pizza', 'una mela', 'a casa'] },
  { inf: 'studiare', kind: 'are', soft: true, comps: ['italiano', 'in biblioteca', 'la sera'] },
  { inf: 'cercare', kind: 'are', hard: true, comps: ['le chiavi', 'un lavoro', 'una casa'] },
  { inf: 'pagare', kind: 'are', hard: true, comps: ['il conto', 'in contanti', 'con la carta'] },
  { inf: 'giocare', kind: 'are', hard: true, comps: ['a calcio', 'a tennis', 'con gli amici'] },
  { inf: 'leggere', kind: 'ere', comps: ['un giornale', 'un libro', 'la lettera'] },
  { inf: 'scrivere', kind: 'ere', comps: ['una mail', 'un messaggio', 'una lettera'] },
  { inf: 'vedere', kind: 'ere', comps: ['un film', 'la partita', 'gli amici'] },
  { inf: 'prendere', kind: 'ere', comps: ['il treno', 'un caffè', "l'autobus"] },
  { inf: 'chiudere', kind: 'ere', comps: ['la porta', 'la finestra', 'il negozio'] },
  { inf: 'vivere', kind: 'ere', comps: ['a Roma', 'in Italia', 'in campagna'] },
  { inf: 'credere', kind: 'ere', comps: ['alla storia', 'a tutto', 'agli amici'] },
  { inf: 'dormire', kind: 'ire', comps: ['otto ore', 'poco', 'fino a tardi'] },
  { inf: 'partire', kind: 'ire', comps: ['domani', 'per Roma', 'alle otto'] },
  { inf: 'sentire', kind: 'ire', comps: ['la musica', 'un rumore', 'la radio'] },
  { inf: 'aprire', kind: 'ire', comps: ['la porta', 'la finestra', 'il negozio'] },
  { inf: 'capire', kind: 'isc', comps: ['la lezione', "l'italiano", 'il problema'] },
  { inf: 'finire', kind: 'isc', comps: ['il lavoro', 'la lezione', 'alle sei'] },
  { inf: 'preferire', kind: 'isc', comps: ['il caffè', 'il tè', "l'estate"] },
  { inf: 'pulire', kind: 'isc', comps: ['la casa', 'la cucina', 'il bagno'] },
];

const ENDINGS = {
  are: ['o', 'i', 'a', 'iamo', 'ate', 'ano'],
  ere: ['o', 'i', 'e', 'iamo', 'ete', 'ono'],
  ire: ['o', 'i', 'e', 'iamo', 'ite', 'ono'],
  isc: ['isco', 'isci', 'isce', 'iamo', 'ite', 'iscono'],
};

export function conjugatePresent(v) {
  let stem = v.inf.slice(0, -3);
  const ends = ENDINGS[v.kind];
  return ends.map((e, i) => {
    let s = stem;
    // -iare: mangi, mangiamo (single i); -care/-gare: cerchi, cerchiamo (h before i/e)
    if (v.soft && e.startsWith('i')) s = stem.slice(0, -1);
    if (v.hard && (e === 'i' || e === 'iamo')) s = stem + 'h';
    return s + e;
  });
}

// ---- Verbs used with a modal (infinitive + complement) ----
export const MODALS = ['potere', 'volere', 'dovere'];
export const MODAL_INFINITIVES = [
  'studiare di più', 'partire domani', 'parlare con il direttore', 'uscire presto', 'comprare il pane',
  'leggere questo libro', 'aprire la finestra', 'andare in biblioteca', 'finire il lavoro', 'dormire di più',
  'scrivere una mail', 'prendere il treno',
];

// ---- Present-tense complements for the irregular verbs (must fit every person and number) ----
export const IRREGULAR_COMPS = {
  essere: ['a casa', 'in biblioteca', 'in ritardo', 'a scuola', 'in Italia', "all'università", 'in centro', 'qui'],
  avere: ['un libro', 'due fratelli', 'molti amici', 'fame', 'sete', 'ragione', 'paura', 'venti anni', 'una macchina nuova'],
  fare: ['i compiti', 'la spesa', 'colazione', 'una pausa', 'una passeggiata', 'sport'],
  andare: ['a scuola', 'al cinema', 'in biblioteca', 'a Roma', 'in centro', 'a casa'],
  venire: ['a casa mia', 'con noi', 'alla festa', 'domani', 'in Italia'],
  dare: ['un libro a Marco', 'una mano', 'un consiglio', 'un regalo agli amici'],
  stare: ['bene', 'male', 'a casa', 'qui'],
};

// ---- Passato prossimo ----
// aux: 'avere' | 'essere'. pp: participle. comp: natural complement.
export const AVERE_PP = [
  { inf: 'mangiare', pp: 'mangiato', comps: ['la pizza', 'una mela'] },
  { inf: 'parlare', pp: 'parlato', comps: ['con il direttore', 'con gli amici'] },
  { inf: 'studiare', pp: 'studiato', comps: ['tutto il giorno', 'in biblioteca'] },
  { inf: 'comprare', pp: 'comprato', comps: ['un libro', 'il pane'] },
  { inf: 'lavorare', pp: 'lavorato', comps: ['molto', 'fino a tardi'] },
  { inf: 'finire', pp: 'finito', comps: ['il lavoro', 'la lezione'] },
  { inf: 'capire', pp: 'capito', comps: ['la lezione', 'il problema'] },
  { inf: 'dormire', pp: 'dormito', comps: ['poco', 'otto ore'] },
  { inf: 'ascoltare', pp: 'ascoltato', comps: ['la musica', 'la radio'] },
  { inf: 'leggere', pp: 'letto', comps: ['un giornale', 'un libro'] },
  { inf: 'scrivere', pp: 'scritto', comps: ['una lettera', 'una mail'] },
  { inf: 'prendere', pp: 'preso', comps: ['il treno', 'un caffè'] },
  { inf: 'fare', pp: 'fatto', comps: ['i compiti', 'la spesa'] },
  { inf: 'dire', pp: 'detto', comps: ['la verità', 'una bugia'] },
  { inf: 'vedere', pp: 'visto', comps: ['un film', 'la partita'] },
  { inf: 'bere', pp: 'bevuto', comps: ['un caffè', "un po' d'acqua"] },
  { inf: 'aprire', pp: 'aperto', comps: ['la finestra', 'la porta'] },
  { inf: 'chiudere', pp: 'chiuso', comps: ['la porta', 'il negozio'] },
  { inf: 'mettere', pp: 'messo', comps: ['il libro sul tavolo', 'le chiavi in borsa'] },
  { inf: 'vincere', pp: 'vinto', comps: ['la partita', 'il primo premio'] },
  { inf: 'scegliere', pp: 'scelto', comps: ['un regalo', 'il vestito'] },
  { inf: 'rompere', pp: 'rotto', comps: ['il bicchiere', 'il telefono'] },
  { inf: 'perdere', pp: 'perso', comps: ['il treno', 'le chiavi'] },
  { inf: 'chiedere', pp: 'chiesto', comps: ['il conto', "un'informazione"] },
  { inf: 'rispondere', pp: 'risposto', comps: ['alla domanda', 'a Marco'] },
  { inf: 'decidere', pp: 'deciso', comps: ['di partire', 'di restare'] },
];

export const ESSERE_PP = [
  { inf: 'andare', pp: 'andato', comps: ['a Roma', 'al cinema'] },
  { inf: 'venire', pp: 'venuto', comps: ['alla festa', 'a casa mia'] },
  { inf: 'arrivare', pp: 'arrivato', comps: ['tardi', 'in ritardo'] },
  { inf: 'partire', pp: 'partito', comps: ['presto', 'per Roma'] },
  { inf: 'tornare', pp: 'tornato', comps: ['a casa', 'dal lavoro'] },
  { inf: 'uscire', pp: 'uscito', comps: ['di casa', 'con gli amici'] },
  { inf: 'entrare', pp: 'entrato', comps: ['in classe', 'nel negozio'] },
  { inf: 'restare', pp: 'restato', comps: ['a casa', 'in biblioteca'] },
  { inf: 'rimanere', pp: 'rimasto', comps: ['a casa', 'in ufficio'] },
  { inf: 'salire', pp: 'salito', comps: ['al terzo piano', 'sul treno'] },
  { inf: 'scendere', pp: 'sceso', comps: ['dal treno', "dall'autobus"] },
];

/** Subjects for essere-verbs: gender and number known, so the participle is unambiguous. */
export const ESSERE_SUBJECTS = [
  { text: 'Marco', person: 2, g: 'm', n: 's' },
  { text: 'Giulia', person: 2, g: 'f', n: 's' },
  { text: 'Il professore', person: 2, g: 'm', n: 's' },
  { text: 'La dottoressa', person: 2, g: 'f', n: 's' },
  { text: 'I ragazzi', person: 5, g: 'm', n: 'p' },
  { text: 'Le ragazze', person: 5, g: 'f', n: 'p' },
  { text: 'Marco e io', person: 3, g: 'm', n: 'p' },
  { text: 'Anna e io', person: 3, g: 'f', n: 'p' },
  { text: 'Tu e Luca', person: 4, g: 'm', n: 'p' },
  { text: 'Tu e Anna', person: 4, g: 'f', n: 'p' },
];

export const PAST_TIMES = ['Ieri', 'Ieri sera', 'Stamattina', 'La settimana scorsa', "L'anno scorso", 'Due giorni fa'];

// ---- Future ----
export const IRREGULAR_FUTURE = {
  essere: ['sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno'],
  avere: ['avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno'],
  fare: ['farò', 'farai', 'farà', 'faremo', 'farete', 'faranno'],
  andare: ['andrò', 'andrai', 'andrà', 'andremo', 'andrete', 'andranno'],
  venire: ['verrò', 'verrai', 'verrà', 'verremo', 'verrete', 'verranno'],
  potere: ['potrò', 'potrai', 'potrà', 'potremo', 'potrete', 'potranno'],
  volere: ['vorrò', 'vorrai', 'vorrà', 'vorremo', 'vorrete', 'vorranno'],
  dovere: ['dovrò', 'dovrai', 'dovrà', 'dovremo', 'dovrete', 'dovranno'],
  sapere: ['saprò', 'saprai', 'saprà', 'sapremo', 'saprete', 'sapranno'],
  vedere: ['vedrò', 'vedrai', 'vedrà', 'vedremo', 'vedrete', 'vedranno'],
  dare: ['darò', 'darai', 'darà', 'daremo', 'darete', 'daranno'],
  stare: ['starò', 'starai', 'starà', 'staremo', 'starete', 'staranno'],
  bere: ['berrò', 'berrai', 'berrà', 'berremo', 'berrete', 'berranno'],
  dire: ['dirò', 'dirai', 'dirà', 'diremo', 'direte', 'diranno'],
};

export const FUTURE_COMPS = {
  essere: ['a casa', 'in ufficio', 'a Roma'],
  avere: ['molto tempo', 'una macchina nuova', 'un esame difficile'],
  fare: ['una passeggiata', 'i compiti', 'la spesa'],
  andare: ['in Italia', 'al mare', 'a Milano'],
  venire: ['alla festa', 'con noi', 'a casa mia'],
  potere: ['aiutarti', 'partire', 'venire'],
  volere: ['restare qui', 'una risposta', 'parlare con te'],
  dovere: ['studiare', 'lavorare', 'partire presto'],
  sapere: ['la verità', 'il risultato', 'la risposta'],
  vedere: ['un film', 'gli amici', 'la partita'],
  dare: ['una mano', 'un consiglio', 'un regalo'],
  stare: ['bene', 'a casa', 'qui'],
  bere: ['un caffè', "un po' d'acqua", 'un tè'],
  dire: ['la verità', 'tutto', 'una cosa importante'],
};

// Regular futures: -are/-ere/-ire -> stem + er(-are/-ere) / ir(-ire) + endings; -care/-gare add h; -ciare/-giare drop i.
export const REGULAR_FUTURE_VERBS = [
  { inf: 'parlare', comps: ['con il direttore', 'italiano'] },
  { inf: 'lavorare', comps: ['in banca', 'domani sera'] },
  { inf: 'comprare', comps: ['un libro', 'il pane'] },
  { inf: 'mangiare', soft: true, comps: ['la pizza', 'a casa'] },
  { inf: 'cercare', hard: true, comps: ['un lavoro', 'una casa'] },
  { inf: 'pagare', hard: true, comps: ['il conto', 'in contanti'] },
  { inf: 'cominciare', soft: true, comps: ['il corso', 'a lavorare'] },
  { inf: 'leggere', comps: ['un libro', 'il giornale'] },
  { inf: 'scrivere', comps: ['una mail', 'una lettera'] },
  { inf: 'prendere', comps: ['il treno', "l'autobus"] },
  { inf: 'chiudere', comps: ['il negozio', 'la porta'] },
  { inf: 'dormire', comps: ['otto ore', 'fino a tardi'] },
  { inf: 'partire', comps: ['per Roma', 'alle otto'] },
  { inf: 'capire', comps: ['la lezione', 'il problema'] },
  { inf: 'finire', comps: ['il lavoro', 'alle sei'] },
];
const FUT_ENDS = ['ò', 'ai', 'à', 'emo', 'ete', 'anno'];

export function conjugateFuture(v) {
  const kind = v.inf.slice(-3);
  let stem = v.inf.slice(0, -3);
  if (v.soft) stem = stem.slice(0, -1);
  if (v.hard) stem += 'h';
  const thematic = kind === 'are' ? 'er' : kind === 'ere' ? 'er' : 'ir';
  return FUT_ENDS.map((e) => stem + thematic + e);
}

export const FUTURE_TIMES = ['Domani', 'Il mese prossimo', "L'anno prossimo", 'Tra due settimane', 'Fra un mese', 'Dopodomani'];

// ---- Reflexive verbs (present) ----
export const REFLEXIVES = [
  { inf: 'alzarsi', forms: ['alzo', 'alzi', 'alza', 'alziamo', 'alzate', 'alzano'], comp: 'alle sette' },
  { inf: 'svegliarsi', forms: ['sveglio', 'svegli', 'sveglia', 'svegliamo', 'svegliate', 'svegliano'], comp: 'alle sei' },
  { inf: 'lavarsi', forms: ['lavo', 'lavi', 'lava', 'laviamo', 'lavate', 'lavano'], comp: 'le mani' },
  { inf: 'vestirsi', forms: ['vesto', 'vesti', 'veste', 'vestiamo', 'vestite', 'vestono'], comp: 'in fretta' },
  { inf: 'divertirsi', forms: ['diverto', 'diverti', 'diverte', 'divertiamo', 'divertite', 'divertono'], comp: 'molto alla festa' },
  { inf: 'sentirsi', forms: ['sento', 'senti', 'sente', 'sentiamo', 'sentite', 'sentono'], comp: 'bene oggi' },
  { inf: 'addormentarsi', forms: ['addormento', 'addormenti', 'addormenta', 'addormentiamo', 'addormentate', 'addormentano'], comp: 'presto' },
  { inf: 'riposarsi', forms: ['riposo', 'riposi', 'riposa', 'riposiamo', 'riposate', 'riposano'], comp: 'dopo pranzo' },
  { inf: 'fermarsi', forms: ['fermo', 'fermi', 'ferma', 'fermiamo', 'fermate', 'fermano'], comp: 'qui' },
];
export const REFLEXIVE_PRONOUNS = ['mi', 'ti', 'si', 'ci', 'vi', 'si'];
