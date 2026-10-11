import { currentStreak, localDay } from '../../engine/streak.js';
import { toast } from '../util.js';

export async function render(root, ctx) {
  const { storage } = ctx;
  const today = localDay();
  const streakState = await storage.getSetting('streak');
  const srs = await storage.getAllSrs();
  const due = Object.values(srs).filter((s) => s.due && s.due <= today).length;
  const answers = await storage.getAnswers();
  const todayCount = answers.filter((a) => localDay(new Date(a.at)) === today).length;

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
      <p class="muted">About 20 minutes: reviews, a new lesson step, a weak-spot drill and an exam set.</p>
      <button class="btn block" id="start">Start today's session</button>
      <p class="small muted" style="margin:10px 0 0">The daily session is built in step 2. For now you can read the lessons and browse the words.</p>
    </div>

    <div class="card">
      <h3>Estimated YDS score</h3>
      <p class="muted" style="margin:0">Not enough data yet. It appears after you answer exam-style questions.</p>
    </div>

    <a class="card tap" href="#/learn">
      <div class="row between"><div><h3>Continue learning</h3><span class="muted small">44 lessons, A1 to B2</span></div><span>›</span></div>
    </a>`;

  root.querySelector('#start').addEventListener('click', () => toast('Coming in step 2 — drills & daily session.'));
}
