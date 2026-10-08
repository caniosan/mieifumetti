# Safarà — proposta grafica «Fumetteria»

Versione preparata il 7 ottobre 2026 a partire dal repository `caniosan/mieifumetti`, commit `36f8b43`.

Carta avorio, rosso, titoli da copertina, schede delle raccolte e illustrazione originale di Safarà. La grafica comprende la home, il registro e le statistiche. Sotto i 700 pixel il registro usa schede degli albi al posto della tabella.

## File da caricare

Caricare **tutto il contenuto di questa cartella nella radice del repository esistente**, sostituendo le tre pagine HTML e mantenendo la cartella `assets` con i suoi file. Non caricare soltanto `index.html`.

- `index.html` — home, ricerca degli albi e filtri per raccolta.
- `raccolta.html` — registro, ricerca interna e link ai cataloghi.
- `statistiche.html` — conteggi, grafico ad anello e radar.
- `stile.css` — aspetto e regole responsive.
- `colori.js` — colori pastello casuali e indipendenti dei tre titoli, scelti prima di mostrare la pagina.
- `app.js` — presentazione e caricamento in sola lettura.
- `dati.js` — gli stessi 11 URL CSV dei Fogli Google, gli stessi nomi e i link ai cataloghi originali.
- `curiosita-dati.js` — personaggi, fonti e 14 curiosità di riserva verificate.
- `curiosita.js` — recupero online e rotazione casuale delle curiosità.
- `logo.png` — illustrazione originale, invariata.
- `favicon.svg` — icona del sito.
- `assets/` — font, Chart.js 4.5.1 e relative licenze.

La configurazione GitHub Pages e l’indirizzo del sito restano quelli esistenti. Il codice continua a leggere i CSV pubblicati da Google; gli aggiornamenti dei dati si fanno sui fogli come prima. Nessun dato viene scritto o modificato dal sito.

Le schede della home mostrano i loghi di Dylan Dog, Diabolik, Brendon e Simpsons, con il tipo di raccolta sotto il logo. Il Banco degli Unici conserva il titolo tipografico perché riunisce serie diverse. Le colonne IMG attuali sono vuote: non vengono richieste modifiche ai fogli.

Aggiornamento grafico: «Safarà», «Ogni albo, una storia» e «La mia libreria» usano tre colori pastello diversi, scelti casualmente e separatamente a ogni caricamento. Il contorno delle lettere resta nero e sottile (0,65 px). La palette comprende otto tonalità di intensità media: blu polvere, salvia, malva, terracotta, verde acqua, rosa antico, pervinca e rame. Esclude bianco, beige, colori molto chiari e fluorescenti. La sessione memorizza l’ultimo colore di ciascun titolo per non ripeterlo al caricamento successivo; se il browser blocca l’archiviazione locale, la scelta resta casuale e i tre colori restano diversi fra loro. Le due scritte «Safarà» in testata e nel piè di pagina condividono il colore del marchio. «Sul mio scaffale» è sostituito da «La mia libreria»; durante la ricerca compare «Trovati nella mia libreria».

I loghi delle serie mantengono i colori originali su un fondo chiaro. I file originali dei loghi sono inclusi in `assets/loghi/`, con le fonti nel relativo documento. Il bollino «Passione su carta» e il vecchio sottotitolo sono stati rimossi.

## Curiosità casuali

La home mostra una curiosità su Dylan Dog, Diabolik, Brendon, Homer, Bart, Lisa o Eva Kant. A ogni apertura della pagina e al clic su «Un’altra curiosità», consulta una voce di Wikipedia in italiano e sceglie una frase breve dalla sua introduzione. Mostra sempre il collegamento alla voce, dove sono disponibili autori e cronologia. Gli estratti online riportano anche il collegamento alla licenza CC BY-SA 4.0. Vengono normalizzati spazi, richiami numerici delle note ed eventuali indicazioni fonetiche.

Non occorrono chiavi API o un server aggiuntivo: il caricamento usa l’API pubblica di MediaWiki con CORS. Se la fonte non risponde entro 6,5 secondi, manca una frase adatta o la connessione è assente, resta visibile una delle 14 curiosità riformulate e verificate il 7 ottobre 2026. I testi di riserva e le rispettive fonti sono modificabili in `curiosita-dati.js`.

I personaggi ruotano senza ripetersi nello stesso giro; la sessione conserva le ultime curiosità per ridurre le ripetizioni. Il riquadro usa curiosità, non battute attribuite ai personaggi. Le fonti consultate sono le voci elencate nel file dati; il sito non esegue una ricerca generica su tutto il web.

Documentazione del servizio: [MediaWiki — richieste CORS](https://www.mediawiki.org/wiki/API:Cross-site_requests), [TextExtracts](https://www.mediawiki.org/wiki/Extension:TextExtracts). Licenza degli estratti: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.it).

## Verifiche

I collegamenti Google e i link ai cataloghi sono stati confrontati con il codice originale e sono identici. La lettura dei CSV al momento della verifica ha restituito 823 albi in 11 raccolte. Sono stati controllati sintassi JavaScript, conteggi per ogni raccolta, ricerca, filtri, apertura dei risultati, Banco degli Unici e dati forniti ai grafici tramite verifiche DOM locali.

L’API di Wikipedia ha risposto con successo e intestazioni CORS compatibili con richieste pubbliche dal browser. Con le risposte reali salvate sono stati verificati in un DOM locale la selezione delle frasi per tutti e sette i personaggi, la rotazione, i collegamenti alle fonti e il ripristino del contenuto di riserva in caso di errore. Anche il pulsante dell’anteprima è stato verificato: l’anteprima nella conversazione ruota soltanto la selezione locale; il recupero online è nel codice del sito.

Il controllo visivo in un browser desktop/mobile, incluso Safari, non è stato completato perché l’ambiente di verifica blocca l’apertura dei file locali. Prima della pubblicazione, aprire le pagine in un’anteprima servita via HTTP e verificare impaginazione e grafici. Non è stato pubblicato o modificato nulla su GitHub.

Per un’anteprima locale, se Python 3 è disponibile, aprire un terminale in questa cartella ed eseguire `python3 -m http.server 8000`, poi aprire `http://localhost:8000`. Serve una connessione internet per i dati Google e le curiosità online. Font, grafica e libreria dei grafici sono inclusi nel pacchetto.
