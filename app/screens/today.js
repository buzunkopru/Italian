import { currentStreak } from '../../engine/streak.js';
import { localDay } from '../../engine/dates.js';
import { loadAllLessons } from '../content.js';
import { build } from './session.js';
import { esc } from '../util.js';
import { estimateCard } from '../estimate-card.js';

export async function render(root, ctx) {
  const { storage } = ctx;
  const today = localDay();
  const streakState = await storage.getSetting('streak');
  const answers = await storage.getAnswers();
  const todayCount = answers.filter((a) => localDay(new Date(a.at)) === today).length;

  const [{ session }, short, lessons, read] = await Promise.all([
    build(ctx, 'full'),
    build(ctx, 'short'),
    loadAllLessons(),
    storage.getSetting('lessonsRead', {}),
  ]);
  const done = await storage.getSetting('sessionDone');
  const doneToday = !!done && done.day === today;
  const due = (session.groups.find((g) => g.id === 'review') || { refs: [] }).refs.length;
  const next = lessons.find((l) => !(read || {})[l.id]);
  const minutes = Math.max(2, Math.round(session.total * 0.45));

  root.innerHTML = `
    ${storage.persistent ? '' : `<div class="warn-banner">⚠️ This browser is not saving your progress. Add Mille to your Home Screen, or export a backup often.</div>`}
    <h1>Ciao! 👋</h1>
    <p class="muted">Goal: 55+ on the YDS. One small step every day.</p>

    <div class="stats">
      <div class="stat"><b>🔥 ${currentStreak(streakState, today)}</b><span>day streak</span></div>
      <div class="stat"><b>🧠 ${due}</b><span>reviews due</span></div>
      <div class="stat"><b>✅ ${todayCount}</b><span>answered today</span></div>
    </div>

    <div class="card">
      <h2>Today's session</h2>
      ${doneToday ? `<p style="color:var(--good);font-weight:700">✓ Done for today. Nice work!</p><p class="muted small">Want more? You can keep going.</p>` : ''}
      ${session.total ? `
        <p class="muted">${session.total} questions · about ${minutes} min</p>
        <ul class="plan">${session.groups.map((g) => `<li><span>${esc(g.title)}</span><b>${g.refs.length}</b></li>`).join('')}</ul>
        <a class="btn ${doneToday ? 'ghost ' : ''}block" href="#/session">${doneToday ? 'Do another session' : 'Start session'}</a>
        <div style="height:8px"></div>
        <a class="btn ghost block" href="#/session/short">5-minute version (${short.session.total})</a>`
        : `<p class="muted">Nothing to do right now. Browse the lessons or words.</p>`}
    </div>

    ${next ? `<a class="card tap" href="#/learn/${next.level}/${esc(next.id)}">
      <div class="row between"><div><span class="pill">Next lesson</span><h3 style="margin:6px 0 0">${esc(next.id)} ${esc(next.title)}</h3></div><span>›</span></div></a>` : ''}

    ${await estimateCard(storage, answers)}`;
}
