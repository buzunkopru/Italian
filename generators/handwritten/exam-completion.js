// Exam-style sentence completion (YDS section 4): half a sentence, five ways to finish it.
// [level, prompt, answer, [4 wrong], explanation]. The blank is the missing half (end OR start of the sentence).
// Exactly ONE option may be correct in BOTH grammar (mood/tense/agreement) and logic (the meaning the sentence sets up).
// Distractors share the answer's shape, so the choice rests on tense/mood or on meaning, not on length.

const HYPOTHESES = [
  [3, 'Se avessi più tempo, ----.', 'studierei di più', ['studio di più', 'studierò di più', 'ho studiato di più', 'studiassi di più'], 'Se + imperfetto congiuntivo (avessi) → condizionale presente in the main clause: studierei.'],
  [3, 'Se domani piove, ----.', 'resteremo a casa', ['resteremmo a casa', 'saremmo rimasti a casa', 'restassimo a casa', 'eravamo rimasti a casa'], 'A real possibility (se + presente) → future or present in the main clause.'],
  [4, 'Se avessi saputo la verità, ----.', 'non avrei accettato', ['non accettassi', 'non ho accettato', 'non accetterò', 'non accetto'], 'Se + trapassato congiuntivo (avessi saputo) → condizionale passato: non avrei accettato.'],
  [3, 'Se fossi in te, ----.', 'ci penserei bene', ['ci pensassi bene', 'ci penserò bene', 'ci ho pensato bene', 'ci pensi bene'], 'Se + imperfetto congiuntivo → condizionale presente.'],
  [3, '----, andrei al mare.', 'Se avessi le ferie', ['Se ho le ferie', 'Se avrei le ferie', 'Se ebbi le ferie', 'Se avrò le ferie'], '"andrei" (condizionale) needs se + imperfetto congiuntivo. Never "se" + condizionale.'],
  [3, '----, andremo al mare.', 'Se domani fa bel tempo', ['Se domani facesse bel tempo', 'Benché domani fa bel tempo', 'Poiché domani faccia bel tempo', 'A meno che domani fa bel tempo'], '"andremo" (futuro) pairs with se + presente indicativo.'],
  [4, '----, uscirei volentieri.', 'Se non piovesse', ['Se non piove', 'Se non pioverà', 'Se non sia piovuto', 'Se non piovve'], '"uscirei" (condizionale) → se + imperfetto congiuntivo: se non piovesse.'],
  [4, '----, avrei comprato quella casa.', 'Se avessi avuto più soldi', ['Se avessi più soldi', 'Se ho avuto più soldi', 'Se avrei avuto più soldi', 'Se avrò più soldi'], '"avrei comprato" (condizionale passato) → se + trapassato congiuntivo: se avessi avuto.'],
];

const SUBJUNCTIVE = [
  [4, 'Benché sia stanco, ----.', 'continua a lavorare', ['continui a lavorare', 'continuasse a lavorare', 'continuava a lavorare', 'continuando a lavorare'], 'Benché takes the subjunctive in its OWN clause (sia); the main clause stays in the indicative.'],
  [4, 'Affinché tutti capiscano, ----.', 'il professore parlerà lentamente', ['il professore parlasse lentamente', 'il professore parli lentamente', 'il professore parlò lentamente', 'il professore parlando lentamente'], 'Affinché + congiuntivo goes in the subordinate clause only; the main clause is an ordinary indicative (parlerà).'],
  [4, 'Prima che il film cominci, ----.', 'spegniamo i telefoni', ['spegnevamo i telefoni', 'spegnessimo i telefoni', 'avremmo spento i telefoni', 'spegnere i telefoni'], 'The subordinate clause is subjunctive; the main clause is a plain indicative in the present.'],
  [4, 'A meno che non piova, ----.', 'faremo la gita', ['abbiamo fatto la gita', 'facessimo la gita', 'avremmo fatto la gita', 'fare la gita'], 'A meno che non + congiuntivo is about the future, so the main clause is a future: faremo.'],
  [3, 'È necessario che tu ----.', 'venga subito', ['vieni subito', 'verrai subito', 'verresti subito', 'venivi subito'], '"È necessario che" requires the congiuntivo presente: venga.'],
  [3, 'Voglio che i miei figli ----.', 'studino all\'estero', ['studiano all\'estero', 'studieranno all\'estero', 'studierebbero all\'estero', 'studiare all\'estero'], '"Volere che" + congiuntivo: studino.'],
  [4, 'Purché tu ----, ti aiuterò.', 'faccia la tua parte', ['fai la tua parte', 'farai la tua parte', 'faresti la tua parte', 'facendo la tua parte'], 'Purché (provided that) always takes the congiuntivo: faccia.'],
  [4, 'Sebbene fosse tardi, ----.', 'siamo rimasti ancora un po\'', ['rimaniamo ancora un po\'', 'rimarremmo ancora un po\'', 'rimanessimo ancora un po\'', 'rimarremo ancora un po\''], 'Sebbene fosse tardi is a past concession; the main clause is a past indicative (passato prossimo).'],
];

