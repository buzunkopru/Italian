import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topicStats, sectionStats, weakestTopic } from '../engine/mastery.js';

const DAY = 86400000;
const now = Date.UTC(2026, 9, 11);
const ans = (topic, correct, daysAgo = 0, section = 'drill') => ({ qid: Math.random() + '', topic, section, correct, at: now - daysAgo * DAY });

test('accuracy is the fraction correct when answers are equally recent', () => {
  const s = topicStats([ans('t', true), ans('t', true), ans('t', false), ans('t', false)], now);
  assert.equal(s.get('t').n, 4);
  assert.ok(Math.abs(s.get('t').acc - 0.5) < 1e-9);
});

test('recent answers count more than old ones', () => {
  const improving = topicStats([ans('t', false, 60), ans('t', false, 60), ans('t', true, 0), ans('t', true, 0)], now).get('t').acc;
  const declining = topicStats([ans('t', true, 60), ans('t', true, 60), ans('t', false, 0), ans('t', false, 0)], now).get('t').acc;
  assert.ok(improving > 0.9);
  assert.ok(declining < 0.1);
});

test('sectionStats groups by exam section', () => {
  const s = sectionStats([ans('a', true, 0, 'grammar'), ans('b', false, 0, 'vocab')], now);
  assert.equal(s.get('grammar').acc, 1);
  assert.equal(s.get('vocab').acc, 0);
});

test('weakestTopic needs enough answers, honours exclude, breaks ties by least recent', () => {
  const list = [];
  for (let i = 0; i < 6; i++) list.push(ans('good', true), ans('bad', i < 1), ans('few', false));
  list.length = list.length; // 'few' has 6 answers too; make it small below
  const m = topicStats(list.filter((a) => a.topic !== 'few').concat([ans('few', false), ans('few', false)]), now);
  assert.equal(weakestTopic(m, { minN: 5 }), 'bad');
  assert.equal(weakestTopic(m, { minN: 5, exclude: ['bad'] }), 'good');
  assert.equal(weakestTopic(new Map(), { minN: 5 }), null);
  const tie = topicStats([...Array(5)].flatMap(() => [ans('x', false, 1), ans('y', false, 9)]), now);
  assert.equal(weakestTopic(tie), 'y');
});
