import { loadWords } from '../content.js';
import { esc, speak } from '../util.js';

const STAGES = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2' };
const CATS = [
  ['all', 'All'], ['Verbs', 'Verbs'], ['Nouns', 'Nouns'], ['Adjectives', 'Adjectives'],
  ['Connectors & Prepositions', 'Connectors'], ['Adverbs & Pronouns', 'Adverbs'],
];
const PAGE = 50;

// Remember filters while the app is open
const view = { q: '', stage: 'all', cat: 'all', limit: PAGE };

export async function render(root) {
  const words = await loadWords();
  root.innerHTML = `
    <h1>Words</h1>
    <p class="muted">The 1,000 most useful words, A1 to B2.</p>
    <input type="search" id="q" placeholder="Search Italian or English…" value="${esc(view.q)}" autocomplete="off" autocapitalize="off">
    <div class="chips" id="stages">${['all', 1, 2, 3, 4].map((s) =>
      `<button class="chip ${String(view.stage) === String(s) ? 'on' : ''}" data-stage="${s}">${s === 'all' ? 'All levels' : STAGES[s]}</button>`).join('')}</div>
    <div class="chips" id="cats">${CATS.map(([k, label]) =>
      `<button class="chip ${view.cat === k ? 'on' : ''}" data-cat="${esc(k)}">${label}</button>`).join('')}</div>
    <p class="small muted" id="count"></p>
    <div id="list"></div>`;

  const list = root.querySelector('#list');
  const count = root.querySelector('#count');

  function draw() {
    const q = view.q.trim().toLowerCase();
    const found = words.filter((w) =>
      (view.stage === 'all' || w.stage === Number(view.stage)) &&
      (view.cat === 'all' || w.category === view.cat) &&
      (!q || w.word.toLowerCase().includes(q) || w.en.toLowerCase().includes(q)));
    count.textContent = `${found.length} words`;
    if (!found.length) { list.innerHTML = `<div class="empty">No words match.</div>`; return; }
    const shown = found.slice(0, view.limit);
    list.innerHTML = shown.map((w) => `
      <div class="card word">
        <div class="row between">
          <div class="grow">
            <span class="pill">${STAGES[w.stage] || ''}</span> <span class="muted small">${esc(w.type)}</span>
            ${w.gender ? `<span class="pill ${w.gender === 'f' ? 'fem' : 'masc'}">${w.gender === 'f' ? 'f.' : 'm.'}</span>` : ''}
            <div class="it">${esc(w.article ? `${w.article} ` : '')}${esc(w.word)}</div>
            <div>${esc(w.en)}</div>
            ${w.plural ? `<div class="muted small">plural: ${esc(w.plural)}</div>` : ''}
          </div>
          <button class="chip" data-say="${esc(`${w.article ? `${w.article} ` : ''}${w.word}`)}" aria-label="Listen">🔊</button>
        </div>
        ${w.exampleIt ? `<div class="ex"><div>${esc(w.exampleIt)}</div><div class="muted">${esc(w.exampleEn)}</div></div>` : ''}
        ${w.ydsTip ? `<div class="tip">🎯 ${esc(w.ydsTip)}</div>` : ''}
      </div>`).join('') +
      (found.length > shown.length ? `<button class="btn ghost block" id="more">Show more (${found.length - shown.length} left)</button>` : '');
  }

  let t;
  root.querySelector('#q').addEventListener('input', (e) => {
    clearTimeout(t);
    t = setTimeout(() => { view.q = e.target.value; view.limit = PAGE; draw(); }, 120);
  });
  const pick = (box, attr, key) => box.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    box.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b));
    view[key] = b.dataset[attr];
    view.limit = PAGE;
    draw();
  });
  pick(root.querySelector('#stages'), 'stage', 'stage');
  pick(root.querySelector('#cats'), 'cat', 'cat');
  list.addEventListener('click', (e) => {
    const say = e.target.closest('[data-say]');
    if (say) return speak(say.dataset.say);
    if (e.target.closest('#more')) { view.limit += PAGE; draw(); }
  });
  draw();
}
