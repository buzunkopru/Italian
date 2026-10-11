// Exam-style "vocabulary in context" items (YDS section 1): one sentence, one blank, five words.
// [level, prompt, answer, [4 wrong], explanation]. Exactly ONE option may fit the sentence.
// Rule of thumb for writing them: all five options share the same form (all past participles, all -e adjectives,
// all masculine singular nouns...), so grammar never gives the answer away; only meaning and collocation do.

const VERBS = [
  [3, "Il governo ha deciso di ---- nuove misure per ridurre l'inflazione.", 'adottare', ['sopportare', 'smentire', 'ospitare', 'ereditare'], 'adottare misure = to adopt measures. sopportare = to endure, smentire = to deny, ospitare = to host, ereditare = to inherit.'],
  [3, 'Gli archeologi hanno ---- i resti di un antico tempio sotto la piazza.', 'scoperto', ['inventato', 'prodotto', 'vietato', 'sospeso'], 'scoprire = to discover (something that already existed). inventare is for something new that did not exist.'],
  [3, 'Chi fuma nei locali pubblici viene multato, perché la legge lo ----.', 'vieta', ['consente', 'permette', 'promuove', 'incoraggia'], 'vietare = to forbid. A fine only makes sense if the law forbids it; the other four verbs say the opposite.'],
  [3, 'La ricerca ---- che il consumo di zucchero è aumentato negli ultimi dieci anni.', 'dimostra', ['ostacola', 'sopporta', 'impedisce', 'evita'], 'dimostrare che = to show/prove that. The other verbs cannot introduce a che-clause of this kind.'],
  [3, 'Il medico ha ---- al paziente di riposare per due settimane.', 'consigliato', ['accusato', 'obbedito', 'smentito', 'salutato'], 'consigliare a qualcuno di + infinitive = to advise someone to do something.'],
  [3, "L'azienda ha ---- molti dipendenti a causa della crisi economica.", 'licenziato', ['premiato', 'ringraziato', 'ospitato', 'applaudito'], 'licenziare = to dismiss/fire. A crisis leads to dismissals, not rewards.'],
  [3, "È importante ---- le fonti prima di pubblicare un articolo.", 'verificare', ['ostacolare', 'sorpassare', 'scambiare', 'bruciare'], 'verificare = to check/verify.'],
  [3, 'Il sindaco ha ---- la costruzione di un nuovo ponte sul fiume.', 'approvato', ['smarrito', 'spedito', 'indossato', 'cucinato'], 'approvare = to approve.'],
  [3, 'Il progetto è stato ---- per mancanza di fondi.', 'sospeso', ['ricordato', 'cantato', 'lavato', 'bevuto'], 'sospendere = to suspend. A project without money is suspended.'],
  [3, 'Le temperature ---- ogni anno a causa del riscaldamento globale.', 'aumentano', ['firmano', 'ereditano', 'cantano', 'nascono'], 'aumentare = to increase; its subject can be temperatures (a quantity).'],
  [4, 'Gli studiosi ---- che la teoria non spiega tutti i fenomeni osservati.', 'sostengono', ['ritardano', 'toccano', 'vestono', 'prestano'], 'sostenere che = to maintain/argue that (academic).'],
  [4, "Il documento ---- l'importanza di una maggiore collaborazione tra i paesi.", 'sottolinea', ['nasconde', 'sopprime', 'sfrutta', 'sostituisce'], 'sottolineare = to underline/stress.'],
  [4, "Un'alimentazione sana ---- il rischio di molte malattie.", 'riduce', ['costruisce', 'produce', 'esige', 'attacca'], 'ridurre il rischio = to lower the risk.'],
  [4, 'La nuova strada ---- il collegamento tra i due villaggi.', 'facilita', ['complica', 'ostacola', 'annulla', 'viola'], 'facilitare = to make easier. A new road eases a link; the other verbs are negative.'],
  [4, 'Il trattato ---- lo scambio di merci senza dazi tra i firmatari.', 'consente', ['rifiuta', 'esclude', 'proibisce', 'ritarda'], 'consentire = to allow/enable. A trade treaty exists to allow exchange; the other verbs are negative.'],
  [4, 'Il crollo dei prezzi ha ---- molte imprese a chiudere.', 'costretto', ['ringraziato', 'salutato', 'visitato', 'aspettato'], 'costringere a + infinitive = to force someone to.'],
  [4, "Il tribunale ha ---- l'imputato dall'accusa di frode.", 'assolto', ['condotto', 'visitato', 'ripreso', 'recitato'], "assolvere da = to acquit of. Only this verb goes with \"dall'accusa\"."],
  [4, 'I dati dei due studi non ----: il primo indica un aumento, il secondo un calo.', 'coincidono', ['sorgono', 'consistono', 'abitano', 'nascono'], 'coincidere = to coincide/match.'],
  [4, "L'esito dell'esperimento ---- molto dalle condizioni iniziali.", 'dipende', ['consiste', 'coincide', 'comporta', 'appartiene'], 'dipendere da = to depend on.'],
  [4, 'La nuova tecnologia ---- grandi cambiamenti nel mondo del lavoro.', 'comporta', ['consiste', 'dipende', 'coincide', 'appartiene'], 'comportare = to entail/bring about. The others need a preposition (in, da, con, a).'],
  [4, 'Il ricercatore ha ---- un questionario a duecento studenti.', 'somministrato', ['attestato', 'sfuggito', 'consolidato', 'adempiuto'], 'somministrare un questionario = to administer a questionnaire (set phrase in research).'],
  [4, 'I manifestanti hanno ---- la strada per protesta contro la riforma.', 'bloccato', ['trascurato', 'ereditato', 'rassicurato', 'tradotto'], 'bloccare = to block.'],
  [4, 'Il testo ---- tre parti: introduzione, sviluppo e conclusione.', 'comprende', ['evita', 'ignora', 'espelle', 'smentisce'], 'comprendere = to include/comprise. Its subject is the whole, the object its parts.'],
  [3, 'Il professore ci ha ---- gli appunti del corso.', 'riassunto', ['sposato', 'suonato', 'bevuto', 'nuotato'], 'riassumere = to summarize.'],
  [4, "Molti studenti non ---- a finire l'esame nel tempo previsto.", 'riescono', ['tentano', 'decidono', 'sperano', 'sembrano'], 'riuscire a + infinitive = to manage to. The others take different constructions (tentare di, decidere di, sperare di).'],
];

