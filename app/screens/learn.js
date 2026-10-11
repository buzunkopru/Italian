import { loadLevels, loadLevel } from '../content.js';
import { esc, speak } from '../util.js';

const plain = (html) => String(html).replace(/<[^>]*>/g, '');
// v1 lesson text marks emphasis as *word*; show it as italics.
const md = (s) => String(s ?? '').replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

export async function render(root, ctx, params) {
  const [levelId, lessonId] = params;
  if (!levelId) return renderLevels(root);
  if (!lessonId) return renderLessons(root, ctx, levelId);
  return renderLesson(root, ctx, levelId, lessonId);
}

async function renderLevels(root) {
  const levels = await loadLevels();
  root.innerHTML = `<h1>Learn</h1><p class="muted">Four levels from A1 to the YDS exam.</p>` + levels.map((l) => `
    <a class="card tap" href="#/learn/${l.id}" style="border-left:4px solid ${esc(l.accent)}">
      <div class="row between">
        <div class="grow"><h3>${esc(l.badge)}</h3><p class="muted small" style="margin:0">${esc(l.description)}</p></div>
        <span class="pill">${l.lessonCount} lessons</span>
      </div>
    </a>`).join('');
}

async function renderLessons(root, ctx, levelId) {
  const level = await loadLevel(levelId).catch(() => null);
  if (!level) { root.innerHTML = `<div class="empty">Level not found.</div>`; return; }
  const done = (await ctx.storage.getSetting('lessonsRead', {})) || {};
  root.innerHTML = `
    <a class="crumb" href="#/learn">‹ All levels</a>
    <h1>${esc(level.badge)}</h1>
    <p class="muted">${esc(level.description)}</p>
    ${level.lessons.map((l) => `
      <a class="card tap" href="#/learn/${level.id}/${esc(l.id)}">
        <div class="row">
          <div class="num">${esc(l.id)}</div>
          <div class="grow"><h3 style="margin:0">${esc(l.title)}</h3><div class="muted small">${esc(l.subtitle)}</div></div>
          ${done[l.id] ? '<span style="color:var(--good)">✓</span>' : ''}
        </div>
      </a>`).join('')}`;
}

async function renderLesson(root, ctx, levelId, lessonId) {
  const level = await loadLevel(levelId).catch(() => null);
  const lesson = level && level.lessons.find((l) => l.id === lessonId);
  if (!lesson) { root.innerHTML = `<div class="empty">Lesson not found.</div>`; return; }

  const idx = level.lessons.indexOf(lesson);
  const prev = level.lessons[idx - 1];
  const next = level.lessons[idx + 1];

  const concepts = (lesson.concepts || []).map((c, i) => `
    <div class="concept">
      <div class="row between"><span class="it">${md(c.it)}</span><button class="chip" data-say="${i}" aria-label="Listen">🔊</button></div>
      <div>${md(c.en)}</div>
      ${c.note ? `<div class="note">${md(c.note)}</div>` : ''}
    </div>`).join('');

  const xray = lesson.xray ? `
    <div class="box"><h4>Sentence X-ray</h4>
      <div class="xray">${lesson.xray.blocks.map((b) => `
        <div class="blk ${esc(b.colorClass || '')}"><b>${esc(b.it)}</b><small>${esc(b.role)}</small><small>${esc(b.en)}</small></div>`).join('')}
      </div>
      <p class="muted small" style="margin:10px 0 0">“${esc(lesson.xray.fullEn)}”</p>
    </div>` : '';

  const quiz = lesson.checkQuiz ? `
    <div class="box"><h4>Quick check</h4>
      <p><b>${esc(lesson.checkQuiz.question)}</b></p>
      <div class="opts" id="quizOpts">${lesson.checkQuiz.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o.text)}</button>`).join('')}</div>
      <div class="feedback" id="quizFb" hidden></div>
    </div>` : '';

  root.innerHTML = `
    <a class="crumb" href="#/learn/${esc(levelId)}">‹ ${esc(level.badge)}</a>
    <span class="pill">Lesson ${esc(lesson.id)}</span>
    <h1 style="margin-top:6px">${esc(lesson.title)}</h1>
    <p class="muted">${esc(lesson.subtitle)}</p>

    <div class="box model"><h4>The mental model</h4>${md(lesson.mentalModel)}</div>
    ${concepts ? `<div class="box"><h4>Core forms</h4>${concepts}</div>` : ''}
    ${xray}
    ${lesson.bridgeMarker ? `<div class="box bridge"><h4>🌉 Bridge to the exam</h4>${md(lesson.bridgeMarker)}</div>` : ''}
    ${quiz}

    <button class="btn block" id="markRead">Mark lesson as read</button>
    <p class="small muted" style="margin:8px 0 16px;text-align:center">Practice drills for this lesson arrive in step 2.</p>

    <div class="row between">
      ${prev ? `<a class="btn ghost" href="#/learn/${esc(levelId)}/${esc(prev.id)}">‹ ${esc(prev.id)}</a>` : '<span></span>'}
      ${next ? `<a class="btn ghost" href="#/learn/${esc(levelId)}/${esc(next.id)}">${esc(next.id)} ›</a>` : '<span></span>'}
    </div>`;

  root.querySelectorAll('[data-say]').forEach((b) =>
    b.addEventListener('click', () => speak(plain(lesson.concepts[+b.dataset.say].it))));

  if (lesson.checkQuiz) {
    const opts = root.querySelector('#quizOpts');
    const fb = root.querySelector('#quizFb');
    opts.addEventListener('click', (e) => {
      const btn = e.target.closest('.opt');
      if (!btn || opts.dataset.done) return;
      opts.dataset.done = '1';
      const chosen = lesson.checkQuiz.options[+btn.dataset.i];
      opts.querySelectorAll('.opt').forEach((b, i) => {
        if (lesson.checkQuiz.options[i].isCorrect) b.classList.add('correct');
      });
      if (!chosen.isCorrect) btn.classList.add('wrong');
      fb.hidden = false;
      fb.innerHTML = `${chosen.isCorrect ? '✓ Correct. ' : '✗ Not quite. '}${lesson.checkQuiz.explanation}`;
    });
  }

  root.querySelector('#markRead').addEventListener('click', async () => {
    const read = (await ctx.storage.getSetting('lessonsRead', {})) || {};
    read[lesson.id] = Date.now();
    await ctx.storage.setSetting('lessonsRead', read);
    ctx.toast('Lesson marked as read ✓');
  });
}
