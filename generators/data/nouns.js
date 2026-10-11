// Nouns with gender and plural, spelled out by hand. Articles are derived by rule (see articles.js).
// kind: 'person' | 'thing'.  place: 'in' (can be "inside" something) | 'on' (can be "on" something).

export const NOUNS = [
  // ---- people ----
  { sg: 'amico', pl: 'amici', g: 'm', kind: 'person' },
  { sg: 'amica', pl: 'amiche', g: 'f', kind: 'person' },
  { sg: 'professore', pl: 'professori', g: 'm', kind: 'person' },
  { sg: 'professoressa', pl: 'professoresse', g: 'f', kind: 'person' },
  { sg: 'studente', pl: 'studenti', g: 'm', kind: 'person' },
  { sg: 'studentessa', pl: 'studentesse', g: 'f', kind: 'person' },
  { sg: 'medico', pl: 'medici', g: 'm', kind: 'person' },
  { sg: 'dottoressa', pl: 'dottoresse', g: 'f', kind: 'person' },
  { sg: 'ragazzo', pl: 'ragazzi', g: 'm', kind: 'person' },
  { sg: 'ragazza', pl: 'ragazze', g: 'f', kind: 'person' },
  { sg: 'bambino', pl: 'bambini', g: 'm', kind: 'person' },
  { sg: 'bambina', pl: 'bambine', g: 'f', kind: 'person' },
  { sg: 'uomo', pl: 'uomini', g: 'm', kind: 'person' },
  { sg: 'signore', pl: 'signori', g: 'm', kind: 'person' },
  { sg: 'signora', pl: 'signore', g: 'f', kind: 'person' },
  { sg: 'zio', pl: 'zii', g: 'm', kind: 'person' },
  { sg: 'zia', pl: 'zie', g: 'f', kind: 'person' },
  { sg: 'psicologo', pl: 'psicologi', g: 'm', kind: 'person' },
  { sg: 'straniero', pl: 'stranieri', g: 'm', kind: 'person' },
  { sg: 'straniera', pl: 'straniere', g: 'f', kind: 'person' },
  // ---- things ----
  { sg: 'libro', pl: 'libri', g: 'm', kind: 'thing' },
  { sg: 'quaderno', pl: 'quaderni', g: 'm', kind: 'thing' },
  { sg: 'tavolo', pl: 'tavoli', g: 'm', kind: 'thing', place: 'on' },
  { sg: 'zaino', pl: 'zaini', g: 'm', kind: 'thing', place: 'in' },
  { sg: 'armadio', pl: 'armadi', g: 'm', kind: 'thing', place: 'in' },
  { sg: 'scaffale', pl: 'scaffali', g: 'm', kind: 'thing', place: 'on' },
  { sg: 'cassetto', pl: 'cassetti', g: 'm', kind: 'thing', place: 'in' },
  { sg: 'letto', pl: 'letti', g: 'm', kind: 'thing', place: 'on' },
  { sg: 'divano', pl: 'divani', g: 'm', kind: 'thing', place: 'on' },
  { sg: 'giardino', pl: 'giardini', g: 'm', kind: 'thing', place: 'in' },
  { sg: 'balcone', pl: 'balconi', g: 'm', kind: 'thing', place: 'on' },
  { sg: 'ufficio', pl: 'uffici', g: 'm', kind: 'thing', place: 'in' },
  { sg: 'albero', pl: 'alberi', g: 'm', kind: 'thing' },
  { sg: 'orologio', pl: 'orologi', g: 'm', kind: 'thing' },
  { sg: 'esame', pl: 'esami', g: 'm', kind: 'thing' },
  { sg: 'specchio', pl: 'specchi', g: 'm', kind: 'thing' },
  { sg: 'studio', pl: 'studi', g: 'm', kind: 'thing', place: 'in' },
  { sg: 'sedia', pl: 'sedie', g: 'f', kind: 'thing', place: 'on' },
  { sg: 'borsa', pl: 'borse', g: 'f', kind: 'thing', place: 'in' },
  { sg: 'scrivania', pl: 'scrivanie', g: 'f', kind: 'thing', place: 'on' },
  { sg: 'finestra', pl: 'finestre', g: 'f', kind: 'thing' },
  { sg: 'porta', pl: 'porte', g: 'f', kind: 'thing' },
  { sg: 'stanza', pl: 'stanze', g: 'f', kind: 'thing', place: 'in' },
  { sg: 'casa', pl: 'case', g: 'f', kind: 'thing', place: 'in' },
  { sg: 'scatola', pl: 'scatole', g: 'f', kind: 'thing', place: 'in' },
  { sg: 'valigia', pl: 'valigie', g: 'f', kind: 'thing', place: 'in' },
  { sg: 'isola', pl: 'isole', g: 'f', kind: 'thing' },
  { sg: 'aula', pl: 'aule', g: 'f', kind: 'thing', place: 'in' },
  { sg: 'scuola', pl: 'scuole', g: 'f', kind: 'thing' },
  { sg: 'scarpa', pl: 'scarpe', g: 'f', kind: 'thing' },
  { sg: 'università', pl: 'università', g: 'f', kind: 'thing' },
];

export const DEFINITE_FORMS = ['il', 'lo', "l'", 'la', 'i', 'gli', 'le'];
export const INDEFINITE_FORMS = ['un', 'uno', 'una', "un'"];

/** Preposition + definite article. Columns follow DEFINITE_FORMS. */
export const CONTRACTIONS = {
  a: ['al', 'allo', "all'", 'alla', 'ai', 'agli', 'alle'],
  da: ['dal', 'dallo', "dall'", 'dalla', 'dai', 'dagli', 'dalle'],
  di: ['del', 'dello', "dell'", 'della', 'dei', 'degli', 'delle'],
  in: ['nel', 'nello', "nell'", 'nella', 'nei', 'negli', 'nelle'],
  su: ['sul', 'sullo', "sull'", 'sulla', 'sui', 'sugli', 'sulle'],
};

// Adjectives with 4 distinct forms: masc sg, fem sg, masc pl, fem pl. (-e adjectives are covered by hand-written items.)
export const ADJECTIVES = [
  { forms: ['nuovo', 'nuova', 'nuovi', 'nuove'], for: ['thing'] },
  { forms: ['piccolo', 'piccola', 'piccoli', 'piccole'], for: ['thing'] },
  { forms: ['bianco', 'bianca', 'bianchi', 'bianche'], for: ['thing'] },
  { forms: ['lungo', 'lunga', 'lunghi', 'lunghe'], for: ['thing'] },
  { forms: ['vecchio', 'vecchia', 'vecchi', 'vecchie'], for: ['thing'] },
  { forms: ['caro', 'cara', 'cari', 'care'], for: ['thing'] },
  { forms: ['costoso', 'costosa', 'costosi', 'costose'], for: ['thing'] },
  { forms: ['alto', 'alta', 'alti', 'alte'], for: ['person'] },
  { forms: ['simpatico', 'simpatica', 'simpatici', 'simpatiche'], for: ['person'] },
  { forms: ['ricco', 'ricca', 'ricchi', 'ricche'], for: ['person'] },
  { forms: ['stanco', 'stanca', 'stanchi', 'stanche'], for: ['person'] },
  { forms: ['italiano', 'italiana', 'italiani', 'italiane'], for: ['person'] },
  { forms: ['turco', 'turca', 'turchi', 'turche'], for: ['person'] },
  { forms: ['biondo', 'bionda', 'biondi', 'bionde'], for: ['person'] },
];
