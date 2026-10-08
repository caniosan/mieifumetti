'use strict';

// Le immagini vengono lette direttamente dalla fonte: nessun file di copertina locale.
window.SafaraCovers = (() => {
  const data = window.SAFARA_COVER_DATA;
  const base = 'https://www.comicsbox.it';
  const entries = new Map();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  function issueNumber(value) {
    const text = String(value ?? '').trim();
    const match = text.match(/\((\d+)\)\s*$/) || text.match(/^(\d+)$/);
    return match ? Number(match[1]) : null;
  }
  function httpsUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; }
    catch { return ''; }
  }
  function get(item) {
    const number = issueNumber(item.num);
    const group = item.sId === 'banco-unici' ? item.group : item.sId;
    const key = [item.sId, ...(item.sId === 'banco-unici' ? [group || ''] : []), number].join(':');
    const stored = data.items[key];
    let record = typeof stored === 'string' ? {id:stored} : stored;
    if (record?.whenTitle && normalize(record.whenTitle) !== normalize(item.tit)) record = undefined;
    const prefix = Object.prototype.hasOwnProperty.call(data.series, group) ? data.series[group] : '';
    // Le nuove righe delle collane già configurate si associano senza URL nel foglio.
    // Zagor usa la numerazione Zenith nel foglio e quella della testata nel catalogo.
    const sourceNumber = group === 'zagor' ? number - 51 : number;
    const id = record?.id || (prefix && number !== null && sourceNumber > 0 ? `${prefix}_${String(sourceNumber).padStart(3, '0')}` : '');
    const customImage = httpsUrl(item.img);
    const image = customImage || (id ? `${base}/cover/${id}.jpg` : '');
    const source = customImage ? httpsUrl(item.link) || customImage : id ? `${base}/albo/${id}` : '';
    let note = record?.note || '';
    let warning = !!record?.warning;
    if (record?.catalogueTitle && !normalize(item.tit).endsWith(normalize(record.catalogueTitle))) {
      note = [note, `Titolo nel catalogo: «${record.catalogueTitle}».`].filter(Boolean).join(' ');
      if (record.titleConflict) warning = true;
    }
    if (customImage) { note = 'Immagine indicata nel foglio della collezione.'; warning = false; }
    return {key, id, image, source, note, warning, edition:customImage ? '' : record?.edition || '', sourceName:customImage ? 'Fonte immagine' : 'ComicsBox', title:item.tit, series:item.sNome, number:item.num};
  }
  function thumbnail(item, interactive = true) {
    const cover = get(item);
    entries.set(cover.key, cover);
    if (!cover.image) return '<span class="cover-thumb cover-unavailable"><span class="cover-fallback">Copertina<br>non disponibile</span></span>';
    const content = `<span class="cover-image-slot"><span class="cover-fallback" aria-hidden="true">Copertina<br>non disponibile</span><img class="remote-cover" src="${escape(cover.image)}" alt="${interactive ? '' : escape('Copertina di ' + cover.title)}" width="76" height="110" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>${cover.warning ? '<span class="cover-check" aria-hidden="true">Da verificare</span>' : ''}`;
    return interactive
      ? `<button type="button" class="cover-thumb cover-button" data-cover-key="${escape(cover.key)}" aria-label="Ingrandisci la copertina: ${escape(cover.title)}, n. ${escape(cover.number)}${cover.warning ? '. Abbinamento da verificare' : ''}">${content}</button>`
      : `<span class="cover-thumb">${content}</span>`;
  }
  let dialog, returnFocus;
  function createDialog() {
    dialog = document.createElement('dialog');
    dialog.className = 'cover-dialog';
    dialog.setAttribute('aria-labelledby', 'cover-dialog-title');
    dialog.innerHTML = '<div class="cover-dialog-inner"><button class="cover-close" type="button" aria-label="Chiudi la copertina" autofocus>×</button><div class="cover-dialog-art" id="cover-dialog-art"></div><div class="cover-dialog-copy"><p class="eyebrow" id="cover-dialog-series"></p><h2 id="cover-dialog-title"></h2><p id="cover-dialog-edition" class="cover-edition"></p><p id="cover-dialog-note" class="cover-note"></p><a class="outline-button" id="cover-dialog-source" target="_blank" rel="noopener noreferrer"></a></div></div>';
    document.body.append(dialog);
    dialog.querySelector('.cover-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { document.body.classList.remove('cover-dialog-open'); returnFocus?.focus(); });
    return dialog;
  }
  function open(cover, trigger) {
    const element = dialog || createDialog();
    // Fallback per browser senza dialog nativo: la fonte rimane sempre raggiungibile.
    if (typeof element.showModal !== 'function') { window.open(cover.source, '_blank', 'noopener,noreferrer'); return; }
    returnFocus = trigger;
    document.getElementById('cover-dialog-title').textContent = cover.title;
    document.getElementById('cover-dialog-series').textContent = `${cover.series} · N° ${cover.number}`;
    document.getElementById('cover-dialog-edition').textContent = cover.edition;
    const note = document.getElementById('cover-dialog-note');
    note.textContent = cover.warning ? `Abbinamento da verificare. ${cover.note}` : cover.note;
    note.hidden = !note.textContent;
    note.classList.toggle('cover-note-warning', cover.warning);
    const link = document.getElementById('cover-dialog-source');
    link.href = cover.source; link.textContent = `${cover.sourceName} · apri la scheda ↗`;
    document.getElementById('cover-dialog-art').innerHTML = `<span class="cover-image-slot"><span class="cover-fallback">Copertina non disponibile.<br>Puoi consultare la scheda della fonte.</span><img class="remote-cover" src="${escape(cover.image)}" alt="${escape('Copertina di ' + cover.title)}" decoding="async" referrerpolicy="no-referrer"></span>`;
    document.body.classList.add('cover-dialog-open');
    element.showModal();
  }
  // Delegazione: gestisce anche le miniature create dopo una ricerca.
  document.addEventListener('click', event => {
    const trigger = event.target.closest?.('[data-cover-key]');
    const cover = trigger && entries.get(trigger.dataset.coverKey);
    if (cover) open(cover, trigger);
  });
  document.addEventListener('error', event => {
    if (event.target.matches?.('img.remote-cover')) {
      event.target.hidden = true;
      event.target.closest('.cover-image-slot')?.classList.add('cover-unavailable');
    }
  }, true);
  function collectionSource(id) {
    return data.series[id] ? `${base}/serie/${data.series[id]}` : base;
  }
  return Object.freeze({get, thumbnail, collectionSource, issueNumber});
})();
