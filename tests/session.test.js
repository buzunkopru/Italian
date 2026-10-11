import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSession } from '../engine/session.js';
import { seeded, makeQ } from './helpers.js';

const words = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => ({ id: `w${i}`, word: `w${i}`, en: `e${i}`, stage: i > 10 ? 2 : 1, category: 'Verbs' }));
const questions = [
  ...[...Array(12)].map((_, i) => makeQ(`l1-${i}`, 'lesson.1.1')),
  ...[...Array(12)].map((_, i) => makeQ(`l2-${i}`, 'lesson.1.2')),
  ...[...Array(12)].map((_, i) => makeQ(`l3-${i}`, 'lesson.1.3')),
];
const lessons = [{ id: '1.1', topic: 'lesson.1.1' }, { id: '1.2', topic: 'lesson.1.2' }, { id: '1.3', topic: 'lesson.1.3' }];
const base = { today: '2026-10-11', now: Date.UTC(2026, 9, 11), srs: {}, answers: [], questions, words, lessons, lessonsRead: {}, rng: seeded(5) };
const allRefs = (s) => s.groups.flatMap((g) => g.refs);

test('a brand-new user gets new words and mixed practice only', () => {
  const s = buildSession(base);
  assert.deepEqual(s.groups.map((g) => g.id), ['words', 'weak']);
  assert.equal(s.groups[0].refs.length, 10);
  assert.ok(s.groups[0].refs.every((r) => r.startsWith('w:')));
  assert.equal(s.groups[1].title, 'Mixed practice');
});

test('due reviews come first, are capped, and nothing appears twice', () => {
  const srs = {};
  for (let i = 1; i <= 25; i++) srs[`w:w${(i % 12) + 1}`] = { box: 1, due: '2026-10-01', reps: 1, lapses: 0 };
  srs['l1-0'] = { box: 2, due: '2026-10-05', reps: 1, lapses: 1 };
  srs['ghost-question'] = { box: 1, due: '2026-10-01', reps: 1, lapses: 0 }; // content removed
  const s = buildSession({ ...base, srs });
  assert.equal(s.groups[0].id, 'review');
  assert.ok(s.groups[0].refs.length <= 20);
  assert.ok(!allRefs(s).includes('q:ghost-question'));
  assert.equal(new Set(allRefs(s)).size, allRefs(s).length);
});

test('drills the most recently read lesson, only unseen or missed questions', () => {
  const answers = [...Array(8)].map((_, i) => ({ qid: `l1-${i}`, topic: 'lesson.1.1', section: 'drill', correct: true, at: 1 }));
  const s = buildSession({ ...base, answers, lessonsRead: { '1.1': 100, '1.2': 200 } });
  const g = s.groups.find((x) => x.id === 'lesson');
  assert.match(g.title, /1\.2/);
  assert.ok(g.refs.every((r) => r.startsWith('q:l2-')));
});

test('weak topic is chosen from answer history', () => {
  const answers = [];
  for (let i = 0; i < 6; i++) {
    answers.push({ qid: `l1-${i}`, topic: 'lesson.1.1', section: 'drill', correct: true, at: base.now });
    answers.push({ qid: `l3-${i}`, topic: 'lesson.1.3', section: 'drill', correct: false, at: base.now });
  }
  const s = buildSession({ ...base, answers });
  const weak = s.groups.find((g) => g.id === 'weak');
  assert.equal(weak.title, 'Weak spot');
  assert.ok(weak.refs.every((r) => r.startsWith('q:l3-')));
});

test('short mode is reviews plus weak spot only', () => {
  const srs = { 'w:w1': { box: 1, due: '2026-10-01', reps: 1, lapses: 0 } };
  const s = buildSession({ ...base, srs, mode: 'short' });
  assert.ok(s.groups.every((g) => ['review', 'weak'].includes(g.id)));
  assert.ok(s.total <= 15);
});

test('exam set only uses verified exam-section questions', () => {
  const exam = [
    { ...makeQ('e1', 'lesson.1.1'), section: 'grammar', options: ['a', 'b', 'c', 'd', 'e'], verified: false },
    { ...makeQ('e2', 'lesson.1.1'), section: 'grammar', options: ['a', 'b', 'c', 'd', 'e'], verified: true },
  ];
  const s = buildSession({ ...base, questions: [...questions, ...exam] });
  const g = s.groups.find((x) => x.id === 'exam');
  assert.deepEqual(g.refs, ['q:e2']);
});

test('an empty bank and deck gives an empty session, not a crash', () => {
  const s = buildSession({ ...base, questions: [], words: [] });
  assert.equal(s.total, 0);
});
