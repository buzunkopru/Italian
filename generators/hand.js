// Turns the hand-written tuples into bank questions. They are marked source "hand" and
// verified only after the review pass (see HAND_REVIEWED below).
import { LEVEL2_HAND } from './handwritten/level2.js';
import { LEVEL3_HAND } from './handwritten/level3.js';
import { LEVEL4_CONNECTORS } from './handwritten/level4.js';
import { LEVEL4_VERBS_ETC } from './handwritten/level4b.js';
import { hash, levelOfTopic } from './util.js';
import { shuffle } from '../engine/picker.js';

export const HAND_SETS = [...LEVEL2_HAND, ...LEVEL3_HAND, ...LEVEL4_CONNECTORS, ...LEVEL4_VERBS_ETC];

/** True once every item has been read through a second time (tools/review-hand.js prints them). Set it to false while adding new, unreviewed items. */
export const HAND_REVIEWED = true;

export function generate(rng) {
  const out = [];
  for (const [topic, prompt, answer, wrong, explain] of HAND_SETS) {
    const options = shuffle([answer, ...wrong], rng);
    out.push({
      id: `h-${hash(topic + '|' + prompt + '|' + answer)}`,
      section: 'drill',
      topic,
      level: levelOfTopic(topic),
      prompt,
      options,
      answer: options.indexOf(answer),
      explain,
      source: 'hand',
      verified: HAND_REVIEWED,
    });
  }
  return out;
}
