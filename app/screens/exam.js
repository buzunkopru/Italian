// Exam tab: practise one YDS section at a time (full timed mocks come later).
import { loadBank } from '../bank.js';
import { loadWords } from '../content.js';
import { runQuiz } from '../quiz.js';
import { makeResolver } from '../resolve.js';
import { esc } from '../util.js';
import { pickQuestions, historyOf } from '../../engine/picker.js';
import { EXAM_SECTIONS } from '../../engine/schema.js';

const SECTIONS = {
  vocab: ['Vocabulary in context', 'One word fits the sentence.', 10],
  cloze: ['Passage cloze', 'A short paragraph, one blank at a time.', 5],
  grammar: ['Grammar', 'Choose the correct form.', 10],
  completion: ['Sentence completion', 'Finish the sentence.', 10],
  translation: ['Translation', 'Pick the best equivalent sentence.', 10],
  dialogue: ['Dialogue completion', 'Complete the conversation.', 5],
  paraphrase: ['Paraphrase', 'Same meaning, different words.', 5],
  paragraph: ['Paragraph completion', 'Find the missing sentence.', 5],
  irrelevant: ['Irrelevant sentence', 'Spot the one that does not belong.', 5],
  reading: ['Reading passages', 'A text and questions about it.', 5],
};

export async function render(root, ctx, params) {
  const [section] = params;
  if (section && SECTIONS[section]) return renderRound(root, ctx, section);
  const bank = await loadBank();
  const count = (s) => bank.questions.filter((q) => q.section === s && q.verified).length;
  const rows = Object.keys(EXAM_SECTIONS).map((s) => {
    const [title, hint] = SECTIONS[s];
    const n = count(s);
    return n
      ? `<a class="card tap" href="#/exam/${s}"><div class="row"><div class="grow"><b>${esc(title)}</b><div class="muted small">${esc(hint)} · ${n} questions</div></div><span>›</span></div></a>`
      : `<div class="card dim"><div class="row"><div class="grow"><b>${esc(title)}</b><div class="muted small">Coming soon · ${EXAM_SECTIONS[s]} of 80 questions in the real exam</div></div></div></div>`;
  }).join('');
  root.innerHTML = `<h1>Exam</h1><p class="muted">Practise one part of the YDS paper at a time. Full timed mock exams arrive later.</p>${rows}`;
}

async function renderRound(root, ctx, section) {
  const [bank, words, answers, srs] = await Promise.all([loadBank(), loadWords(), ctx.storage.getAnswers(), ctx.storage.getAllSrs()]);
  const [title, , n] = SECTIONS[section];
  const pool = bank.questions.filter((q) => q.section === section && q.verified);
  const items = pickQuestions({ pool, history: historyOf(answers), n }).map((q) => ({ ref: `q:${q.id}` }));
  runQuiz(root, ctx, {
    title,
    items,
    resolve: makeResolver({ bank, words, srs }),
    onExit: () => { location.hash = '#/exam'; },
    again: { label: `Another ${n}`, run: () => renderRound(root, ctx, section) },
  });
}
