// Timed mock exam: lobby (#/exam/mock), the paper itself (#/exam/mock/run) and past results (#/exam/mock/result/<n>).
import { loadBank } from '../bank.js';
import { esc } from '../util.js';
import { promptHtml } from '../quiz.js';
import { SECTIONS } from './exam.js';
import { MOCK_SIZES, buildMock, scoreMock, totalOf } from '../../engine/mock.js';
import { historyOf } from '../../engine/picker.js';
import { EXAM_SECTIONS } from '../../engine/schema.js';
import { TARGET } from '../../engine/estimate.js';
import { review } from '../../engine/srs.js';
import { localDay } from '../../engine/dates.js';

const RUN_KEY = 'mockRun';
const MOCKS_KEY = 'mocks';

const clock = (sec) => {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const r = String(s % 60).padStart(2, '0');
  return h ? `${h}:${m}:${r}` : `${m}:${r}`;
};
const sectionName = (s) => (SECTIONS[s] ? SECTIONS[s][0] : s);

export async function render(root, ctx, params) {
  const [what, arg] = params;
  if (what === 'run') return renderRun(root, ctx);
  if (what === 'result') return renderPast(root, ctx, Number(arg));
  return renderLobby(root, ctx);
}

async function renderLobby(root, ctx) {
  const [run, mocks] = await Promise.all([ctx.storage.getSetting(RUN_KEY, null), ctx.storage.getSetting(MOCKS_KEY, [])]);
  const resume = run && Date.now() < run.endsAt;
  const past = mocks.map((m, i) => ({ m, i })).reverse().slice(0, 8);
  root.innerHTML = `
    <div class="row between"><h1>Mock exam</h1><a class="chip" href="#/exam">✕</a></div>
    <p class="muted">The real paper: 80 questions, 180 minutes, no feedback until the end. A mock shows you where you really stand.</p>
    ${resume ? `<a class="card tap" href="#/exam/mock/run"><div class="row between"><div><span class="pill">In progress</span><h3 style="margin:6px 0 0">Resume your ${esc(MOCK_SIZES[run.size].label.toLowerCase())}</h3><span class="muted small">${clock((run.endsAt - Date.now()) / 1000)} left · ${Object.keys(run.answers).length}/${run.ids.length} answered</span></div><span>›</span></div></a>` : ''}
    ${Object.entries(MOCK_SIZES).map(([k, s]) => `
      <button class="card tap block start-mock" data-size="${k}" style="text-align:left;width:100%">
        <div class="row between"><div><h3 style="margin:0">${esc(s.label)}</h3><span class="muted small">${totalOf(k)} questions · ${s.minutes} minutes</span></div><span>›</span></div>
      </button>`).join('')}
    <p class="small muted">The clock keeps running if you leave the app, like in the real exam. Your answers are saved as you go.</p>
    ${past.length ? `<h3 class="sechead">Past mock exams</h3>${past.map(({ m, i }) => `
      <a class="card tap" href="#/exam/mock/result/${i}"><div class="row between"><div><b>${m.points} points</b> <span class="muted small">(${m.correct}/${m.total})</span><div class="muted small">${esc(MOCK_SIZES[m.size]?.label || m.size)} · ${esc(localDay(new Date(m.at)))}</div></div><span>›</span></div></a>`).join('')}` : ''}`;

  root.querySelectorAll('.start-mock').forEach((btn) => btn.addEventListener('click', async () => {
    if (resume && !confirm('Start a new mock? Your unfinished one will be discarded.')) return;
    const [bank, answers] = await Promise.all([loadBank(), ctx.storage.getAnswers()]);
    const built = buildMock({ questions: bank.questions, size: btn.dataset.size, history: historyOf(answers) });
    const now = Date.now();
    await ctx.storage.setSetting(RUN_KEY, { size: built.size, ids: built.ids, answers: {}, startedAt: now, endsAt: now + built.minutes * 60000, pos: 0 });
    location.hash = '#/exam/mock/run';
  }));
}