const LOGIC = [
  [3, 'Il traffico era così intenso che ----.', 'siamo arrivati in ritardo', ['siamo arrivati in anticipo', 'abbiamo guidato più veloce del solito', 'eravamo molto contenti', 'il viaggio è stato rapidissimo'], 'così… che introduces a consequence; heavy traffic leads to delay.'],
  [3, 'Poiché non aveva studiato, ----.', 'non ha superato l\'esame', ['ha superato l\'esame con il massimo dei voti', 'ha preso un voto altissimo', 'ha vinto una borsa di studio', 'tutti l\'hanno lodato'], 'poiché = since/because: not having studied explains failing the exam.'],
  [3, 'Dato che il treno è in ritardo, ----.', 'dobbiamo aspettare', ['siamo già arrivati', 'abbiamo già mangiato', 'il biglietto costa meno', 'siamo partiti in anticipo'], 'dato che = given that: a late train means we have to wait.'],
  [3, 'Era talmente stanco che ----.', 'si è addormentato subito', ['ha ballato fino all\'alba', 'aveva molta energia', 'non vedeva l\'ora di correre', 'ha lavorato tutta la notte'], 'talmente… che = so… that: tiredness leads to falling asleep.'],
  [3, 'Marco studia molto, mentre suo fratello ----.', 'passa il tempo a giocare', ['studia con altrettanto impegno', 'prepara anche lui gli esami', 'legge molti libri di scuola', 'fa i compiti ogni giorno'], 'mentre = whereas: the second half must contrast with "studia molto".'],
  [4, 'Nonostante la pioggia, ----.', 'la partita si è giocata', ['la partita è stata sospesa per la pioggia', 'gli spettatori sono rimasti a casa', 'il campo era troppo bagnato per giocare', 'è stato impossibile giocare'], 'nonostante = despite: the main clause must go against the rain; the other four are consequences of rain.'],
  [3, 'Grazie al suo aiuto, ----.', 'ho superato l\'esame', ['ho fallito l\'esame', 'non ho capito niente', 'ho perso il lavoro', 'tutto è peggiorato'], 'grazie a = thanks to: a positive result follows.'],
  [3, 'A causa del ritardo, ----.', 'abbiamo perso la coincidenza', ['abbiamo guadagnato tempo', 'siamo arrivati in anticipo', 'ci siamo riposati molto', 'abbiamo ricevuto un premio'], 'a causa di = because of: a negative cause leads to a negative result.'],
  [4, 'Invece di studiare, ----.', 'è andato al cinema', ['ha ripassato la lezione', 'ha preso appunti', 'ha studiato tutta la notte', 'ha finito i compiti'], 'invece di = instead of: the main clause must be something other than studying.'],
  [4, 'Senza aver letto il testo, ----.', 'non ha potuto rispondere', ['ha capito ogni dettaglio', 'ha scritto un riassunto perfetto', 'ha citato molte frasi', 'ha commentato ogni capitolo'], 'senza aver + participle = without having…: the result is the inability to answer.'],
  [4, 'Pur essendo giovane, ----.', 'ha molta esperienza', ['ha poca esperienza', 'non sa niente', 'è ancora inesperto', 'ha ancora molto da imparare'], 'pur + gerund = although: the main clause must contrast with youth.'],
  [3, 'Dato che non c\'erano posti liberi, ----.', 'abbiamo prenotato per il giorno dopo', ['ci siamo seduti subito', 'abbiamo scelto il miglior tavolo', 'il ristorante era vuoto', 'abbiamo mangiato subito'], 'No free tables → we could not sit and had to book for another day.'],
  [4, 'Nonostante fosse malato, ----.', 'è andato al lavoro', ['è rimasto a letto', 'ha chiamato il medico', 'ha preso un giorno di riposo', 'ha cancellato tutti gli impegni'], 'nonostante = despite: he did the opposite of what illness suggests.'],
  [3, 'Il governo ha ridotto le tasse, ----.', 'perciò i cittadini hanno più soldi', ['perciò i cittadini hanno meno soldi', 'perciò le scuole sono chiuse', 'perciò il clima è cambiato', 'perciò i prezzi sono raddoppiati'], 'perciò = therefore: lower taxes leave citizens with more money.'],
  [3, '----, non ho potuto partecipare alla riunione.', 'Poiché ero malato', ['Sebbene ero malato', 'Affinché fossi malato', 'Purché fossi malato', 'Anche se fossi malato'], 'A real reason: poiché + indicativo. The other conjunctions give the wrong mood or the wrong logic.'],
  [3, 'Quando ero piccolo, ----.', 'andavo spesso al mare', ['andrò spesso al mare', 'vado spesso al mare', 'andassi spesso al mare', 'andrei spesso al mare'], 'Past habit → imperfetto: andavo.'],
  [3, 'Appena arrivato a Roma, ----.', 'ho telefonato a mia madre', ['telefonerei a mia madre', 'telefonassi a mia madre', 'telefonando a mia madre', 'telefonato a mia madre'], 'A past action → passato prossimo: ho telefonato.'],
  [4, 'Finché non avrai finito i compiti, ----.', 'non uscirai', ['non sei uscito', 'non uscivi', 'non usciresti', 'non uscissi'], 'finché non + futuro anteriore (avrai finito) → future in the main clause.'],
];

