// Turn a vocabulary card into a multiple-choice question.
import { shuffle } from './picker.js';

export const wordKey = (w) => `w:${w.id}`;
const show = (w) => `${w.article ? `${w.article} ` : ''}${w.word}`;

/**
 * @param {object} word  card from words.json
 * @param {object[]} words  the whole deck (for distractors)
 * @param {'it-en'|'en-it'} dir
 */
export function wordQuestion(word, words, dir = 'it-en', rng = Math.random) {
  const textOf = dir === 'it-en' ? (w) => w.en : show;
  const correct = textOf(word);

  const same = (w) => w.id !== word.id && textOf(w) !== correct;
  const near = words.filter((w) => same(w) && w.category === word.category && w.stage === word.stage);
  const cat = words.filter((w) => same(w) && w.category === word.category);
  const any = words.filter(same);

  const chosen = [];
  const seen = new Set([correct]);
  for (const pool of [near, cat, any]) {
    for (const w of shuffle(pool, rng)) {
      if (chosen.length === 3) break;
      const t = textOf(w);
      if (!seen.has(t)) { seen.add(t); chosen.push(t); }
    }
    if (chosen.length === 3) break;
  }

  const options = shuffle([correct, ...chosen], rng);
  const ex = word.exampleIt ? ` Example: ${word.exampleIt} (${word.exampleEn})` : '';
  return {
    id: `${wordKey(word)}:${dir}`,
    srsKey: wordKey(word),
    section: 'drill',
    topic: `words.stage${word.stage}`,
    level: word.stage,
    prompt: dir === 'it-en' ? `${show(word)} — what does it mean?` : `Which Italian word means “${word.en}”?`,
    options,
    answer: options.indexOf(correct),
    explain: `${show(word)} = ${word.en}.${ex}`,
    source: 'generated',
    verified: true,
    isWord: true,
  };
}