async function renderRun(root, ctx) {
  const [bank, run] = await Promise.all([loadBank(), ctx.storage.getSetting(RUN_KEY, null)]);
  if (!run) { location.hash = '#/exam/mock'; return; }
  run.ids = run.ids.filter((id) => bank.byId.has(id));
  if (Date.now() >= run.endsAt) return finish(root, ctx, bank, run, true);

  let timer = null;
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  window.addEventListener('hashchange', stop, { once: true });
  const save = () => ctx.storage.setSetting(RUN_KEY, run);
  let grid = false;

  function draw() {
    stop();
    const id = run.ids[run.pos];
    const q = bank.byId.get(id);
    const chosen = run.answers[id];
    const answered = Object.keys(run.answers).length;
    const last = run.pos === run.ids.length - 1;
    root.innerHTML = `
      <div class="row between" style="margin-bottom:8px">
        <button class="chip" id="exit" aria-label="Leave">✕</button>
        <b id="clock" class="clock"></b>
        <span class="small muted">${run.pos + 1}/${run.ids.length}</span>
      </div>
      <div class="bar"><div style="width:${(answered / run.ids.length) * 100}%"></div></div>
      <div class="small muted" style="margin-top:8px">${esc(sectionName(q.section))}</div>
      ${q.passage ? `<div class="card passage">${esc(q.passage)}</div>` : ''}
      <div class="card qcard"><div class="qtext${q.prompt.length > 140 ? ' long' : ''}">${promptHtml(q, chosen === undefined ? '' : q.options[chosen], '')}</div></div>
      <div class="opts" id="opts">${q.options.map((o, i) => `<button class="opt${i === chosen ? ' sel' : ''}" data-i="${i}">${esc(o)}</button>`).join('')}</div>
      <div class="row between" style="margin-top:12px;gap:8px">
        <button class="btn ghost" id="prev" ${run.pos === 0 ? 'disabled' : ''}>‹ Back</button>
        <button class="btn ghost" id="gridbtn">${answered}/${run.ids.length}</button>
        ${last ? '<button class="btn" id="finish">Finish</button>' : '<button class="btn" id="next">Next ›</button>'}
      </div>
      ${grid ? `<div class="qgrid">${run.ids.map((x, i) => `<button class="qn${run.answers[x] !== undefined ? ' done' : ''}${i === run.pos ? ' cur' : ''}" data-go="${i}">${i + 1}</button>`).join('')}</div>
        <button class="btn block" id="finish2" style="margin-top:12px">Finish and see my score</button>` : ''}`;

    const tick = () => {
      const left = (run.endsAt - Date.now()) / 1000;
      const el = root.querySelector('#clock');
      if (el) { el.textContent = clock(left); el.classList.toggle('low', left < 600); }
      if (left <= 0) { stop(); finish(root, ctx, bank, run, true); }
    };
    tick();
    timer = setInterval(tick, 1000);

    root.querySelector('#opts').addEventListener('click', async (e) => {
      const b = e.target.closest('.opt');
      if (!b) return;
      run.answers[id] = Number(b.dataset.i);
      await save();
      draw();
    });
    const go = (n) => { run.pos = n; save(); grid = false; draw(); window.scrollTo(0, 0); };
    root.querySelector('#prev').addEventListener('click', () => go(run.pos - 1));
    const next = root.querySelector('#next');
    if (next) next.addEventListener('click', () => go(run.pos + 1));
    root.querySelector('#gridbtn').addEventListener('click', () => { grid = !grid; draw(); });
    root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.go))));
    const done = async () => {
      const left = run.ids.length - Object.keys(run.answers).length;
      if (left && !confirm(`${left} question${left === 1 ? ' is' : 's are'} unanswered and will count as wrong. Finish anyway?`)) return;
      stop();
      finish(root, ctx, bank, run, false);
    };
    ['#finish', '#finish2'].forEach((s) => { const el = root.querySelector(s); if (el) el.addEventListener('click', done); });
    root.querySelector('#exit').addEventListener('click', () => {
      stop();
      location.hash = '#/exam/mock'; // progress is already saved; the clock keeps running
    });
  }
  draw();
}

