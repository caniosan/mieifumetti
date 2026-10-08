'use strict';

// Presentazione del catalogo. I collegamenti e i nomi originali sono in dati.js.
const coverData = {
  'dyd': ['dyd', 'DYLAN DOG', 'Serie regolare'],
  'dyd-rist': ['dyd', 'DYLAN DOG', 'Ristampa'],
  'dyd-book': ['dyd', 'DYLAN DOG', 'Collezione Book'],
  'dyd-super': ['dyd', 'DYLAN DOG', 'Super Book'],
  'dyd-gig': ['dyd', 'DYLAN DOG', 'Albo Gigante'],
  'diab': ['diab', 'DIABOLIK', 'Serie regolare'],
  'diab-r': ['diab', 'DIABOLIK', 'Ristampa · R'],
  'diab-sw': ['diab', 'DIABOLIK', 'Swiisss · Seconda ristampa'],
  'brendon': ['other', 'BRENDON', 'Serie regolare'],
  'simpsons': ['other', 'SIMPSONS', 'Panini Comics'],
  'banco-unici': ['other', 'IL BANCO<br>DEGLI UNICI', 'Albi e curiosità']
};
const seriesLogos = {
  dyd: 'assets/loghi/dylan-dog.png',
  diab: 'assets/loghi/diabolik.png',
  brendon: 'assets/loghi/brendon.png',
  simpsons: 'assets/loghi/simpsons.svg'
};
function logoKey(id) {
  return id.startsWith('dyd') ? 'dyd' : id.startsWith('diab') ? 'diab' : id;
}
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalized = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const numberFormat = new Intl.NumberFormat('it-IT');
const clean = value => String(value ?? '').replace(/[\u2018\u2019]/g, "'").trim();
const owned = value => ['si','x'].includes(normalized(value).replace(/["']/g,''));
function validUrl(value) {
  try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; }
  catch { return ''; }
}

// Supporta virgole, doppi apici e ritorni a capo nelle celle esportate da Google.
function parseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); if (row.some(v => v.trim())) rows.push(row); row = []; field = '';
    } else field += c;
  }
  row.push(field); if (row.some(v => v.trim())) rows.push(row);
  return rows;
}

async function loadSeries(id) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(CSV_LINKS[id], {signal: controller.signal});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const text = await response.text();
    if (/^\s*</.test(text)) throw new Error('Risposta non CSV');
    const offset = id === 'banco-unici' ? 1 : 0;
    const serie = raccolte.find(s => s.id === id);
    return parseCSV(text).slice(1).filter(c => owned(c[3 + offset])).map(c => ({
      sId:id, sNome:serie.nome, num:clean(c[1 + offset]), tit:clean(c[2 + offset]) || 'Senza titolo',
      prezzo:clean(c[4 + offset]) || '—', cond:clean(c[5 + offset]) || '—',
      link: id === 'banco-unici' ? validUrl(clean(c[7])) : ''
    }));
  } finally { clearTimeout(timeout); }
}

async function loadAll() {
  const settled = await Promise.allSettled(raccolte.map(s => loadSeries(s.id)));
  const data = []; const failed = [];
  settled.forEach((result, i) => {
    if (result.status === 'fulfilled') data.push({...raccolte[i], items:result.value});
    else failed.push(raccolte[i]);
  });
  return {data, failed};
}

function setupSearch(inputId, update) {
  const input = $(inputId), clearButton = $('clear-search');
  const handle = () => { clearButton.hidden = !input.value; update(input.value); };
  input.addEventListener('input', handle);
  clearButton.addEventListener('click', () => { input.value = ''; handle(); input.focus(); });
}