const ADJECTIVES = [
  [3, 'Il contratto è ----: scade tra sei mesi.', 'temporaneo', ['permanente', 'duraturo', 'stabile', 'costante'], 'temporaneo = temporary. "scade tra sei mesi" excludes permanente/duraturo/stabile.'],
  [3, 'Il traffico è un problema ---- in tutte le grandi città del mondo.', 'comune', ['raro', 'invisibile', 'vuoto', 'giovane'], 'comune = common / shared by all.'],
  [3, 'Questa scoperta è ---- per il futuro della medicina.', 'fondamentale', ['gentile', 'veloce', 'dolce', 'felice'], 'fondamentale = fundamental.'],
  [3, 'La situazione economica del paese è ----: ci sono troppi disoccupati.', 'grave', ['felice', 'gentile', 'dolce', 'veloce'], 'grave = serious.'],
  [3, 'Dopo la lunga malattia il paziente era molto ----.', 'debole', ['ricco', 'alto', 'vasto', 'pubblico'], 'debole = weak.'],
  [3, 'Il ritmo della crescita è rimasto ---- negli ultimi tre anni.', 'costante', ['urgente', 'dolce', 'artificiale', 'giovane'], 'costante = steady. "rimasto" means it did not change.'],
  [4, 'Le informazioni raccolte non sono ---- per rispondere alla domanda.', 'sufficienti', ['simpatici', 'forti', 'visibili', 'pubblici'], 'sufficiente = enough. The others make no sense with "per rispondere alla domanda".'],
  [3, 'Questa regola vale per tutti, senza eccezioni: è ----.', 'generale', ['particolare', 'locale', 'speciale', 'individuale'], 'generale = general. "senza eccezioni" excludes the others.'],
  [4, "L'esperto ha dato una risposta molto ----: nessuno ha capito nulla.", 'vaga', ['precisa', 'chiara', 'esatta', 'corretta'], 'vago = vague. The result "nessuno ha capito" excludes precisa/chiara/esatta/corretta.'],
  [4, 'Le piogge ---- hanno causato gravi danni ai raccolti.', 'intense', ['dolci', 'pubbliche', 'fragili', 'sicure'], 'intenso = heavy/intense. "gravi danni" fits intense rain.'],
  [4, 'Non si può accettare una spiegazione così ----: bisogna verificare i dati.', 'superficiale', ['approfondita', 'completa', 'rigorosa', 'dettagliata'], 'superficiale = superficial. "bisogna verificare" shows the explanation is weak.'],
  [4, 'Il risultato è stato ----: nessuno se lo aspettava.', 'sorprendente', ['prevedibile', 'ovvio', 'atteso', 'normale'], 'sorprendente = surprising. "nessuno se lo aspettava" excludes the others.'],
  [4, 'Il sindacato ha chiesto un intervento ---- per salvare i posti di lavoro.', 'immediato', ['lento', 'tardivo', 'rinviato', 'futuro'], 'immediato = immediate. To "save jobs" action must be quick.'],
  [4, 'Il suo comportamento è ---- con i valori che dice di difendere.', 'incoerente', ['coerente', 'fedele', 'conforme', 'adatto'], 'incoerente = inconsistent. "che dice di difendere" suggests a contradiction.'],
  [4, "Con un'analisi ---- dei dati, i ricercatori hanno trovato diversi errori.", 'accurata', ['sbadata', 'leggera', 'distratta', 'incerta'], 'accurato = careful, thorough. Finding several errors implies a careful analysis.'],
  [4, 'Il sistema è ----: basta un errore per bloccare tutto.', 'fragile', ['robusto', 'solido', 'stabile', 'resistente'], 'fragile = fragile. "basta un errore per bloccare tutto" excludes the others.'],
];

