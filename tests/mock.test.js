import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildExam } from '../tools/build-exam.js';
import { seeded } from '../generators/util.js';
import { MOCK_SIZES, buildMock, scoreMock, totalOf } from '../engine/mock.js';
import { mockEstimate, practiceEstimate } from '../engine/estimate.js';
import { EXAM_SECTIONS } from '../engine/schema.js';

const questions = buildExam();
const byId = new Map(questions.map((q) => [q.id, q]));
const none = new Map();

test('the full mock mirrors the real paper: 80 questions in the real section proportions', () => {
  assert.equal(totalOf('full'), 80);
  assert.deepEqual(MOCK_SIZES.full.counts, EXAM_SECTIONS);
  const m = buildMock({ questions, size: 'full', history: none, rng: seeded(1) });
  assert.equal(m.ids.length, 80);
  assert.equal(new Set(m.ids).size, 80);
  const by = {};
  for (const id of m.ids) by[byId.get(id).section] = (by[byId.get(id).section] || 0) + 1;
  assert.deepEqual(by, EXAM_SECTIONS);
  assert.equal(m.minutes, 180);
});

test('sections come in paper order and passages stay whole and in order', () => {
  const m = buildMock({ questions, size: 'full', history: none, rng: seeded(2) });
  const order = Object.keys(EXAM_SECTIONS);
  const secs = m.ids.map((id) => order.indexOf(byId.get(id).section));
  assert.deepEqual(secs, [...secs].sort((a, b) => a - b));
  for (const section of ['cloze', 'reading']) {
    const qs = m.ids.map((id) => byId.get(id)).filter((q) => q.section === section);
    const groups = new Map();
    for (const q of qs) groups.set(q.group, (groups.get(q.group) || 0) + 1);
    for (const n of groups.values()) assert.equal(n, section === 'cloze' ? 5 : 4);
    // each group is contiguous
    const seq = qs.map((q) => q.group);
    assert.deepEqual(seq, [...new Set(seq)].flatMap((g) => seq.filter((x) => x === g)));
  }
});

test('half mock has about 40 questions and prefers material you have not answered yet', () => {
  const first = buildMock({ questions, size: 'half', history: none, rng: seeded(3) });
  assert.equal(first.ids.length, totalOf('half'));
  const history = new Map(first.ids.map((id) => [id, { n: 1, lastCorrect: true, lastAt: 1 }]));
  const second = buildMock({ questions, size: 'half', history, rng: seeded(4) });
  assert.equal(second.ids.filter((id) => first.ids.includes(id)).length, 0);
});

test('scoring: unanswered and wrong both count against you; points are share correct x 100', () => {
  const m = buildMock({ questions, size: 'full', history: none, rng: seeded(5) });
  const answers = {};
  m.ids.slice(0, 60).forEach((id) => { answers[id] = byId.get(id).answer; });
  m.ids.slice(60, 70).forEach((id) => { answers[id] = (byId.get(id).answer + 1) % 5; });
  const r = scoreMock(byId, m.ids, answers);
  assert.equal(r.total, 80);
  assert.equal(r.correct, 60);
  assert.equal(r.points, 75);
  assert.equal(r.wrong.length, 20);
  assert.equal(r.wrong.filter((w) => w.chosen === null).length, 10);
  assert.equal(Object.values(r.bySection).reduce((a, s) => a + s.t, 0), 80);
});

test('mock estimate averages the last three, weighted by length', () => {
  assert.equal(mockEstimate([]), null);
  const e = mockEstimate([
    { points: 30, correct: 24, total: 80 }, { points: 50, correct: 40, total: 80 },
    { points: 55, correct: 44, total: 80 }, { points: 60, correct: 48, total: 80 },
  ]);
  assert.equal(e.count, 3);
  assert.equal(e.points, 55);
  assert.equal(e.best, 60);
  assert.equal(e.latest, 60);
});

test('practice estimate needs 10 answers in a section and reports how much of the paper it covers', () => {
  const mk = (section, n, rightN) => Array.from({ length: n }, (_, i) => ({ qid: `${section}${i}`, section, correct: i < rightN, at: i }));
  assert.equal(practiceEstimate([...mk('vocab', 9, 9), ...mk('drill', 50, 50)]), null);
  const e = practiceEstimate([...mk('reading', 20, 10), ...mk('grammar', 10, 10)]);
  // reading weight 20 at 50%, grammar weight 10 at 100% -> (10 + 10) / 30 = 66.7
  assert.equal(e.points, 66.7);
  assert.equal(e.coverage, 30 / 80);
});
