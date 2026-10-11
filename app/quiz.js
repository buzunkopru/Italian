// The one-question-at-a-time runner used by Practice and the daily session.
import { esc } from './util.js';
import { shuffleOptions } from '../engine/picker.js';
import { review } from '../engine/srs.js';
import { localDay } from '../engine/dates.js';

const blankHtml = (text, state = '') =>
  `<span class="blank ${state}">${text ? esc(text) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span>`;

function promptHtml(q, fill, state) {
  const safe = esc(q.prompt);
  if (!safe.includes('----')) return safe;
  // "all'" + " uomo" reads "all'uomo": drop the space after an apostrophe
  const joinNext = fill && /['’]$/.test(fill);
  return safe.replace(joinNext ? /---- ?/ : /----/, blankHtml(fill, state));
}

/**
 * @param {HTMLElement} root
 * @param {object} ctx  { storage, toast, touchStreak }
 * @param {object} cfg
 * @param {{ref:string, heading?:string}[]} cfg.items
 * @param {(ref:string)=>object|null} cfg.resolve  ref -> question (may carry srsKey / isWord)
 * @param {string} cfg.title
 * @param {()=>void} cfg.onExit  leave the quiz (back button / finish)
 * @param {({right:number,total:number})=>void} [cfg.onFinish]  called once when the round ends
 * @param {{label:string, run:()=>void}} [cfg.again]
 */
export function runQuiz(root, ctx, cfg) {
  const { storage } = ctx;
  const queue = cfg.items.map((i) => ({ ...i }));
  const total = queue.length;
  let pos = 0;
  let right = 0;
  let firstTry = 0;
  const missed = [];
  let retried = false;

  async function save(q, correct, ms) {
    await storage.recordAnswer({ qid: q.id, section: q.section, topic: q.topic, correct, ms });
    const key = q.srsKey || q.id;
    const existing = await storage.getSrs(key);
    if (q.isWord || existing || !correct) {
      await storage.putSrs(key, review(existing, correct, localDay()));
    }
    await ctx.touchStreak();
  }

  function finish() {
    if (cfg.onFinish) cfg.onFinish({ right, total });
    const pct = firstTry && total ? Math.round((right / total) * 100) : 0;
    root.innerHTML = `
      <h1>${esc(cfg.title)}</h1>
      <div class="card" style="text-align:center">
        <div style="font-size:2.4rem">${pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h2>${right} / ${total} right first time</h2>
        <p class="muted">${pct >= 80 ? 'Great round!' : 'Missed ones will come back in your reviews.'}</p>
      </div>
      ${missed.length ? `<div class="card"><h3>To remember</h3>${missed.map((m) => `
        <div class="concept"><div class="it">${promptHtml(m.q, m.q.options[m.q.answer], 'good')}</div>
        <div class="note">${esc(m.q.explain)}</div></div>`).join('')}</div>` : ''}
      ${cfg.again ? `<button class="btn block" id="again">${esc(cfg.again.label)}</button><div style="height:10px"></div>` : ''}
      <button class="btn ghost block" id="done">Done</button>`;
    root.querySelector('#done').addEventListener('click', cfg.onExit);
    const again = root.querySelector('#again');
    if (again) again.addEventListener('click', cfg.again.run);
  }

  function show() {
    if (pos >= queue.length) {
      if (!retried && missed.length) {
        // ask each missed question once more at the end (not recorded again)
        retried = true;
        missed.forEach((m) => queue.push({ ref: m.ref, retry: true, heading: 'Second try' }));
      } else return finish();
    }
    const item = queue[pos];
    const base = cfg.resolve(item.ref);
    if (!base) { pos++; return show(); }
    const q = shuffleOptions(base);
    const started = Date.now();
    const answered = Math.min(pos, total);

    root.innerHTML = `
      <div class="row between" style="margin-bottom:8px">
        <button class="chip" id="exit" aria-label="Exit">✕</button>
        <span class="small muted">${item.heading ? esc(item.heading) : esc(cfg.title)}</span>
        <span class="small muted">${Math.min(answered + 1, queue.length)}/${queue.length}</span>
      </div>
      <div class="bar"><div style="width:${(pos / queue.length) * 100}%"></div></div>
      ${q.passage ? `<div class="card passage">${esc(q.passage)}</div>` : ''}
      <div class="card qcard"><div class="qtext${q.prompt.length > 140 ? " long" : ""}" id="qtext">${promptHtml(q)}</div></div>
      <div class="opts" id="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>
      <div id="fb"></div>`;

    root.querySelector('#exit').addEventListener('click', () => {
      if (pos === 0 || confirm('Leave this round? Answers so far are saved.')) cfg.onExit();
    });

    const opts = root.querySelector('#opts');
    opts.addEventListener('click', async (e) => {
      const btn = e.target.closest('.opt');
      if (!btn || opts.dataset.done) return;
      opts.dataset.done = '1';
      const chosen = Number(btn.dataset.i);
      const correct = chosen === q.answer;
      opts.querySelectorAll('.opt').forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) b.classList.add('correct');
      });
      if (!correct) btn.classList.add('wrong');
      root.querySelector('#qtext').innerHTML = promptHtml(q, q.options[q.answer], correct ? 'good' : 'bad');

      if (!item.retry) {
        firstTry++;
        if (correct) right++; else missed.push({ ref: item.ref, q });
        try { await save(q, correct, Date.now() - started); } catch (err) { console.error(err); ctx.toast('Could not save this answer.'); }
      }

      const last = pos + 1 >= queue.length && (retried || !missed.length);
      const fb = root.querySelector('#fb');
      fb.innerHTML = `
        <div class="feedback ${correct ? 'ok' : 'no'}">
          <b>${correct ? '✓ Correct' : '✗ Not quite'}</b>
          <div>${esc(q.explain)}</div>
          ${q.translation ? `<div class="muted small" style="margin-top:4px">${esc(q.translation)}</div>` : ''}
        </div>
        <div class="row between" style="margin-top:10px">
          <button class="chip" id="report">⚑ Report</button>
          <button class="btn" id="next">${last ? 'Finish' : 'Next'} →</button>
        </div>`;
      fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      fb.querySelector('#report').addEventListener('click', async (ev) => {
        await storage.addReport({ qid: q.id });
        ev.target.disabled = true;
        ev.target.textContent = '⚑ Reported';
      });
      fb.querySelector('#next').addEventListener('click', () => { pos++; show(); });
    });
  }

  if (!queue.length) {
    root.innerHTML = `<div class="empty"><p>No questions available here yet.</p><button class="btn" id="back">Back</button></div>`;
    root.querySelector('#back').addEventListener('click', cfg.onExit);
    return;
  }
  show();
}