const NOUNS = [
  [3, "L'inquinamento è una grave ---- per la salute dei cittadini.", 'minaccia', ['notte', 'scuola', 'sedia', 'pianta'], 'minaccia = threat.'],
  [3, 'Il ---- tra i due paesi è stato firmato ieri a Roma.', 'accordo', ['conflitto', 'declino', 'pericolo', 'rischio'], 'accordo = agreement; you sign an agreement, not a conflict.'],
  [3, 'Il forte ---- dei prezzi ha reso la vita difficile a molte famiglie.', 'aumento', ['declino', 'silenzio', 'talento', 'museo'], 'aumento = increase. A rise in prices makes life hard.'],
  [3, 'Lo scienziato ha presentato i ---- della ricerca durante il convegno.', 'risultati', ['alberi', 'letti', 'castelli', 'ponti'], 'i risultati = the results.'],
  [4, 'La vera ---- della malattia è ancora sconosciuta.', 'causa', ['occasione', 'tappa', 'merce', 'volta'], 'causa = cause; "sconosciuta" fits the cause of an illness.'],
  [4, 'Dopo anni di lavoro, il progetto ha finalmente raggiunto il suo ----.', 'obiettivo', ['sintomo', 'ostacolo', 'disegno', 'rumore'], 'raggiungere un obiettivo = to reach a goal.'],
  [4, 'La ---- tra ricchi e poveri è cresciuta negli ultimi anni.', 'disuguaglianza', ['somiglianza', 'solidarietà', 'cortesia', 'fiducia'], 'disuguaglianza = inequality; the others are positive or unrelated.'],
  [3, 'Per entrare nel laboratorio servono una ---- speciale e un documento.', 'autorizzazione', ['stazione', 'poesia', 'collina', 'sorella'], 'autorizzazione = authorization/permit.'],
  [4, 'Una ---- di studi conferma questo effetto: sono più di trenta.', 'serie', ['casa', 'fine', 'storia', 'luce'], 'una serie di = a series of / a number of.'],
  [4, "Il medico ha chiesto di ripetere l'---- dopo due settimane.", 'esame', ['arte', 'ombra', 'isola', 'estate'], 'esame = test (medical).'],
  [4, 'I ricercatori hanno trovato una ---- tra il fumo e certe malattie.', 'correlazione', ['mancanza', 'intenzione', 'apertura', 'sostituzione'], 'correlazione tra A e B = correlation between A and B.'],
  [4, "Il dibattito sul ---- dell'università è ancora aperto.", 'ruolo', ['sole', 'pane', 'mare', 'vento'], 'il ruolo = the role.'],
  [3, 'Il ---- tra i due partiti si è chiuso con una stretta di mano.', 'confronto', ['pericolo', 'mercato', 'oceano', 'fuoco'], 'confronto = comparison / discussion.'],
];