async function initHome() {
  let allData = [], failed = [], counts = new Map(), pending = true, filter = 'all', query = '';
  const grid = $('menu-raccolte');
  function render() {
    const q = normalized(query);
    const selected = raccolte.filter(s => filter === 'all' || coverData[s.id][0] === filter);
    $('shelf-title').textContent = q ? 'Trovati nella mia libreria' : 'La mia libreria';
    $('home-notice').hidden = !failed.length;
    $('home-notice').textContent = failed.length ? `Dati non disponibili per ${failed.length} raccolte. I risultati potrebbero essere incompleti.` : '';
    if (!q) {
      $('shelf-subtitle').textContent = `${selected.length} raccolte da esplorare.`;
      grid.innerHTML = selected.map(s => {
        const [family, title, subtitle] = coverData[s.id];
        const key = logoKey(s.id), logo = seriesLogos[key];
        const brand = logo ? `<span class="cover-brand"><img class="series-logo series-logo-${key}" src="${logo}" alt="" decoding="async"></span>` : `<div class="cover-title">${title}</div>`;
        const count = counts.has(s.id) ? `${numberFormat.format(counts.get(s.id))} albi posseduti` : (pending ? 'Caricamento albi…' : 'Apri il registro');
        return `<a class="collection-card" data-family="${family}" data-id="${s.id}" href="raccolta.html?serie=${s.id}" aria-label="${esc(s.nome)}, apri il registro"><div class="cover" aria-hidden="true"><div class="cover-top"><span>Safarà · Collezione</span><span>${String(raccolte.indexOf(s)+1).padStart(2,'0')}</span></div>${brand}<span class="cover-label">${subtitle}</span></div><div class="card-bottom"><div><h3>${esc(s.nome)}</h3><p>${count}</p></div><span class="card-arrow" aria-hidden="true">↗</span></div></a>`;
      }).join('');
      return;
    }
    if (pending) {
      $('shelf-subtitle').textContent = 'La ricerca sarà pronta al termine del caricamento.';
      grid.innerHTML = '<p class="message">Caricamento degli albi. La ricerca si aggiornerà automaticamente.</p>';
      return;
    }
    const results = allData.filter(item => (filter === 'all' || coverData[item.sId][0] === filter) && (normalized(item.tit).includes(q) || normalized(item.num) === q));
    const shown = results.slice(0, 60);
    $('shelf-subtitle').textContent = `${numberFormat.format(results.length)} ${results.length === 1 ? 'albo trovato' : 'albi trovati'}${results.length > 60 ? ' · primi 60 risultati, affina la ricerca per gli altri' : ''}.`;
    grid.innerHTML = shown.length ? shown.map(item => `<a class="collection-card result-card" href="raccolta.html?serie=${item.sId}&cerca=${encodeURIComponent(item.num)}"><span class="result-series">${esc(item.sNome)} · N° ${esc(item.num)}</span><h3>${esc(item.tit)}</h3><span class="result-bottom">Apri nel registro <span class="card-arrow" aria-hidden="true">↗</span></span></a>`).join('') : '<p class="message">Nessun albo trovato. Prova un altro titolo o numero.</p>';
  }
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    render();
  }));
  setupSearch('search-input', value => {query = value; render();});
  render();
  const result = await loadAll(); failed = result.failed;
  allData = result.data.flatMap(s => s.items); counts = new Map(result.data.map(s => [s.id, s.items.length])); pending = false;
  $('search-status').innerHTML = failed.length === raccolte.length
    ? 'Dati non raggiungibili. <button class="text-button" type="button" id="reload-data">Riprova</button>'
    : `<span class="live-dot" aria-hidden="true"></span><strong>${numberFormat.format(allData.length)} albi</strong> ${failed.length ? 'nelle raccolte caricate' : 'in archivio'} <span aria-hidden="true">/</span> ${result.data.length} raccolte`;
  $('reload-data')?.addEventListener('click', () => location.reload());
  render();
}

async function initRegister() {
  const params = new URLSearchParams(location.search), id = params.get('serie');
  const serie = raccolte.find(s => s.id === id);
  const message = $('register-message'), tbody = $('table-body');
  let items = [], query = params.get('cerca') || '', pending = true;
  function render() {
    if (pending) return;
    const q = normalized(query), selected = items.filter(item => !q || normalized(item.tit).includes(q) || normalized(item.num) === q);
    $('register-count').textContent = q ? `${selected.length} albi trovati su ${items.length}` : `${numberFormat.format(items.length)} albi posseduti`;
    $('register-table').hidden = !selected.length;
    message.hidden = !!selected.length;
    message.textContent = selected.length ? '' : q ? 'Nessun albo corrisponde alla ricerca.' : 'Nessun albo posseduto in questa raccolta.';
    tbody.innerHTML = selected.map(item => `<tr class="table-row"><td class="issue-number">${esc(item.num || '—')}</td><td class="issue-title">${esc(item.tit)}</td><td class="issue-status"><span class="status-badge">Disponibile</span></td><td class="issue-price">${esc(item.prezzo)}</td><td class="issue-condition">${esc(item.cond)}</td>${id === 'banco-unici' ? `<td>${item.link ? `<a class="info-link" href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">Info albo ↗</a>` : '—'}</td>` : ''}</tr>`).join('');
  }
  if (!serie) {
    $('serie-title').textContent = 'Raccolta non trovata';
    $('register-table').hidden = true; document.querySelector('.register-toolbar').hidden = true;
    message.hidden = false; message.innerHTML = 'Scegli una raccolta dall’<a class="info-link" href="index.html">archivio</a>.';
    return;
  }
  $('serie-title').textContent = serie.nome; document.title = `${serie.nome} | Safarà`;
  if (COMICS_ORG_LINKS[id]) $('external-link-container').innerHTML = `<a class="outline-button" href="${COMICS_ORG_LINKS[id]}" target="_blank" rel="noopener noreferrer">Catalogo generale <span aria-hidden="true">↗</span></a>`;
  if (id === 'banco-unici') $('table-header-row').insertAdjacentHTML('beforeend', '<th scope="col">Link</th>');
  $('register-search').value = query; $('clear-search').hidden = !query;
  setupSearch('register-search', value => {query = value; render();});
  try { items = await loadSeries(id); pending = false; render(); }
  catch {
    $('register-table').hidden = true; $('register-count').textContent = 'Dati non disponibili';
    message.hidden = false; message.innerHTML = '<p>Non è stato possibile caricare gli albi. Controlla la connessione e riprova.</p><button type="button" id="retry-register">Riprova</button>';
    $('retry-register').addEventListener('click', () => location.reload());
  }
}

