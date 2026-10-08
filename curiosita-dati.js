'use strict';

// Selezione verificata il 7 ottobre 2026. Le voci online sono consultate di nuovo
// da curiosita.js a ogni apertura e a ogni richiesta di un'altra curiosità.
const CURIOSITA_TOPICS = [
  {
    title: 'Dylan Dog', url: 'https://it.wikipedia.org/wiki/Dylan_Dog',
    facts: [
      'Dylan Dog nasce nel 1986 da un’idea di Tiziano Sclavi. Claudio Villa e Angelo Stano ne hanno definito l’aspetto.',
      'Le avventure di Dylan Dog hanno generato numerose ristampe e sono state tradotte e pubblicate anche all’estero.'
    ]
  },
  {
    title: 'Diabolik', url: 'https://it.wikipedia.org/wiki/Diabolik',
    facts: [
      'Diabolik fu creato dalle sorelle Angela e Luciana Giussani nel 1962, dando impulso al fumetto nero italiano.',
      'Il formato tascabile di Diabolik diventò un modello per molti altri fumetti neri degli anni Sessanta.'
    ]
  },
  {
    title: 'Brendon', url: 'https://it.wikipedia.org/wiki/Brendon',
    facts: [
      'Brendon è nato nel 1998 dalla fantasia di Claudio Chiaverotti. La sua serie regolare conta 100 numeri.',
      'Dopo la serie regolare, conclusa nel 2014, Brendon è tornato in volumi annuali dal 2016.'
    ]
  },
  {
    title: 'Homer Simpson', url: 'https://it.wikipedia.org/wiki/Homer_Simpson',
    facts: [
      'Prima della serie autonoma, Homer e la famiglia Simpson comparivano nei corti del Tracey Ullman Show.',
      'A Springfield, Homer lavora alla centrale nucleare. È padre di Bart, Lisa e Maggie.'
    ]
  },
  {
    title: 'Bart Simpson', url: 'https://it.wikipedia.org/wiki/Bart_Simpson',
    facts: [
      'Il nome Bart è un anagramma di “brat”, parola inglese che significa “monello”.',
      'Bart ha due alter ego: il combinaguai El Barto e il giustiziere mascherato Bartman.'
    ]
  },
  {
    title: 'Lisa Simpson', url: 'https://it.wikipedia.org/wiki/Lisa_Simpson',
    facts: [
      'Il nome di Lisa Simpson è quello di una delle sorelle di Matt Groening, il suo creatore.',
      'Lisa ha otto anni: è la sorella minore di Bart e la maggiore di Maggie.'
    ]
  },
  {
    title: 'Eva Kant', url: 'https://it.wikipedia.org/wiki/Eva_Kant',
    facts: [
      'Eva Kant ha esordito nel terzo numero di Diabolik, uscito il 3 marzo 1963.',
      'Come Diabolik, Eva Kant è stata creata da Angela e Luciana Giussani.'
    ]
  }
];