async function finish(root, ctx, bank, run, timedOut) {
  const result = scoreMock(bank.byId, run.ids, run.answers);
  const seconds = Math.min(Date.now(), run.endsAt) - run.startedAt;
  const entry = { at: Date.now(), size: run.size, seconds: Math.round(seconds / 1000), ...result };
  const mocks = await ctx.storage.getSetting(MOCKS_KEY, []);
  mocks.push(entry);
  await ctx.storage.setSetting(MOCKS_KEY, mocks);
  await ctx.storage.setSetting(RUN_KEY, null);
  // answered questions count towards your history; wrong ones go into the review boxes
  const wrongIds = new Set(result.wrong.map((w) => w.qid));
  for (const id of run.ids) {
    if (run.answers[id] === undefined) continue;
    const q = bank.byId.get(id);
    const correct = !wrongIds.has(id);
    await ctx.storage.recordAnswer({ qid: id, section: q.section, topic: q.topic, correct, ms: 0 });
    const existing = await ctx.storage.getSrs(id);
    if (existing || !correct) await ctx.storage.putSrs(id, review(existing, correct, localDay()));
  }
  await ctx.touchStreak();
  showResult(root, bank, entry, mocks.length - 1, timedOut);
}

async function renderPast(root, ctx, index) {
  const [bank, mocks] = await Promise.all([loadBank(), ctx.storage.getSetting(MOCKS_KEY, [])]);
  const entry = mocks[index];
  if (!entry) { location.hash = '#/exam/mock'; return; }
  showResult(root, bank, entry, index, false);
}

function showResult(root, bank, entry, index, timedOut) {
  const passing = entry.points >= TARGET;
  const rows = Object.keys(EXAM_SECTIONS).filter((s) => entry.bySection[s]).map((s) => {
    const { c, t } = entry.bySection[s];
    const pct = Math.round((c / t) * 100);
    return `<div class="topic"><div class="row between"><span class="grow">${esc(sectionName(s))}</span><b>${c}/${t}</b></div>
      <div class="bar"><div class="${pct >= 70 ? 'g' : pct < 50 ? 'r' : ''}" style="width:${pct}%"></div></div></div>`;
  }).join('');
  const wrong = entry.wrong.map((w) => ({ w, q: bank.byId.get(w.qid) })).filter((x) => x.q);
  root.innerHTML = `
    <h1>Mock result</h1>
    <div class="card" style="text-align:center">
      <div style="font-size:2.4rem">${passing ? '🎉' : '💪'}</div>
      <h2 style="margin:4px 0">${entry.points} points</h2>
      <p class="muted" style="margin:0">${entry.correct} of ${entry.total} right · target ${TARGET}${timedOut ? ' · time ran out' : ''} · ${clock(entry.seconds)} used</p>
      <p style="margin:10px 0 0">${passing ? 'Above your target. Keep the habit.' : `${(TARGET - entry.points).toFixed(1)} points to go. The sections below show where.`}</p>
    </div>
    <div class="card"><h3>By section</h3>${rows}</div>
    ${wrong.length ? `<div class="card"><h3>What to review (${wrong.length})</h3>${wrong.map(({ w, q }) => `
      <div class="concept">
        ${q.passage ? `<div class="small muted" style="margin-bottom:4px">${esc(q.passage.slice(0, 90))}…</div>` : ''}
        <div class="it">${promptHtml(q, q.options[q.answer], 'good')}</div>
        <div class="small muted">${w.chosen === null ? 'Not answered' : `You chose: ${esc(q.options[w.chosen])}`}</div>
        <div class="note">${esc(q.explain)}</div>
      </div>`).join('')}</div>` : '<p class="muted">Nothing to review. A perfect paper.</p>'}
    <a class="btn block" href="#/exam/mock">Back to mock exams</a>`;
}
