import { loadBank } from '../bank.js';
import { loadAllLessons, loadWords } from '../content.js';
import { runQuiz } from '../quiz.js';
import { makeResolver } from '../resolve.js';
import { buildSession } from '../../engine/session.js';
import { localDay } from '../../engine/dates.js';

export async function build(ctx, mode) {
  const [bank, words, lessons, answers, srs, lessonsRead] = await Promise.all([
    loadBank(), loadWords(), loadAllLessons(), ctx.storage.getAnswers(), ctx.storage.getAllSrs(), ctx.storage.getSetting('lessonsRead', {}),
  ]);
  const session = buildSession({ today: localDay(), now: Date.now(), srs, answers, questions: bank.questions, words, lessons, lessonsRead: lessonsRead || {}, mode });
  return { session, bank, words, srs };
}

export async function render(root, ctx, params) {
  const mode = params[0] === 'short' ? 'short' : 'full';
  const { session, bank, words, srs } = await build(ctx, mode);
  const exit = () => { location.hash = '#/today'; };

  const items = session.groups.flatMap((g) => g.refs.map((ref) => ({ ref, heading: g.title })));
  runQuiz(root, ctx, {
    title: mode === 'short' ? '5-minute session' : "Today's session",
    items,
    resolve: makeResolver({ bank, words, srs }),
    onExit: exit,
    onFinish: () => ctx.storage.setSetting('sessionDone', { day: localDay(), mode }),
  });
}
