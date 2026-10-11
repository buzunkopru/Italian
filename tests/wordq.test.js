import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wordQuestion } from '../engine/wordq.js';
import { seeded } from './helpers.js';

const words = JSON.parse(readFileSync(new URL('../content/words.json', import.meta.url), 'utf8'));

test('every word makes a valid question in both directions', () => {
  const rng = seeded(7);
  for (const dir of ['it-en', 'en-it']) {
    for (const w of words) {
      const q = wordQuestion(w, words, dir, rng);
      assert.equal(q.options.length, 4, `${w.id} ${dir}`);
      assert.equal(new Set(q.options).size, 4, `dupes for ${w.id} ${dir}`);
      const expected = dir === 'it-en' ? w.en : `${w.article ? `${w.article} ` : ''}${w.word}`;
      assert.equal(q.options[q.answer], expected, `${w.id} ${dir}`);
      assert.equal(q.srsKey, `w:${w.id}`);
    }
  }
});

test('distractors prefer the same category and stage', () => {
  const w = words.find((x) => x.id === 'fare');
  const q = wordQuestion(w, words, 'it-en', seeded(2));
  const cats = q.options.filter((o) => o !== w.en).map((o) => words.find((x) => x.en === o).category);
  assert.ok(cats.every((c) => c === 'Verbs'));
});