async function initStats() {
  const {data, failed} = await loadAll();
  const total = data.reduce((sum, s) => sum + s.items.length, 0);
  const series = data.map(s => ({...s, val:s.items.length})).sort((a,b) => b.val - a.val);
  $('total-counter').textContent = data.length ? numberFormat.format(total) : '—';
  $('stats-status').textContent = failed.length ? `${data.length} raccolte caricate su ${raccolte.length}.` : `${raccolte.length} raccolte, una passione per le storie.`;
  $('total-label').textContent = failed.length ? 'Albi nelle raccolte caricate' : 'Albi nella collezione';
  if (failed.length) {
    $('stats-message').hidden = false;
    $('stats-message').innerHTML = `<p>${data.length ? 'Conteggio parziale: alcune raccolte non sono raggiungibili.' : 'Non è stato possibile caricare la collezione.'}</p><button type="button" id="retry-stats">Riprova</button>`;
    $('retry-stats').addEventListener('click', () => location.reload());
  }
  if (!data.length) { document.querySelector('.chart-grid').hidden = true; return; }
  const colors = ['#b93527','#303c38','#b08d39','#6c4b3c','#56706d','#c87552','#837b5a','#343942','#bb9867','#807078','#446575'];
  const pct = value => (total ? value / total * 100 : 0);
  const percentage = value => pct(value).toLocaleString('it-IT',{maximumFractionDigits:1}) + '%';
  $('stats-container').innerHTML = series.map((s,i) => `<a class="stat-card" href="raccolta.html?serie=${s.id}"><div class="stat-heading"><span class="stat-name"><span class="swatch" aria-hidden="true" style="background:${colors[i]}"></span>${esc(s.nome)}</span><span class="stat-value">${numberFormat.format(s.val)} <span>${percentage(s.val)}</span></span></div><div class="progress-bar" aria-hidden="true"><div class="progress-fill" style="width:${pct(s.val)}%;background:${colors[i]}"></div></div></a>`).join('');
  if (typeof Chart === 'undefined') {
    document.querySelector('.chart-grid').hidden = true;
    $('stats-status').textContent += ' Grafici non disponibili; i conteggi sono riportati sotto.';
    return;
  }
  await document.fonts.ready;
  Chart.defaults.font.family = 'DM, Arial, sans-serif'; Chart.defaults.color = '#686158';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names = series.map(s => s.nome), values = series.map(s => s.val);
  new Chart($('pieChart'), {
    type:'doughnut', data:{labels:names,datasets:[{data:values,backgroundColor:colors,borderColor:'#fffcf2',borderWidth:3,hoverOffset:7}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'67%',animation:reduceMotion ? false : {duration:400},layout:{padding:9},plugins:{legend:{display:false},tooltip:{backgroundColor:'#22211f',padding:12,callbacks:{label:c => ` ${numberFormat.format(c.raw)} albi · ${percentage(c.raw)}`}}}}
  });
  const shortNames = {'dyd':'Dylan Dog','dyd-rist':['Dylan Dog','Ristampa'],'dyd-book':['Dylan Dog','Book'],'dyd-super':['Dylan Dog','Super Book'],'dyd-gig':['Dylan Dog','Gigante'],'diab':'Diabolik','diab-r':'Diabolik (R)','diab-sw':['Diabolik','Swiisss'],'brendon':'Brendon','simpsons':'Simpsons','banco-unici':['Banco','degli Unici']};
  new Chart($('radarChart'), {
    type:'radar', data:{labels:series.map(s => shortNames[s.id]),datasets:[{label:'Albi',data:values,backgroundColor:'rgba(185,53,39,.13)',borderColor:'#b93527',borderWidth:2,pointBackgroundColor:'#b93527',pointRadius:3}]},
    options:{responsive:true,maintainAspectRatio:false,animation:reduceMotion ? false : {duration:400},layout:{padding:8},scales:{r:{beginAtZero:true,grid:{color:'#ded7c7'},angleLines:{color:'#ded7c7'},pointLabels:{color:'#403b35',font:{size:10}},ticks:{display:false}}},plugins:{legend:{display:false},tooltip:{backgroundColor:'#22211f',padding:12}}}
  });
}

const initPages = {home:initHome, register:initRegister, stats:initStats};
initPages[document.body.dataset.page]?.();
