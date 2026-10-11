// More reading passages (same format as exam-reading.js).
// { id, level, text, questions: [[question, answer, [4 wrong], explanation], ...] }

export const READING_MORE = [
  {
    id: 'treno-storico',
    level: 3,
    text: `Ogni domenica di primavera un vecchio treno a vapore percorre la linea che collega due paesi di collina. Il viaggio dura quasi un'ora, ma i passeggeri non sembrano avere fretta: molti salgono con la macchina fotografica, altri con i bambini che sognano di vedere una vera locomotiva. L'associazione che organizza il servizio è composta soltanto da volontari, spesso ex ferrovieri, che hanno restaurato le carrozze con i propri risparmi. I biglietti costano poco, ma bastano a coprire le spese di manutenzione. Gli organizzatori sperano, in futuro, di poter estendere il percorso fino al mare.`,
    questions: [
      ['Chi organizza il servizio?', 'Un\'associazione di volontari, spesso ex ferrovieri.', ['Le ferrovie nazionali.', 'Il comune dei due paesi.', 'Un\'azienda turistica privata.', 'Un gruppo di studenti.'], '"composta soltanto da volontari, spesso ex ferrovieri."'],
      ['A che cosa servono gli incassi dei biglietti?', 'A coprire le spese di manutenzione.', ['A pagare gli stipendi dei ferrovieri.', 'A comprare nuove locomotive.', 'A finanziare subito il viaggio fino al mare.', 'A pagare il comune.'], '"bastano a coprire le spese di manutenzione."'],
      ['Che cosa sperano gli organizzatori?', 'Di allungare il percorso fino al mare.', ['Di vendere il treno.', 'Di abolire i biglietti.', 'Di far viaggiare il treno ogni giorno.', 'Di sostituire il treno a vapore con uno moderno.'], '"sperano… di poter estendere il percorso fino al mare."'],
      ['Nel testo, "ferrovieri" indica:', 'persone che lavorano nelle ferrovie', ['viaggiatori abituali', 'costruttori di strade', 'guide turistiche', 'piloti di aerei'], 'ferrovia = railway, so ferroviere = railway worker.'],
    ],
  },
  {
    id: 'scuola-quartiere',
    level: 3,
    text: `La scuola elementare del quartiere Santa Lucia rischiava di chiudere: gli iscritti erano troppo pochi e il comune non aveva più fondi per mantenerla. I genitori, però, non si sono arresi. Hanno organizzato una raccolta di firme, hanno aperto la scuola alla cittadinanza con laboratori e serate culturali e hanno convinto alcune aziende della zona a sostenere i costi. Dopo un anno, il numero degli iscritti è raddoppiato e l'amministrazione ha deciso di confermare la scuola. Il preside afferma che il merito è soprattutto della collaborazione tra famiglie e insegnanti.`,
    questions: [
      ['Perché la scuola rischiava di chiudere?', 'Aveva pochi iscritti e il comune non aveva fondi.', ['Era troppo vecchia per essere sicura.', 'Gli insegnanti volevano andare via.', 'I genitori non volevano più mandarvi i figli.', 'Il preside aveva dato le dimissioni.'], '"gli iscritti erano troppo pochi e il comune non aveva più fondi."'],
      ['Che cosa hanno fatto i genitori?', 'Hanno raccolto firme, organizzato attività aperte a tutti e cercato il sostegno di aziende.', ['Hanno protestato davanti al comune senza organizzare nulla.', 'Hanno cambiato scuola ai figli.', 'Hanno pagato da soli tutti i costi.', 'Hanno chiesto di chiudere la scuola.'], 'The three actions are listed in the second part of the text.'],
      ['Che cosa è successo dopo un anno?', 'Gli iscritti sono raddoppiati e la scuola è stata confermata.', ['La scuola è stata chiusa.', 'Gli iscritti sono diminuiti.', 'Il comune ha pagato tutti i costi.', 'Le aziende hanno ritirato i fondi.'], '"il numero degli iscritti è raddoppiato e l\'amministrazione ha deciso di confermare la scuola."'],
      ['A che cosa attribuisce il successo il preside?', 'Alla collaborazione tra famiglie e insegnanti.', ['Ai fondi del comune.', 'Alla bravura degli studenti.', 'Alle aziende della zona.', 'Alla raccolta di firme soltanto.'], '"il merito è soprattutto della collaborazione tra famiglie e insegnanti."'],
    ],
  },
  {
    id: 'lavoro-agile',
    level: 4,
    text: `Il cosiddetto lavoro agile, diffusosi con forza negli ultimi anni, viene spesso presentato come una conquista senza ombre. In realtà i suoi effetti sono più sfumati. Molti lavoratori apprezzano il risparmio di tempo e di denaro che deriva dal non dover raggiungere ogni giorno l'ufficio; altri, però, lamentano la difficoltà di separare la vita privata dall'attività professionale, con orari che si allungano senza che nessuno se ne accorga. Alcune aziende hanno già introdotto il diritto alla disconnessione, ma la sua applicazione resta incerta, soprattutto nelle realtà più piccole.`,
    questions: [
      ['Qual è l\'idea centrale del testo?', 'Il lavoro agile ha vantaggi, ma anche problemi spesso trascurati.', ['Il lavoro agile è un fallimento totale.', 'Tutti i lavoratori preferiscono lavorare in ufficio.', 'Il lavoro agile è stato vietato dalle aziende.', 'Il lavoro agile riguarda soltanto le piccole aziende.'], '"una conquista senza ombre. In realtà i suoi effetti sono più sfumati."'],
      ['Quale vantaggio apprezzano molti lavoratori?', 'Risparmiano tempo e denaro negli spostamenti.', ['Lavorano meno ore.', 'Guadagnano di più.', 'Hanno più colleghi.', 'Non devono rispondere ai capi.'], '"il risparmio di tempo e di denaro che deriva dal non dover raggiungere ogni giorno l\'ufficio."'],
      ['Che cosa significa, nel contesto, "diritto alla disconnessione"?', 'Il diritto di non rispondere alle richieste di lavoro fuori orario.', ['Il diritto di lavorare soltanto da casa.', 'Il diritto di non usare internet.', 'Il diritto di cambiare azienda.', 'Il diritto di lavorare più ore.'], 'It is introduced as a remedy for working hours that grow without anyone noticing.'],
      ['Dove l\'applicazione di questo diritto è più incerta?', 'Nelle aziende più piccole.', ['Nelle grandi aziende.', 'Nelle scuole.', 'Negli uffici pubblici.', 'In tutte le aziende allo stesso modo.'], '"soprattutto nelle realtà più piccole."'],
    ],
  },
  {
    id: 'mulino',
    level: 3,
    text: `Alla periferia del paese sorge un vecchio mulino ad acqua, rimasto abbandonato per quasi cinquant'anni. Nel 2015 un gruppo di giovani ha deciso di recuperarlo: hanno pulito il canale, riparato la grande ruota di legno e trasformato i locali in un piccolo museo della civiltà contadina. Oggi il mulino è aperto nei fine settimana e organizza visite per le scuole. Nei giorni di festa si può anche assistere alla macinazione del grano e comprare la farina ottenuta con il metodo tradizionale. Gli abitanti, che un tempo vedevano il vecchio edificio come un rudere, ne vanno ora molto fieri.`,
    questions: [
      ['Per quanto tempo il mulino è rimasto abbandonato?', 'Per quasi cinquant\'anni.', ['Per cinque anni.', 'Dal 2015.', 'Per un secolo.', 'Per vent\'anni.'], '"rimasto abbandonato per quasi cinquant\'anni."'],
      ['Che cosa hanno fatto i giovani?', 'Hanno recuperato il mulino e creato un piccolo museo.', ['Hanno costruito un nuovo mulino.', 'Hanno venduto il mulino.', 'Hanno aperto un negozio di farina.', 'Hanno demolito il canale.'], '"hanno deciso di recuperarlo… trasformato i locali in un piccolo museo."'],
      ['Che cosa si può fare nei giorni di festa?', 'Vedere macinare il grano e comprare la farina.', ['Visitare soltanto il museo.', 'Imparare a costruire una ruota.', 'Dormire nei locali del mulino.', 'Pescare nel canale.'], '"Nei giorni di festa si può anche assistere alla macinazione del grano e comprare la farina."'],
      ['Nel testo, "rudere" indica:', 'un edificio in rovina', ['un luogo molto frequentato', 'un monumento nuovo', 'un mulino funzionante', 'un museo'], 'Neighbours used to see the building as ruined, in contrast with their present pride.'],
    ],
  },
  {
    id: 'moneta-digitale',
    level: 4,
    text: `I pagamenti elettronici sono ormai la norma in molte città, e c'è chi prevede la scomparsa del contante. I vantaggi sono evidenti: le transazioni sono rapide, tracciabili e, per i commercianti, più sicure. Eppure l'abbandono totale delle banconote solleva più di una perplessità. Chi non possiede un conto o una carta, come molti anziani o persone in difficoltà economica, rischierebbe di essere escluso da servizi essenziali. Inoltre, un sistema interamente digitale è vulnerabile a guasti e attacchi informatici: basterebbe un'interruzione prolungata per bloccare gli acquisti di un'intera città.`,
    questions: [
      ['Qual è la posizione dell\'autore?', 'Cauta: riconosce i vantaggi ma segnala dei rischi.', ['Del tutto favorevole alla fine del contante.', 'Contraria ai pagamenti elettronici in ogni caso.', 'Indifferente al tema.', 'Convinta che il contante sia già scomparso.'], '"I vantaggi sono evidenti. Eppure… solleva più di una perplessità."'],
      ['Chi rischierebbe di essere escluso dai servizi essenziali?', 'Chi non ha un conto o una carta.', ['Chi ha troppe carte di credito.', 'I commercianti.', 'I giovani.', 'Chi vive in città.'], '"Chi non possiede un conto o una carta… rischierebbe di essere escluso."'],
      ['Perché un sistema solo digitale è vulnerabile?', 'Perché guasti o attacchi informatici potrebbero bloccare gli acquisti.', ['Perché le transazioni sono troppo lente.', 'Perché le carte sono troppo care.', 'Perché i commercianti lo rifiutano.', 'Perché i pagamenti non sono tracciabili.'], '"vulnerabile a guasti e attacchi informatici."'],
      ['Quale vantaggio è citato per i commercianti?', 'Le transazioni sono più sicure.', ['Non pagano nessuna tassa.', 'Possono vendere soltanto online.', 'Guadagnano di più dal contante.', 'Non hanno più bisogno di un conto.'], '"rapide, tracciabili e, per i commercianti, più sicure."'],
    ],
  },
  {
    id: 'lettura-abitudini',
    level: 3,
    text: `In molti paesi, Italia compresa, una parte consistente della popolazione non legge quasi mai un libro. I giovani tra i quindici e i venticinque anni, però, leggono spesso più degli adulti, soprattutto grazie alla scuola e alle biblioteche. I libri elettronici stanno crescendo, ma la carta resta la scelta preferita da chi legge molto. Gli esperti suggeriscono che, per far nascere l'abitudine della lettura, bisogna cominciare da piccoli: i bambini che vedono i genitori leggere hanno più probabilità di diventare a loro volta lettori.`,
    questions: [
      ['Chi legge più degli adulti, secondo il testo?', 'I giovani tra i quindici e i venticinque anni.', ['I bambini piccoli.', 'Gli anziani.', 'I genitori.', 'Gli insegnanti.'], '"I giovani tra i quindici e i venticinque anni… leggono spesso più degli adulti."'],
      ['Grazie a che cosa leggono i giovani?', 'Alla scuola e alle biblioteche.', ['Ai libri elettronici.', 'Ai genitori.', 'Alla televisione.', 'Ai social network.'], '"soprattutto grazie alla scuola e alle biblioteche."'],
      ['Che cosa preferisce chi legge molto?', 'I libri di carta.', ['I libri elettronici.', 'I giornali.', 'Gli audiolibri.', 'I fumetti.'], '"la carta resta la scelta preferita da chi legge molto."'],
      ['Che cosa consigliano gli esperti?', 'Di cominciare da piccoli, anche con l\'esempio dei genitori.', ['Di leggere solo libri elettronici.', 'Di aspettare l\'età adulta.', 'Di vietare la televisione.', 'Di leggere soltanto a scuola.'], '"bisogna cominciare da piccoli: i bambini che vedono i genitori leggere…"'],
    ],
  },
];
