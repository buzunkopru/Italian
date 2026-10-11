// Turns session/round references ('q:<id>' or 'w:<wordId>') into question objects.
import { wordQuestion } from '../engine/wordq.js';

export function makeResolver({ bank, words, srs = {} }) {
  const wById = new Map(words.map((w) => [w.id, w]));
  return (ref) => {
    if (ref.startsWith('w:')) {
      const w = wById.get(ref.slice(2));
      if (!w) return null;
      // alternate direction each time a card is reviewed: Italian->English, then English->Italian
      const reps = (srs[`w:${w.id}`] || {}).reps || 0;
      return wordQuestion(w, words, reps % 2 === 0 ? 'it-en' : 'en-it');
    }
    return bank.byId.get(ref.slice(2)) || null;
  };
}
