// Exam-style passage cloze (YDS section 3): a short paragraph with five numbered blanks, five options each.
// Each passage turns into one question PER BLANK: the target blank shows as ---- and the other four are filled with
// their correct words, so every question reads as a complete paragraph.
//
// { level, text, blanks }  text has {1}..{5};  blanks[k] = [answer, [4 wrong], explanation].
// Rules: exactly one option fits each blank given the rest of the paragraph; options must not be gradable by
// agreement alone unless the blank is a grammar blank; no factual claims a learner could mistake for fact.

export const EXAM_CLOZE_PASSAGES = [
  {
    level: 2,
    text: `Negli ultimi anni gli smartphone {1} diventati strumenti indispensabili per milioni di persone. {2} permettono di comunicare in pochi secondi, ma offrono anche accesso a una quantità enorme di informazioni. {3}, molti esperti avvertono che un uso eccessivo può creare dipendenza. Alcuni studenti, per esempio, passano {4} ore al giorno davanti allo schermo e dormono poco. Per questo motivo è importante {5} un equilibrio tra vita online e vita reale.`,
    blanks: [
      ['sono', ['hanno', 'siano', 'stanno', 'essendo'], 'Verbs of change like "diventare" take essere: sono diventati.'],
      ['Non solo', ['Benché', 'Perché', 'Quindi', 'Invece'], '"Non solo… ma anche" = not only… but also.'],
      ['Tuttavia', ['Quindi', 'Infatti', 'Cioè', 'Ad esempio'], 'After the benefits comes a warning, so we need a contrast: tuttavia = however.'],
      ['molte', ['molti', 'molto', 'molta', 'tanto'], '"ore" is feminine plural → molte.'],
      ['trovare', ['trova', 'trovato', 'trovando', 'trovi'], '"È importante" + infinitive.'],
    ],
  },
  {
    level: 3,
    text: `Il cambiamento climatico è uno dei problemi più gravi {1} l'umanità debba affrontare. Secondo gli scienziati, la temperatura media del pianeta {2} di circa un grado dall'inizio del secolo scorso. {3} i governi abbiano firmato molti accordi, le emissioni di gas serra continuano a crescere. Per questo molti ricercatori sostengono che sia necessario {4} subito. Se non si agirà in fretta, le conseguenze {5} sempre più difficili da controllare.`,
    blanks: [
      ['che', ['cui', 'quale', 'dove', 'quanto'], 'Direct-object relative pronoun → che.'],
      ['è aumentata', ['aumentava', 'aumenterà', 'era aumentata', 'aumentò'], 'A change that started in the past and still matters now → passato prossimo.'],
      ['Benché', ['Poiché', 'Quindi', 'Mentre', 'Dunque'], 'The subjunctive "abbiano firmato" signals a concession: benché = although.'],
      ['intervenire', ['intervenga', 'intervenuto', 'interviene', 'intervenendo'], '"sia necessario" + infinitive (no "che" here).'],
      ['diventeranno', ['diventerà', 'diventino', 'diventavano', 'diventando'], 'The "se" clause is future (si agirà), so the result is future too; plural subject → diventeranno.'],
    ],
  },
  {
    level: 3,
    text: `Molti giovani italiani scelgono di studiare all'estero {1} migliorare le proprie competenze linguistiche. Il programma Erasmus, {2} è stato creato nel 1987, offre agli studenti la possibilità di frequentare un semestre in un'altra università europea. {3} questa esperienza, molti studenti imparano a vivere da soli e a {4} con persone di culture diverse. {5}, non tutti possono permettersela, perché i costi di un soggiorno all'estero rimangono elevati.`,
    blanks: [
      ['per', ['di', 'a', 'da', 'con'], 'Purpose before an infinitive → per.'],
      ['che', ['cui', 'dove', 'quanto', 'chi'], 'Subject of "è stato creato" → che.'],
      ['Grazie a', ['Nonostante', 'Invece di', 'Prima di', 'Senza'], 'A positive result follows: grazie a = thanks to.'],
      ['collaborare', ['collaborano', 'collaborato', 'collaborando', 'collaborerà'], '"imparano a" + infinitive.'],
      ['Tuttavia', ['Quindi', 'Infatti', 'Perciò', 'Dunque'], 'The sentence limits the benefit, so it contrasts with the previous one: tuttavia.'],
    ],
  },
  {
    level: 2,
    text: `Fare attività fisica regolare fa bene {1} salute. Gli esperti consigliano di camminare almeno trenta minuti {2} giorno. {3} una vita sedentaria aumenta il rischio di molte malattie, come il diabete e le malattie del cuore. Chi lavora molto seduto {4} fare brevi pause ogni ora. Chi si muove regolarmente {5} meglio, ha più energia e dorme meglio.`,
    blanks: [
      ['alla', ['la', 'della', 'nella', 'sulla'], '"fare bene a" + la salute → alla.'],
      ['al', ['il', 'del', 'nel', 'sul'], '"al giorno" = per day.'],
      ['Infatti', ['Invece', 'Tuttavia', 'Quindi', 'Ovvero'], 'The sentence gives the reason for the advice: infatti = in fact.'],
      ['dovrebbe', ['dovrebbero', 'dovere', 'dovuto', 'dovendo'], 'Singular subject "Chi" → dovrebbe (advice).'],
      ['si sente', ['sente', 'si sentono', 'si sentiva', 'si sentirebbe'], '"sentirsi meglio" = to feel better; "Chi" takes a singular verb.'],
    ],
  },
  {
    level: 3,
    text: `Negli ultimi decenni il mercato del lavoro è cambiato profondamente. Molte professioni tradizionali {1} scomparse, mentre ne sono nate di nuove, legate soprattutto alla tecnologia. {2} chi ha una formazione adeguata trova facilmente un impiego, i lavoratori meno qualificati rischiano di restare senza occupazione. {3} molte aziende investono nella formazione dei propri dipendenti. Si tratta di una scelta {4} conviene a tutti: i lavoratori acquisiscono nuove competenze e l'azienda ne trae vantaggio. {5}, il futuro del lavoro dipenderà dalla capacità di adattarsi.`,
    blanks: [
      ['sono', ['hanno', 'siano', 'stanno', 'essendo'], '"scomparire" takes essere: sono scomparse.'],
      ['Mentre', ['Perché', 'Siccome', 'Affinché', 'Quindi'], 'Two groups are contrasted: mentre = whereas.'],
      ['Per questo motivo', ['Tuttavia', 'Al contrario', 'Eppure', 'Anzi'], 'The investment is the consequence of the risk: per questo motivo = for this reason.'],
      ['che', ['cui', 'quale', 'dove', 'quanto'], 'Subject of "conviene" → che.'],
      ['In conclusione', ['Per esempio', 'Al contrario', 'Intanto', 'Tuttavia'], 'The last sentence sums up the paragraph.'],
    ],
  },
  {
    level: 4,
    text: `La ricerca scientifica richiede tempo, risorse e, {1}, rigore. Un risultato non può essere considerato valido {2} è stato verificato da altri ricercatori. Per questo motivo le riviste scientifiche pubblicano solo gli studi {3} sono stati esaminati da esperti indipendenti. {4} casi in cui dati errati sono stati pubblicati per negligenza o, peggio, per frode. In situazioni {5}, la fiducia del pubblico nella scienza ne risente.`,
    blanks: [
      ['soprattutto', ['raramente', 'appena', 'altrimenti', 'poiché'], '"soprattutto" = above all, singling out the last item of the list.'],
      ['finché non', ['purché', 'benché', 'affinché', 'siccome'], '"non… finché non" = not… until: valid only after it has been verified.'],
      ['che', ['cui', 'quali', 'dove', 'quanto'], 'Subject of "sono stati esaminati" → che.'],
      ['Non mancano', ['Non manca', 'Non mancare', 'Non mancato', 'Non mancando'], '"casi" is plural → mancano.'],
      ['simili', ['simile', 'similmente', 'similitudine', 'simulare'], 'Plural adjective agreeing with "situazioni".'],
    ],
  },
  {
    level: 4,
    text: `Il turismo rappresenta una risorsa fondamentale per l'economia italiana. {1} generi occupazione e porti ricchezza, esso può avere effetti negativi sull'ambiente e sulla vita dei residenti. {2} dei flussi turistici, alcune città storiche rischiano di perdere la propria identità. Per questo molti sindaci hanno {3} limitare l'accesso ai centri storici. Queste misure, {4}, non sono sempre sufficienti. {5} un turismo più sostenibile, bisognerebbe distribuire meglio i visitatori nell'arco dell'anno.`,
    blanks: [
      ['Sebbene', ['Poiché', 'Dato che', 'Siccome', 'Quindi'], 'The subjunctive "generi/porti" requires a concessive conjunction: sebbene = although.'],
      ['A causa', ['Grazie', 'Invece', 'Durante', 'Dopo'], '"A causa di" + noun: a causa dei flussi turistici = because of the tourist flows.'],
      ['deciso di', ['deciso che', 'deciso per', 'deciso da', 'deciso con'], '"decidere di" + infinitive.'],
      ['tuttavia', ['quindi', 'cioè', 'infatti', 'pertanto'], 'The measures help but are not enough: tuttavia = however.'],
      ['Per promuovere', ['Di promuovere', 'A promuovere', 'Da promuovere', 'Che promuovere'], 'Purpose → per + infinitive.'],
    ],
  },
  {
    level: 2,
    text: `Roma {1} una delle città più visitate del mondo. Ogni anno milioni di turisti arrivano {2} ammirare i suoi monumenti. Molti di loro restano in città {3} tre giorni e riescono a vedere solo una parte di quello che offre. Chi vuole conoscerla davvero {4} passare almeno una settimana. {5} il traffico e i prezzi alti, vale sempre la pena di visitarla.`,
    blanks: [
      ['è', ['ha', 'fa', 'sta', 'va'], '"essere una delle città…" = to be one of the cities…'],
      ['per', ['senza', 'dopo', 'prima', 'invece'], 'Purpose: per + infinitive.'],
      ['per', ['da', 'fa', 'tra', 'dopo'], '"per tre giorni" = for three days (a completed period).'],
      ['dovrebbe', ['dovrebbero', 'dovere', 'dovuto', 'dovendo'], '"Chi" is singular; "dovrebbe" gives advice.'],
      ['Nonostante', ['Perché', 'Siccome', 'Affinché', 'Dunque'], '"Nonostante" + noun = despite.'],
    ],
  },
  {
    level: 3,
    text: `Con la diffusione di internet, il modo di leggere le notizie è cambiato. Un tempo la maggior parte delle persone {1} il giornale ogni mattina; oggi, invece, molti si informano sui social network. Questo cambiamento {2} vantaggi e svantaggi. Da un lato le notizie arrivano {3}; dall'altro è più difficile capire quali fonti siano affidabili. Molti utenti condividono articoli {4} averli letti. Sarebbe utile {5} gli studenti a riconoscere le informazioni false.`,
    blanks: [
      ['comprava', ['comprerà', 'comprando', 'comprato', 'comprasse'], '"Un tempo" + habit in the past → imperfetto.'],
      ['ha', ['hanno', 'abbia', 'avrebbero', 'avere'], 'Singular subject "cambiamento" → ha.'],
      ['subito', ['mai', 'poco', 'quasi', 'meno'], 'The "advantage" side: news arrives immediately.'],
      ['senza', ['mentre', 'perché', 'invece', 'siccome'], '"senza + infinitive" = without having…'],
      ['aiutare', ['aiuta', 'aiutando', 'aiuti', 'aiutato'], '"Sarebbe utile" + infinitive.'],
    ],
  },
  {
    level: 4,
    text: `Il diritto allo studio è garantito dalla Costituzione, {1} nella pratica non tutti possono esercitarlo allo stesso modo. Le differenze economiche tra le famiglie influenzano {2} scelte scolastiche dei figli. {3} lo Stato abbia introdotto borse di studio e agevolazioni, molti giovani abbandonano gli studi prima del diploma. È {4} che le istituzioni intervengano con misure più efficaci, {5} le disuguaglianze rischiano di aumentare.`,
    blanks: [
      ['ma', ['perciò', 'dunque', 'oppure', 'siccome'], 'The sentence turns from principle to practice: ma = but.'],
      ['le', ['la', 'i', 'gli', 'lo'], '"scelte" is feminine plural → le.'],
      ['Nonostante', ['Poiché', 'Siccome', 'Perché', 'Quindi'], 'Subjunctive + a contrast: nonostante = although/despite.'],
      ['necessario', ['necessaria', 'necessari', 'necessità', 'necessariamente'], '"È necessario che" + subjunctive.'],
      ['altrimenti', ['quindi', 'perciò', 'dunque', 'tuttavia'], 'altrimenti = otherwise (the warning if nothing is done).'],
    ],
  },
  {
    level: 2,
    text: `Ieri Marco {1} a Firenze con alcuni amici. Il treno è partito alle otto e i ragazzi {2} arrivati alle dieci. Appena arrivati, hanno visitato il Duomo {3} hanno pranzato in un piccolo ristorante. Nel pomeriggio, però, ha cominciato a piovere e tutti {4} tornare in albergo. La sera erano stanchi, {5} contenti.`,
    blanks: [
      ['è andato', ['ha andato', 'è andata', 'andrà', 'va'], '"andare" takes essere; Marco is masculine → è andato.'],
      ['sono', ['hanno', 'siano', 'stanno', 'sarebbero'], '"arrivare" takes essere: sono arrivati.'],
      ['e', ['ma', 'perché', 'oppure', 'sebbene'], 'Two actions in sequence are joined by e.'],
      ['hanno dovuto', ['devono', 'dovrebbero', 'dovendo', 'dovere'], 'Past event (it started to rain) → passato prossimo.'],
      ['ma', ['quindi', 'perché', 'oppure', 'dunque'], '"stanchi, ma contenti" = tired but happy.'],
    ],
  },
  {
    level: 4,
    text: `Molti critici sostengono che il romanzo realista sia nato {1} bisogno di raccontare la vita quotidiana. Gli autori non si limitavano più a descrivere eroi e re, {2} osservavano con attenzione la gente comune. Il pubblico, {3} fino ad allora leggeva soprattutto poesia e teatro, scoprì così storie vicine alla propria esperienza. È probabile che questo cambiamento {4} contribuito alla diffusione della lettura. Resta {5} da capire quanto abbia pesato il progresso tecnico.`,
    blanks: [
      ['dal', ['al', 'sul', 'col', 'tra'], '"nascere da" = to arise from.'],
      ['ma', ['perché', 'quindi', 'oppure', 'sebbene'], '"non… più… , ma…" = no longer… but…'],
      ['che', ['cui', 'quale', 'dove', 'quanto'], 'Subject of "leggeva" → che.'],
      ['abbia', ['ha', 'avrebbe', 'aveva', 'avendo'], '"È probabile che" + congiuntivo.'],
      ['ancora', ['già', 'mai', 'quasi', 'troppo'], '"Resta ancora da capire" = it remains to be understood.'],
    ],
  },
  {
    level: 4,
    text: `Il lavoro da remoto si è diffuso rapidamente negli ultimi anni. {1} molti dipendenti apprezzino la flessibilità, altri lamentano un senso di isolamento. Le aziende, {2}, devono trovare un equilibrio: da un lato ridurre i costi degli uffici, dall'altro mantenere la coesione dei team. {3} il lavoro da casa non sia adatto a tutte le professioni, esso offre opportunità prima impensabili. Non a caso, molti lavoratori {4} di cambiare città senza cambiare impiego. {5}, resta da valutare l'impatto di lungo periodo sulla produttività.`,
    blanks: [
      ['Benché', ['Poiché', 'Perciò', 'Siccome', 'Dunque'], 'Subjunctive "apprezzino" → benché.'],
      ['invece', ['cioè', 'ossia', 'ovvero', 'difatti'], 'Employees vs companies: invece = on the other hand.'],
      ['Sebbene', ['Perché', 'Siccome', 'Quindi', 'Dunque'], 'Subjunctive "sia" → sebbene.'],
      ['scelgono', ['sceglie', 'scelto', 'scegliendo', 'scegliere'], 'Plural subject "molti lavoratori" → scelgono.'],
      ['Tuttavia', ['Quindi', 'Infatti', 'Dunque', 'Per esempio'], 'After the opportunities comes a reservation: tuttavia.'],
    ],
  },
  {
    level: 3,
    text: `La cucina italiana è famosa in tutto il mondo non solo {1} i suoi sapori, ma anche per la varietà delle ricette regionali. Ogni regione ha piatti tipici {2} riflettono la storia e il clima del territorio. Ad esempio, nel Nord si usa {3} burro che olio d'oliva, mentre nel Sud si mangia più pesce e più verdura. Molti turisti vengono in Italia proprio {4} assaggiare queste specialità. {5} i prodotti tipici costano di più, la maggior parte dei visitatori è disposta a pagarli.`,
    blanks: [
      ['per', ['di', 'con', 'da', 'su'], '"non solo per… ma anche per…" — the same preposition is repeated.'],
      ['che', ['cui', 'dove', 'quale', 'quanto'], 'Subject of "riflettono" → che.'],
      ['più', ['tanto', 'così', 'altrettanto', 'molto'], 'Comparison between two nouns: più… che.'],
      ['per', ['con', 'di', 'da', 'in'], 'Purpose: per + infinitive.'],
      ['Anche se', ['Siccome', 'Perché', 'Quindi', 'Infatti'], 'Concession with the indicative: anche se = even though.'],
    ],
  },
  {
    level: 3,
    text: `L'intelligenza artificiale sta cambiando molti settori, dalla medicina all'industria. Alcuni programmi sono in grado di analizzare migliaia di immagini mediche in pochi minuti e di individuare segnali {1} un medico potrebbe non notare. {2}, queste tecnologie non sostituiscono il lavoro umano: lo rendono più efficace. Gli esperti insistono {3} necessità di regole chiare per proteggere i dati dei pazienti. {4} sia ancora presto per valutare tutte le conseguenze, è già evidente che la società dovrà adattarsi. {5} stanno cambiando anche le competenze richieste ai lavoratori.`,
    blanks: [
      ['che', ['cui', 'dove', 'quanto', 'chi'], 'Direct-object relative pronoun (un medico potrebbe non notare i segnali) → che.'],
      ['Tuttavia', ['Quindi', 'Infatti', 'Dunque', 'Perciò'], 'Reassurance after a possibly worrying idea: tuttavia = however.'],
      ['sulla', ['alla', 'dalla', 'nella', 'della'], '"insistere su" = to insist on.'],
      ['Sebbene', ['Poiché', 'Dato che', 'Perciò', 'Dunque'], 'Subjunctive "sia" → sebbene.'],
      ['Inoltre', ['Invece', 'Tuttavia', 'Perciò', 'Cioè'], 'inoltre = moreover, adding one more point.'],
    ],
  },
  {
    level: 4,
    text: `Nel Novecento l'Italia ha conosciuto trasformazioni profonde. Dopo la Seconda guerra mondiale il paese era povero e in gran parte agricolo; {1} pochi decenni, però, è diventato una delle maggiori economie industriali d'Europa. Questo sviluppo, {2} fu rapido, non fu uniforme: il Nord crebbe molto più velocemente del Sud. Molti meridionali emigrarono verso le città industriali, {3} cercavano lavoro e condizioni di vita migliori. Ancora oggi le differenze tra le due aree {4} un tema centrale del dibattito politico. È {5} comprendere queste dinamiche per capire la società italiana contemporanea.`,
    blanks: [
      ['In', ['Da', 'Per', 'Tra', 'Su'], '"In pochi decenni" = within a few decades (tra would mean "in the future").'],
      ['che', ['cui', 'dove', 'quale', 'quanto'], 'Subject of "fu rapido" → che.'],
      ['perché', ['affinché', 'sebbene', 'quindi', 'dunque'], 'Reason with the indicative: perché cercavano lavoro.'],
      ['rimangono', ['rimane', 'rimanga', 'rimasero', 'rimarrebbe'], 'Plural subject, present time ("Ancora oggi") → rimangono.'],
      ['essenziale', ['essenza', 'essenzialmente', 'essenziali', 'essendo'], '"È essenziale" + infinitive.'],
    ],
  },
];
