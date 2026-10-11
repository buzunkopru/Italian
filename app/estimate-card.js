// The "Estimated YDS score" card shown on Today and Progress.
import { mockEstimate, practiceEstimate, TARGET } from '../engine/estimate.js';

export async function estimateCard(storage, answers) {
  const mocks = await storage.getSetting('mocks', []);
  const m = mockEstimate(mocks);
  const p = practiceEstimate(answers);
  const gauge = (pts) => `<div class="bar"><div class="${pts >= TARGET ? 'g' : pts < TARGET - 15 ? 'r' : ''}" style="width:${Math.min(100, pts)}%"></div></div>`;
  let body;
  if (m) {
    body = `<div class="row between"><b style="font-size:1.6rem">${m.points}</b><span class="muted small">average of your last ${m.count} mock${m.count > 1 ? 's' : ''} · best ${m.best}</span></div>${gauge(m.points)}
      <p class="small muted" style="margin:6px 0 0">Target ${TARGET}. ${m.points >= TARGET ? 'You are above it.' : `${(TARGET - m.points).toFixed(1)} to go.`}</p>`;
    if (p) body += `<p class="small muted" style="margin:6px 0 0">Practice accuracy alone suggests about ${Math.round(p.points)}; practice usually runs higher than a timed paper.</p>`;
  } else if (p) {
    body = `<div class="row between"><b style="font-size:1.6rem">≈ ${Math.round(p.points)}</b><span class="muted small">from exam-section practice, covering ${Math.round(p.coverage * 100)}% of the paper</span></div>${gauge(p.points)}
      <p class="small muted" style="margin:6px 0 0">Untimed practice runs higher than a real exam. Take a mock exam for a truer number.</p>`;
  } else {
    body = '<p class="muted" style="margin:0">Not enough data yet. Practise the Exam sections or take a mock exam.</p>';
  }
  return `<a class="card tap" href="#/exam/mock" style="display:block"><h3>Estimated YDS score</h3>${body}</a>`;
}