const PHRASES = [
  [3, "L'articolo ---- riferimento a uno studio pubblicato nel 2019.", 'fa', ['dà', 'ha', 'prende', 'mette'], 'fare riferimento a = to refer to.'],
  [3, 'Bisogna ---- conto di tutti i fattori prima di decidere.', 'tenere', ['mettere', 'prendere', 'portare', 'andare'], 'tenere conto di = to take into account.'],
  [3, 'I risultati hanno ---- in discussione le teorie precedenti.', 'messo', ['preso', 'tolto', 'lasciato', 'trovato'], 'mettere in discussione = to call into question.'],
  [3, 'Questo fenomeno non ha niente a che ---- con il clima.', 'fare', ['dire', 'dare', 'stare', 'andare'], 'avere a che fare con = to have to do with.'],
  [3, "Il piano alternativo è stato ---- in considerazione solo alla fine.", 'preso', ['dato', 'perso', 'lasciato', 'fatto'], 'prendere in considerazione = to take into consideration.'],
  [3, 'Le nuove regole entreranno ---- vigore il primo gennaio.', 'in', ['a', 'da', 'per', 'su'], 'entrare in vigore = to come into force.'],
  [4, "L'insegnante ha ---- l'accento sull'importanza della lettura.", 'posto', ['dato', 'preso', 'fatto', 'tolto'], "porre l'accento su = to put the emphasis on."],
  [4, "Nel corso dell'anno, il paese ha ---- una forte crescita economica.", 'registrato', ['dimenticato', 'ospitato', 'perduto', 'salutato'], 'registrare una crescita = to record growth.'],
  [4, 'Il risultato non è ---- alle aspettative: ci aspettavamo molto di più.', 'pari', ['alto', 'lieto', 'dolce', 'basso'], 'essere pari a = to be equal to / match (aspettative).'],
  [4, 'Un numero crescente di giovani ---- parte di associazioni di volontariato.', 'fa', ['va', 'dà', 'sta', 'porta'], 'fare parte di = to be a member of.'],
  [4, 'La riforma è ---- dai sindacati: molti scioperi sono previsti.', 'contestata', ['assolta', 'invitata', 'cantata', 'ospitata'], 'contestare = to challenge/oppose; the expected strikes show opposition.'],
];

const ADVERBS = [
  [4, 'Il ministro ha respinto ---- ogni accusa: "Sono false", ha detto.', 'categoricamente', ['pazientemente', 'dolcemente', 'raramente', 'lentamente'], 'categoricamente = categorically, flatly. Matches the strong denial.'],
  [4, "Il virus si è diffuso ---- in tutto il paese: in una settimana c'erano migliaia di casi.", 'rapidamente', ['lentamente', 'raramente', 'tranquillamente', 'pazientemente'], 'rapidamente = quickly. "in una settimana" shows speed.'],
  [4, 'La proposta ha ricevuto ---- il sostegno di tutti i partiti, senza eccezioni.', 'unanimemente', ['parzialmente', 'raramente', 'tardivamente', 'debolmente'], 'unanimemente = unanimously; "senza eccezioni" fits.'],
  [4, "Si tratta di un fenomeno ---- raro: accade una volta ogni cent'anni.", 'estremamente', ['facilmente', 'forse', 'spesso', 'sempre'], 'estremamente + adjective = extremely.'],
  [4, 'Gli effetti della nuova legge si vedranno ---- tra qualche anno.', 'solo', ['ieri', 'sempre', 'mai', 'troppo'], "solo tra qualche anno = only in a few years' time."],
  [3, 'Non ho ancora letto il rapporto: lo leggerò ----.', 'domani', ['ieri', 'sempre', 'mai', 'ancora'], 'domani = tomorrow; "leggerò" is future, so "ieri" cannot fit.'],
];

export const EXAM_VOCAB = [...VERBS, ...ADJECTIVES, ...NOUNS, ...PHRASES, ...ADVERBS];