const PATTERNS = [
  [3, 'Più studio, ----.', 'più imparo', ['meno imparo', 'tanto imparo', 'imparo più che', 'più imparerei'], 'più… più… = the more… the more…'],
  [4, 'Quanto più leggi, ----.', 'tanto più impari', ['tanto meno impari', 'così più impari', 'quanto più impari', 'più tanto impari'], 'quanto più… tanto più… = the more… the more…'],
  [3, 'Il libro è stato scritto ----.', 'da un autore sconosciuto', ['di un autore sconosciuto', 'a un autore sconosciuto', 'per un autore sconosciuto', 'con un autore sconosciuto'], 'The agent of a passive verb takes da.'],
  [3, 'In Italia si ----.', 'mangia molta pasta', ['mangiano molta pasta', 'si mangiano molta pasta', 'è mangiato molta pasta', 'mangiamo molta pasta'], 'si impersonale/passivante + singular noun (pasta) → third person singular: mangia.'],
  [3, 'Chi vuole superare l\'esame ----.', 'deve studiare ogni giorno', ['devono studiare ogni giorno', 'dovete studiare ogni giorno', 'dobbiamo studiare ogni giorno', 'devi studiare ogni giorno'], '"Chi" takes a third person singular verb.'],
  [4, 'Non appena ----, ti telefono.', 'arrivo a casa', ['arrivassi a casa', 'sono arrivato a casa ieri', 'arriverei a casa', 'arrivare a casa'], 'non appena + presente when the action is in the near future, with a present main clause.'],
  [4, 'Ho cercato le chiavi dappertutto, ----.', 'ma non le ho trovate', ['ma non l\'ho trovato', 'ma non le trovassi', 'e le troverei', 'perché le ho trovate'], 'Direct object pronoun agrees with "chiavi": le … trovate.'],
  [3, 'Mi piacerebbe viaggiare di più, ----.', 'ma non ho abbastanza soldi', ['perciò ho molti soldi', 'quindi parto domani', 'infatti ho già viaggiato molto', 'così non voglio partire'], 'The sentence expresses a wish; ma introduces the obstacle.'],
  [4, 'Per quanto ----, non riesco a capire.', 'mi sforzi', ['mi sforzo', 'mi sforzerò', 'mi sforzerei', 'mi sforzavo'], 'per quanto + congiuntivo = however much: mi sforzi.'],
  [4, 'Qualunque cosa ----, resterò con te.', 'accada', ['accade', 'accadrà', 'accadrebbe', 'accadendo'], 'Qualunque cosa + congiuntivo: accada.'],
  [4, 'Chiunque ----, non aprire la porta.', 'bussi', ['bussa', 'busserà', 'busserebbe', 'bussando'], 'Chiunque + congiuntivo: bussi.'],
];

export const EXAM_COMPLETION = [...HYPOTHESES, ...SUBJUNCTIVE, ...LOGIC, ...PATTERNS];
