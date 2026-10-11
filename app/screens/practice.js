import { loadBank } from '../bank.js';
import { loadAllLessons, loadWords, loadTopics } from '../content.js';
import { runQuiz } from '../quiz.js';
import { makeResolver } from '../resolve.js';
import { esc } from '../util.js';
import { topicStats } from '../../engine/mastery.js';
import { pickQuestions, historyOf } from '../../engine/picker.js';

const ROUND = 10;

export async function render(root, ctx, params) {
  const [topic] = params;
  if (!topic) return renderList(root, ctx);
  return renderRound(root, ctx, topic);
}

async function renderList(root, ctx) {
  const [bank, lessons, answers, topics] = await Promise.all([loadBank(), loadAllLessons(), ctx.storage.getAnswers(), loadTopics()]);
  const stats = topicStats(answers);
  const count = (t) => bank.questions.filter((q) => q.topic === t && q.section === 'drill').length;

  const accOf = (t) => {
    const s = stats.get(t);
    return s ? `<span class="pill ${s.acc >= 0.8 ? 'ok' : s.acc < 0.5 ? 'bad' : ''}">${Math.round(s.acc * 100)}%</span>` : '';
  };

  const extra = Object.entries(topics).map(([t, title]) => {
    const n = count(t);
    return n ? `<a class="card tap" href="#/practice/${esc(t)}"><div class="row"><div class="grow"><b>${esc(title)}</b><div class="muted small">${n} real sentences</div></div>${accOf(t)}</div></a>` : '';
  }).join('');

  let lastLevel = 0;
  const rows = lessons.map((l) => {
    const n = count(l.topic);
    const head = l.level !== lastLevel ? `<h3 class="sechead">Level ${l.level}</h3>` : '';
    lastLevel = l.level;
    return `${head}${n
      ? `<a class="card tap" href="#/practice/${esc(l.topic)}"><div class="row"><div class="num">${esc(l.id)}</div><div class="grow"><b>${esc(l.title)}</b><div class="muted small">${n} questions</div></div>${accOf(l.topic)}</div></a>`
      : `<div class="card dim"><div class="row"><div class="num">${esc(l.id)}</div><div class="grow"><b>${esc(l.title)}</b><div class="muted small">Questions coming soon</div></div></div></div>`}`;
  }).join('');

  root.innerHTML = `
    <h1>Practice</h1>
    <p class="muted">Quick rounds of ${ROUND}. Pick a topic, or mix.</p>
    <a class="card tap" href="#/practice/mixed"><div class="row between"><div><h3 style="margin:0">🎲 Mixed practice</h3><span class="muted small">${bank.questions.filter((q) => q.section === 'drill').length} questions, all topics</span></div><span>›</span></div></a>
    <a class="card tap" href="#/practice/words"><div class="row between"><div><h3 style="margin:0">📖 Vocabulary round</h3><span class="muted small">1,000-word deck, new words first</span></div><span>›</span></div></a>
    <h3 class="sechead">Cloze with real sentences</h3>
    ${extra}
    ${rows}`;
}

async function renderRound(root, ctx, topic) {
  const [bank, words, answers, srs] = await Promise.all([loadBank(), loadWords(), ctx.storage.getAnswers(), ctx.storage.getAllSrs()]);
  const resolve = makeResolver({ bank, words, srs });
  const again = () => renderRound(root, ctx, topic);
  const exit = () => { location.hash = '#/practice'; };

  let items;
  let title;
  if (topic === 'words') {
    title = 'Vocabulary round';
    const fresh = words.filter((w) => !srs[`w:${w.id}`]).sort((a, b) => a.stage - b.stage).slice(0, ROUND);
    const rest = words.filter((w) => srs[`w:${w.id}`]).sort((a, b) => srs[`w:${a.id}`].due.localeCompare(srs[`w:${b.id}`].due));
    items = [...fresh, ...rest].slice(0, ROUND).map((w) => ({ ref: `w:${w.id}` }));
  } else {
    const pool = bank.questions.filter((q) => q.section === 'drill' && (topic === 'mixed' || q.topic === topic));
    const lessons = await loadAllLessons();
    const l = lessons.find((x) => x.topic === topic);
    const topics = await loadTopics();
    title = topic === 'mixed' ? 'Mixed practice' : l ? `Lesson ${l.id}` : topics[topic] || topic;
    items = pickQuestions({ pool, history: historyOf(answers), n: ROUND }).map((q) => ({ ref: `q:${q.id}` }));
  }

  runQuiz(root, ctx, { title, items, resolve, onExit: exit, again: { label: `Another ${ROUND}`, run: again } });
}
