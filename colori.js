(() => {
  'use strict';

  // Pastelli di tono medio: niente bianco, beige, colori pallidi o fluorescenti.
  const palette = ['#6b83a3', '#71866e', '#977b9d', '#ad7972', '#6b8d8a', '#a67788', '#7e80a7', '#ad805e'];
  const storageKey = 'safara:colori-titoli:v2';
  let previous = {};
  try { previous = JSON.parse(sessionStorage.getItem(storageKey) || '{}') || {}; } catch (_) {}
  const current = {};
  const used = new Set();
  for (const title of ['brand', 'hero', 'shelf']) {
    const choices = palette.filter(color => color !== previous[title] && !used.has(color));
    const color = choices[Math.floor(Math.random() * choices.length)];
    current[title] = color;
    used.add(color);
    document.documentElement.style.setProperty(`--${title}-color`, color);
  }
  try { sessionStorage.setItem(storageKey, JSON.stringify(current)); } catch (_) {}
})();
