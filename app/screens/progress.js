import { loadAllLessons, loadTopics } from '../content.js';
import { esc } from '../util.js';
import { topicStats } from '../../engine/mastery.js';
import { localDay, addDays } from '../../engine/dates.js';

const WORD_LEVEL = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2' };

export async function render(root, ctx) {
  const [answers, lessons, srs, topics] = await Promise.all([ctx.storage.getAnswers(), loadAllLessons(), ctx.storage.getAllSrs(), loadTopics()]);
  if (!answers.length) {
    root.innerHTML = `<h1>Progress</h1><div class="empty"><div style="font-size:2.4rem">📈</div><p>Answer a few questions and your progress shows up here.</p><a class="btn" href="#/practice">Start practising</a></div>`;
    return;
  }

  const titleOf = (topic) => {
    const l = lessons.find((x) => x.topic === topic);
    if (l) return `${l.id} ${l.title}`;
    if (topics[topic]) return topics[topic];
    const m = /^words\.stage(\d)$/.exec(topic);
    if (m) return `Words · ${WORD_LEVEL[m[1]]}`;
    return topic;
  };

  const right = answers.filter((a) => a.correct).length;
  const stats = [...topicStats(answers).entries()].sort((a, b) => a[1].acc - b[1].acc);

  const today = localDay();
  const days = [...Array(14)].map((_, i) => addDays(today, i - 13));
  const perDay = Object.fromEntries(days.map((d) => [d, 0]));
  for (const a of answers) {
    const d = localDay(new Date(a.at));
    if (d in perDay) perDay[d]++;
  }
  const max = Math.max(1, ...Object.values(perDay));
  const boxes = [1, 2, 3, 4, 5].map((b) => Object.values(srs).filter((s) => s.box === b).length);

  root.innerHTML = `
    <h1>Progress</h1>
    <div class="stats">
      <div class="stat"><b>${answers.length}</b><span>answers</span></div>
      <div class="stat"><b>${Math.round((right / answers.length) * 100)}%</b><span>correct</span></div>
      <div class="stat"><b>${Object.keys(srs).length}</b><span>in reviews</span></div>
    </div>

    <div class="card">
      <h3>Last 14 days</h3>
      <div class="bars">${days.map((d) => `<div class="b" title="${d}: ${perDay[d]}"><i style="height:${(perDay[d] / max) * 100}%"></i></div>`).join('')}</div>
    </div>

    <div class="card">
      <h3>Review boxes</h3>
      <div class="boxes">${boxes.map((n, i) => `<div><b>${n}</b><span>box ${i + 1}</span></div>`).join('')}</div>
      <p class="small muted" style="margin:8px 0 0">Items move right as you remember them. Box 5 means about 5 weeks until the next review.</p>
    </div>

    <div class="card">
      <h3>Topics, weakest first</h3>
      ${stats.map(([topic, s]) => `
        <div class="topic">
          <div class="row between"><span class="grow">${esc(titleOf(topic))}</span><b>${Math.round(s.acc * 100)}%</b></div>
          <div class="bar"><div class="${s.acc >= 0.8 ? 'g' : s.acc < 0.5 ? 'r' : ''}" style="width:${Math.round(s.acc * 100)}%"></div></div>
          <span class="small muted">${s.n} answers</span>
        </div>`).join('')}
    </div>

    <div class="card">
      <h3>Estimated YDS score</h3>
      <p class="muted" style="margin:0">Shown once you answer exam-style questions (steps 5–6).</p>
    </div>`;
}
