'use strict';

(() => {
  const box = document.querySelector('.comic-fact');
  if (!box || typeof CURIOSITA_TOPICS === 'undefined') return;
  const character = document.getElementById('fact-character');
  const text = document.getElementById('fact-text');
  const source = document.getElementById('fact-source');
  const next = document.getElementById('fact-next');
  const status = document.getElementById('fact-status');
  const license = document.getElementById('fact-license');
  const storageKey = 'safara-curiosita-v1';
  let history = [], bag = [], lastTopic = '', busy = false;
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    lastTopic = typeof saved.topic === 'string' ? saved.topic : '';
    history = Array.isArray(saved.history) ? saved.history.filter(x => typeof x === 'string').slice(-20) : [];
  } catch { /* Il blocco resta utilizzabile anche senza storage. */ }

  function remember(topic, sentence) {
    lastTopic = topic.title;
    history = [...history.filter(x => x !== sentence), sentence].slice(-20);
    try { sessionStorage.setItem(storageKey, JSON.stringify({topic:lastTopic, history})); } catch {}
  }

  function randomItem(items) { return items[Math.floor(Math.random() * items.length)]; }

  function nextTopic() {
    if (!bag.length) bag = [...CURIOSITA_TOPICS];
    let options = bag.filter(topic => topic.title !== lastTopic);
    if (!options.length) options = bag;
    const chosen = randomItem(options);
    bag = bag.filter(topic => topic !== chosen);
    return chosen;
  }

  function show(topic, sentence, online) {
    character.textContent = topic.title;
    text.textContent = sentence;
    source.href = topic.url;
    source.textContent = 'Fonte: Wikipedia ↗';
    status.textContent = online ? 'Letta dalla fonte online.' : 'Dalla selezione verificata.';
    license.hidden = !online;
    remember(topic, sentence);
  }

  function sentencesFrom(extract) {
    // Nessun HTML della fonte viene eseguito o inserito nella pagina.
    const plain = extract.replace(/\[\d+\]/g, '').replace(/\(AFI:[^)]*\)/g, '').replace(/\s+/g, ' ').trim();
    const sentences = typeof Intl.Segmenter === 'function'
      ? Array.from(new Intl.Segmenter('it', {granularity:'sentence'}).segment(plain), part => part.segment.trim())
      : (plain.match(/[^.!?]+[.!?](?:[”»"])?(?=\s|$)|[^.!?]+$/g) || []).map(s => s.trim());
    return sentences.filter(s => s.length >= 55 && s.length <= 240 && /[.!?][”»"]?$/.test(s) && !s.includes('…'));
  }

  async function onlineFact(topic) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);
    try {
      const params = new URLSearchParams({
        action:'query', format:'json', formatversion:'2', origin:'*',
        prop:'extracts', explaintext:'1', exintro:'1', redirects:'1', titles:topic.title
      });
      const response = await fetch('https://it.wikipedia.org/w/api.php?' + params, {
        credentials:'omit', cache:'no-cache', signal:controller.signal
      });
      if (!response.ok) throw new Error('Fonte non disponibile');
      const payload = await response.json();
      const page = payload?.query?.pages?.find(p => !p.missing && typeof p.extract === 'string');
      if (!page || payload.error) throw new Error('Contenuto non disponibile');
      const sentences = sentencesFrom(page.extract);
      const fresh = sentences.filter(s => !history.includes(s));
      if (!fresh.length) throw new Error('Nessuna nuova curiosità breve');
      return randomItem(fresh);
    } finally { clearTimeout(timeout); }
  }

  async function change() {
    if (busy) return;
    busy = true;
    const topic = nextTopic();
    const fresh = topic.facts.filter(s => !history.includes(s));
    const fallback = randomItem(fresh.length ? fresh : topic.facts);
    show(topic, fallback, false);
    next.disabled = true;
    next.setAttribute('aria-busy', 'true');
    status.textContent = 'Consulto la fonte online…';
    try {
      show(topic, await onlineFact(topic), true);
    } catch {
      // Rimane visibile una curiosità vera, con la fonte, anche offline.
      status.textContent = 'Dalla selezione verificata.';
    } finally {
      next.disabled = false;
      next.removeAttribute('aria-busy');
      busy = false;
    }
  }

  next.addEventListener('click', change);
  change();
})();
