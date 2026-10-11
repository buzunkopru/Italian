// Exam-style reading passages (YDS section 6): a text and four questions, five options each.
// { id, level, text, questions: [[question, answer, [4 wrong], explanation], ...] }
// Each question is stored with the whole passage so the runner can show it above the question.
// Rules: the answer must follow from the text (not from outside knowledge); every wrong option contradicts the
// text, is not mentioned, or answers a different question. Explanations point to the supporting sentence.

const BASE = [
  {
    id: 'biblioteca',
    level: 2,
    text: `Ogni sabato mattina Chiara va alla biblioteca del suo quartiere. Non ci va soltanto per prendere in prestito dei libri: le piace studiare in una sala tranquilla, lontano dal rumore di casa. La biblioteca ha anche una piccola sezione per i bambini, dove ogni settimana un volontario legge una storia ad alta voce. Chiara, che ha un fratellino di sei anni, lo porta spesso con sé. Mentre lui ascolta la storia, lei può finalmente finire i suoi compiti. Dopo pranzo, tornano a casa insieme e il bambino racconta alla mamma tutto quello che ha sentito.`,
    questions: [
      ['Perché Chiara va in biblioteca ogni sabato?', 'Per studiare in un ambiente tranquillo, oltre che per prendere libri.', ['Soltanto per prendere in prestito dei libri.', 'Perché a casa non ha libri.', 'Per leggere storie ai bambini.', 'Perché suo fratello lavora lì.'], '"Non ci va soltanto per prendere in prestito dei libri: le piace studiare in una sala tranquilla."'],
      ['Che cosa succede nella sezione per i bambini?', 'Ogni settimana un volontario legge una storia ad alta voce.', ['I bambini studiano con la bibliotecaria.', 'Ogni giorno i bambini scrivono una storia.', 'Chiara legge una storia ai bambini.', 'I genitori fanno i compiti con i figli.'], '"ogni settimana un volontario legge una storia ad alta voce."'],
      ['Perché Chiara riesce a finire i compiti?', 'Perché il fratellino è occupato ad ascoltare la storia.', ['Perché il fratellino resta a casa.', 'Perché la biblioteca chiude presto.', 'Perché la mamma la aiuta.', 'Perché il volontario studia con lei.'], '"Mentre lui ascolta la storia, lei può finalmente finire i suoi compiti."'],
      ['Quale affermazione è corretta secondo il testo?', 'Chiara e il fratellino tornano a casa dopo pranzo.', ['Il fratellino ha dieci anni.', 'Chiara va in biblioteca ogni domenica.', 'La mamma accompagna i figli in biblioteca.', 'Il bambino non racconta niente alla mamma.'], '"Dopo pranzo, tornano a casa insieme."'],
    ],
  },
  {
    id: 'mercato',
    level: 2,
    text: `Il sabato mattina, nella piazza centrale del paese, c'è il mercato. I contadini della zona vendono frutta, verdura, formaggi e uova appena raccolti, e i prezzi sono più bassi di quelli del supermercato. Molti abitanti preferiscono comprare qui perché i prodotti sono freschi e perché possono parlare con chi li ha coltivati. Verso mezzogiorno, quando la maggior parte dei banchi comincia a chiudere, i prezzi scendono ancora: è il momento giusto per chi cerca un buon affare.`,
    questions: [
      ['Che cosa si vende al mercato?', 'Prodotti alimentari freschi della zona.', ['Vestiti usati.', 'Libri antichi.', 'Mobili e macchine.', 'Prodotti surgelati.'], '"frutta, verdura, formaggi e uova appena raccolti."'],
      ['Perché molti abitanti preferiscono il mercato?', 'Perché i prodotti sono freschi e si parla con chi li coltiva.', ['Perché è aperto tutta la settimana.', 'Perché i prezzi sono più alti ma i prodotti migliori.', 'Perché si trova vicino al supermercato.', 'Perché è l\'unico posto dove si compra il pane.'], '"i prodotti sono freschi e… possono parlare con chi li ha coltivati."'],
      ['Quando i prezzi scendono ancora?', 'Verso mezzogiorno.', ['Alle otto del mattino.', 'La domenica.', 'La sera.', 'Dopo la chiusura del supermercato.'], '"Verso mezzogiorno… i prezzi scendono ancora."'],
      ['Nel testo, "affare" significa:', 'acquisto conveniente', ['problema', 'lavoro', 'incontro', 'viaggio'], 'Prices go down, so it is a good moment for a bargain.'],
    ],
  },
  {
    id: 'museo',
    level: 3,
    text: `Il museo archeologico della città ha annunciato un nuovo orario di apertura. Da lunedì prossimo sarà aperto dal martedì alla domenica, dalle 9 alle 19, mentre il lunedì resterà chiuso per consentire i lavori di restauro. L'ingresso costerà dieci euro, ma i residenti e i ragazzi sotto i diciotto anni potranno entrare gratuitamente la prima domenica del mese. Inoltre, per chi vuole approfondire, sono previste visite guidate su prenotazione, che durano circa un'ora. Il direttore ha spiegato che la decisione nasce dal desiderio di avvicinare più persone alla storia del territorio.`,
    questions: [
      ['Qual è lo scopo del testo?', 'Informare sul nuovo orario e sulle condizioni di visita.', ['Raccontare la storia della città.', 'Chiedere fondi per il restauro.', 'Convincere i residenti a lavorare nel museo.', 'Criticare il direttore del museo.'], 'The text lists hours, prices, free entry and guided tours.'],
      ['In quale giorno il museo resterà chiuso?', 'Il lunedì.', ['La domenica.', 'Il martedì.', 'Il sabato.', 'Il primo giorno del mese.'], '"il lunedì resterà chiuso per consentire i lavori di restauro."'],
      ['Chi entra gratis la prima domenica del mese?', 'I residenti e i ragazzi sotto i diciotto anni.', ['Tutti i turisti.', 'Soltanto i residenti.', 'Chi prenota una visita guidata.', 'Soltanto i maggiori di diciotto anni.'], '"i residenti e i ragazzi sotto i diciotto anni potranno entrare gratuitamente."'],
      ['Perché il direttore ha preso questa decisione?', 'Per avvicinare più persone alla storia locale.', ['Per guadagnare di più con i biglietti.', 'Per chiudere il museo il lunedì.', 'Per sostituire le visite guidate.', 'Perché i lavori di restauro sono finiti.'], '"nasce dal desiderio di avvicinare più persone alla storia del territorio."'],
    ],
  },
  {
    id: 'lettera',
    level: 3,
    text: `Cara Laura, ti scrivo da Berlino, dove mi sono trasferita un mese fa per lavoro. Le prime settimane sono state difficili: non conoscevo nessuno, il tedesco mi sembrava impossibile e il clima era più freddo di quanto pensassi. Ora, però, le cose vanno meglio. Ho trovato un piccolo appartamento vicino al lavoro e ho cominciato un corso di lingua serale, dove ho conosciuto altri stranieri. Mi manchi molto, e mi mancano anche le nostre passeggiate al lago. Se riesci a prenderti qualche giorno di ferie, vieni a trovarmi: ti farò vedere la città. Un abbraccio, Marta.`,
    questions: [
      ['Perché Marta si trova a Berlino?', 'Per motivi di lavoro.', ['Per imparare il tedesco.', 'Per una vacanza di un mese.', 'Per raggiungere Laura.', 'Perché ama il freddo.'], '"mi sono trasferita un mese fa per lavoro."'],
      ['Che cosa è stato difficile all\'inizio?', 'Non conoscere nessuno e capire il tedesco.', ['Trovare un appartamento.', 'Frequentare il corso serale.', 'Il viaggio in treno.', 'Lavorare con Laura.'], '"non conoscevo nessuno, il tedesco mi sembrava impossibile."'],
      ['Che cosa propone Marta a Laura?', 'Di andarla a trovare a Berlino.', ['Di trasferirsi con lei.', 'Di scriverle più spesso.', 'Di organizzare una passeggiata al lago.', 'Di cercarle un appartamento.'], '"vieni a trovarmi: ti farò vedere la città."'],
      ['Come si sente Marta ora?', 'Meglio di prima, anche se sente la mancanza di Laura.', ['Molto peggio di prima.', 'Completamente a suo agio e senza nostalgia.', 'Arrabbiata con Laura.', 'Stanca del lavoro.'], '"le cose vanno meglio… Mi manchi molto."'],
    ],
  },
  {
    id: 'bicicletta',
    level: 3,
    text: `Negli ultimi anni molte città europee hanno deciso di incoraggiare l'uso della bicicletta. Le ragioni sono diverse: il traffico rende difficile spostarsi in auto, l'inquinamento danneggia la salute e i parcheggi sono sempre più costosi. Per questo i comuni hanno costruito nuove piste ciclabili e organizzato servizi di noleggio a basso prezzo. I risultati, però, non sono uguali dappertutto. Dove le piste sono sicure e collegate tra loro, sempre più persone scelgono la bici per andare al lavoro. Dove invece le strade restano pericolose, molti preferiscono continuare a usare l'auto, anche per brevi tragitti. Gli esperti sostengono che non basta costruire le piste: serve anche cambiare le abitudini dei cittadini.`,
    questions: [
      ['Qual è l\'argomento principale del testo?', 'Gli sforzi delle città per far usare la bicicletta e i loro risultati diversi.', ['La storia della bicicletta in Europa.', 'I vantaggi economici delle automobili.', 'Come si ripara una bicicletta.', 'Il costo dei parcheggi nelle città europee.'], 'The text moves from the reasons to the measures to the uneven results.'],
      ['Secondo il testo, perché in alcune città molte persone scelgono la bici?', 'Perché le piste sono sicure e collegate tra loro.', ['Perché le auto sono vietate.', 'Perché il noleggio è gratuito.', 'Perché i parcheggi sono gratuiti.', 'Perché il clima è più caldo.'], '"Dove le piste sono sicure e collegate tra loro, sempre più persone scelgono la bici."'],
      ['Che cosa pensano gli esperti?', 'Costruire piste non è sufficiente senza un cambiamento di abitudini.', ['Le piste ciclabili sono inutili.', 'Basta costruire più piste per risolvere tutto.', 'I cittadini non cambieranno mai le loro abitudini.', 'Le auto sono più sicure delle biciclette.'], '"non basta costruire le piste: serve anche cambiare le abitudini."'],
      ['Nel testo, "tragitti" significa:', 'percorsi', ['incidenti', 'prezzi', 'pedaggi', 'giorni'], '"anche per brevi tragitti" = even for short trips.'],
    ],
  },
  {
    id: 'sonno',
    level: 3,
    text: `Molti studi confermano che dormire bene è fondamentale per la salute, ma una ricerca recente ha mostrato un aspetto meno noto: il sonno aiuta anche a ricordare. Durante la notte il cervello rielabora le informazioni ricevute nel corso della giornata e le trasferisce nella memoria a lungo termine. I ricercatori hanno chiesto a due gruppi di studenti di imparare una lista di parole. Il primo gruppo ha dormito otto ore, il secondo è rimasto sveglio tutta la notte. Il giorno dopo, gli studenti che avevano dormito ricordavano molte più parole. Gli autori dello studio avvertono, tuttavia, che i risultati vanno interpretati con cautela, perché il campione era piccolo.`,
    questions: [
      ['Qual è la novità dello studio?', 'Il sonno contribuisce anche alla memoria.', ['Dormire poco fa bene alla salute.', 'Gli studenti imparano meglio di notte.', 'Il cervello si ferma durante il sonno.', 'Le parole si dimenticano durante il giorno.'], '"il sonno aiuta anche a ricordare."'],
      ['Che cosa è successo il giorno dopo?', 'Chi aveva dormito ricordava più parole di chi era rimasto sveglio.', ['Chi era rimasto sveglio ricordava più parole.', 'I due gruppi ricordavano lo stesso numero di parole.', 'Nessuno ricordava la lista.', 'Il secondo gruppo ha dormito otto ore.'], '"gli studenti che avevano dormito ricordavano molte più parole."'],
      ['Perché gli autori invitano alla cautela?', 'Perché hanno studiato solo poche persone.', ['Perché i risultati sono sbagliati.', 'Perché gli studenti non hanno dormito.', 'Perché la lista di parole era troppo lunga.', 'Perché lo studio è durato un solo anno.'], '"perché il campione era piccolo" = the sample was small.'],
      ['Nel testo, "rielabora" significa:', 'elabora di nuovo', ['dimentica', 'cancella', 'registra per la prima volta', 'traduce'], 're- + elaborare = to process again.'],
    ],
  },
  {
    id: 'social',
    level: 4,
    text: `Secondo un'opinione diffusa, i social network starebbero rendendo i giovani più isolati. Eppure i dati non sono così chiari. Alcune ricerche indicano che chi trascorre molte ore online tende a sentirsi più solo; altre, al contrario, mostrano che per i ragazzi timidi i social rappresentano un modo per conoscere persone con interessi simili. La differenza, sostengono molti psicologi, non dipende tanto dal tempo trascorso quanto dal modo in cui si usano queste piattaforme: guardare passivamente le vite degli altri produce spesso frustrazione, mentre conversare con gli amici può rafforzare i rapporti. Sarebbe dunque ingiusto attribuire ai social una responsabilità che appartiene, in parte, alle abitudini di ciascuno.`,
    questions: [
      ['Qual è la tesi dell\'autore?', 'L\'effetto dei social dipende anche da come vengono usati.', ['I social isolano sempre i giovani.', 'I social sono sempre utili ai ragazzi timidi.', 'I giovani dovrebbero smettere di usare internet.', 'Gli psicologi non hanno studiato il fenomeno.'], '"non dipende tanto dal tempo trascorso quanto dal modo in cui si usano."'],
      ['Che cosa produce spesso frustrazione, secondo il testo?', 'Guardare passivamente la vita degli altri.', ['Conversare con gli amici.', 'Conoscere persone con gli stessi interessi.', 'Trascorrere poco tempo online.', 'Usare i social con timidezza.'], '"guardare passivamente le vite degli altri produce spesso frustrazione."'],
      ['Che cosa si può dedurre sulle ricerche citate?', 'Arrivano a risultati diversi.', ['Sono tutte d\'accordo.', 'Sono state fatte solo sui ragazzi timidi.', 'Dimostrano che i social non hanno effetti.', 'Non sono state pubblicate.'], '"Alcune ricerche indicano… altre, al contrario, mostrano…"'],
      ['Nel testo, "ingiusto" è usato per dire che attribuire ai social tutta la responsabilità è:', 'poco equo', ['molto facile', 'utile agli psicologi', 'pericoloso per i giovani', 'una novità'], '"Sarebbe dunque ingiusto" = it would be unfair.'],
    ],
  },
  {
    id: 'dialetti',
    level: 4,
    text: `In Italia, fino alla metà del Novecento, la maggior parte delle persone parlava in famiglia un dialetto e usava l'italiano soltanto in situazioni formali. Con la diffusione della televisione e dell'istruzione obbligatoria, la situazione è cambiata: oggi quasi tutti parlano italiano, anche se molti continuano a usare il dialetto con amici e parenti. Alcuni linguisti temono che i dialetti stiano scomparendo; altri, invece, sostengono che si stiano semplicemente trasformando, mescolandosi con la lingua nazionale. Quel che è certo è che i giovani li conoscono meno dei loro nonni, e che molte espressioni locali rischiano di essere dimenticate.`,
    questions: [
      ['Qual è l\'argomento del testo?', 'Come sono cambiati i dialetti con la diffusione dell\'italiano.', ['La nascita della lingua italiana.', 'Perché i giovani non studiano più.', 'Il ruolo della televisione nel cinema.', 'Le differenze tra italiano e inglese.'], 'The text traces the change from dialect to Italian and its effect on dialects.'],
      ['Che cosa è cambiato con la televisione e la scuola?', 'Quasi tutti hanno imparato a parlare italiano.', ['Nessuno usa più il dialetto.', 'Il dialetto è diventato lingua ufficiale.', 'Gli anziani hanno dimenticato l\'italiano.', 'I giovani parlano solo in dialetto.'], '"oggi quasi tutti parlano italiano, anche se molti continuano a usare il dialetto."'],
      ['Su quale punto i linguisti non sono d\'accordo?', 'Se i dialetti stiano scomparendo o semplicemente cambiando.', ['Se i giovani parlino italiano.', 'Se la televisione sia utile.', 'Se l\'istruzione debba essere obbligatoria.', 'Se i nonni conoscano il dialetto.'], '"Alcuni linguisti temono… altri, invece, sostengono…"'],
      ['Che cosa è certo, secondo il testo?', 'I giovani conoscono i dialetti meno dei nonni.', ['I dialetti scompariranno presto.', 'I dialetti non cambiano mai.', 'I nonni parlano solo italiano.', 'I giovani usano il dialetto più degli anziani.'], '"Quel che è certo è che i giovani li conoscono meno dei loro nonni."'],
    ],
  },
  {
    id: 'plastica',
    level: 4,
    text: `Qualche anno fa un comune della costa ha vietato l'uso di sacchetti e posate di plastica nei locali pubblici. All'inizio la misura ha suscitato proteste: i commercianti temevano costi più alti e i clienti non capivano perché dovessero cambiare abitudini. Dopo due anni, però, il bilancio è positivo. La quantità di rifiuti raccolti sulle spiagge è diminuita di circa un terzo e molti negozi hanno scoperto che i prodotti alternativi, pur essendo più cari, attirano clienti attenti all'ambiente. Il sindaco ammette che il divieto, da solo, non basta, ma sottolinea che ha avuto un merito importante: ha costretto tutti a riflettere sul problema.`,
    questions: [
      ['Come hanno reagito all\'inizio commercianti e clienti?', 'Con proteste e dubbi.', ['Con entusiasmo.', 'Con indifferenza.', 'Con richieste di estendere il divieto.', 'Con la chiusura dei negozi.'], '"All\'inizio la misura ha suscitato proteste."'],
      ['Quale effetto positivo ha avuto il divieto?', 'Sulle spiagge ci sono meno rifiuti.', ['I prezzi sono diminuiti.', 'I negozi hanno più clienti stranieri.', 'La plastica è sparita da tutto il paese.', 'I commercianti hanno guadagnato meno.'], '"la quantità di rifiuti raccolti sulle spiagge è diminuita di circa un terzo."'],
      ['Perché alcuni negozi hanno tratto vantaggio dal divieto?', 'Perché i prodotti alternativi attirano clienti attenti all\'ambiente.', ['Perché i prodotti alternativi costano meno.', 'Perché la plastica era finita.', 'Perché non hanno più clienti.', 'Perché il comune li ha pagati.'], '"pur essendo più cari, attirano clienti attenti all\'ambiente."'],
      ['Che cosa ammette il sindaco?', 'Che il divieto da solo non è sufficiente.', ['Che il divieto è stato un errore.', 'Che i commercianti avevano ragione.', 'Che il problema è risolto.', 'Che i rifiuti sono aumentati.'], '"il divieto, da solo, non basta."'],
    ],
  },
  {
    id: 'inflazione',
    level: 4,
    text: `L'inflazione indica un aumento generale e continuo dei prezzi. Quando i prezzi salgono, con la stessa somma di denaro si possono comprare meno beni: il potere d'acquisto diminuisce. Le cause possono essere diverse. A volte la domanda cresce più rapidamente dell'offerta; altre volte aumentano i costi di produzione, per esempio quelli dell'energia, e le imprese li scaricano sui consumatori. Le banche centrali cercano di tenere l'inflazione sotto controllo alzando i tassi di interesse, ma questa scelta ha un prezzo: rende più costosi i prestiti e può rallentare la crescita economica.`,
    questions: [
      ['Che cosa significa inflazione, secondo il testo?', 'Un aumento generale e continuo dei prezzi.', ['Un calo dei prezzi.', 'Un aumento degli stipendi.', 'Un aumento dell\'offerta di beni.', 'Una riduzione delle tasse.'], 'First sentence of the text.'],
      ['Che cosa succede al potere d\'acquisto quando i prezzi salgono?', 'Diminuisce.', ['Aumenta.', 'Resta uguale.', 'Diventa impossibile da calcolare.', 'Dipende solo dalle banche.'], '"si possono comprare meno beni: il potere d\'acquisto diminuisce."'],
      ['Come intervengono le banche centrali?', 'Alzando i tassi di interesse.', ['Abbassando i tassi di interesse.', 'Aumentando la produzione di energia.', 'Vietando l\'aumento dei prezzi.', 'Riducendo gli stipendi.'], '"alzando i tassi di interesse."'],
      ['Qual è lo svantaggio di questa scelta?', 'I prestiti costano di più e la crescita può rallentare.', ['I prezzi salgono più in fretta.', 'I consumatori comprano più beni.', 'Le imprese producono di più.', 'L\'energia costa di più.'], '"rende più costosi i prestiti e può rallentare la crescita economica."'],
    ],
  },
  {
    id: 'film',
    level: 4,
    text: `Il nuovo film del regista, atteso da mesi, delude chi sperava in un'opera all'altezza dei lavori precedenti. La storia, quella di una famiglia che si ritrova dopo vent'anni per vendere la casa dei genitori, parte con un'idea interessante, ma si perde presto in dialoghi ripetitivi e in scene troppo lunghe. Gli attori, pur bravi, non riescono a salvare un copione debole. Si salva soltanto la fotografia, che rende con grande finezza i paesaggi della campagna toscana. Chi ama il cinema d'autore potrà trovare qualche spunto di interesse; tutti gli altri farebbero meglio a rimandare la visione.`,
    questions: [
      ['Qual è il giudizio generale del critico?', 'Negativo, con una sola nota positiva.', ['Entusiasta.', 'Del tutto neutro.', 'Positivo, con qualche difetto.', 'Negativo soprattutto per colpa degli attori.'], '"delude… Si salva soltanto la fotografia."'],
      ['Che cosa viene lodato nel film?', 'La fotografia.', ['Il copione.', 'I dialoghi.', 'La durata delle scene.', 'La musica.'], '"Si salva soltanto la fotografia."'],
      ['Perché il film perde qualità?', 'Per i dialoghi ripetitivi e le scene troppo lunghe.', ['Perché gli attori recitano male.', 'Perché la storia è troppo breve.', 'Perché manca la musica.', 'Perché è girato in una grande città.'], '"si perde presto in dialoghi ripetitivi e in scene troppo lunghe."'],
      ['A chi consiglia il film il critico?', 'Soltanto agli appassionati di cinema d\'autore.', ['A tutti gli spettatori.', 'Alle famiglie con bambini.', 'A chi non ha visto i lavori precedenti.', 'A chi ama i paesaggi toscani soltanto.'], '"Chi ama il cinema d\'autore potrà trovare qualche spunto; tutti gli altri farebbero meglio a rimandare."'],
    ],
  },
  {
    id: 'esami',
    level: 4,
    text: `Da anni si discute se gli esami scritti siano il modo migliore per valutare gli studenti. I sostenitori sottolineano che una prova uguale per tutti garantisce equità e permette di confrontare i risultati. I critici, invece, osservano che molte prove misurano soprattutto la capacità di ricordare nozioni a breve termine, mentre trascurano abilità come la creatività e il lavoro di gruppo. Alcune scuole hanno quindi introdotto progetti e presentazioni orali accanto agli esami tradizionali. Non è chiaro, tuttavia, se questo metodo sia davvero più giusto: valutare un lavoro creativo richiede criteri che possono variare da insegnante a insegnante.`,
    questions: [
      ['Qual è l\'argomento centrale del testo?', 'I vantaggi e i limiti degli esami scritti.', ['Come si preparano gli insegnanti.', 'La storia delle scuole italiane.', 'Perché gli studenti odiano gli esami.', 'Come si lavora in gruppo.'], 'The text weighs supporters against critics of written exams.'],
      ['Quale vantaggio indicano i sostenitori degli esami scritti?', 'Una prova uguale per tutti è più equa.', ['Misurano la creatività.', 'Premiano il lavoro di gruppo.', 'Sono più facili da preparare.', 'Dipendono dall\'insegnante.'], '"una prova uguale per tutti garantisce equità."'],
      ['Che cosa criticano gli oppositori?', 'Le prove misurano soprattutto la memoria a breve termine.', ['Le prove sono troppo difficili.', 'Le prove non sono uguali per tutti.', 'Gli studenti non studiano abbastanza.', 'Le presentazioni orali sono inutili.'], '"misurano soprattutto la capacità di ricordare nozioni a breve termine."'],
      ['Quale dubbio resta sui progetti e le presentazioni?', 'I criteri di valutazione possono cambiare da un insegnante all\'altro.', ['Sono troppo costosi.', 'Gli studenti non li amano.', 'Richiedono più tempo degli esami scritti.', 'Non sono mai stati usati nelle scuole.'], '"richiede criteri che possono variare da insegnante a insegnante."'],
    ],
  },
];

import { READING_MORE } from './exam-reading-more.js';
export const EXAM_READING = [...BASE, ...READING_MORE];
