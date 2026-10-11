// All generators, in a fixed order. build-generated.js runs them with a fixed seed.
import * as articles from './articles.js';
import * as present from './present.js';
import * as tenses from './tenses.js';
import * as pronouns from './pronouns.js';
import * as words from './words.js';
import * as level3 from './level3.js';
import * as hand from './hand.js';
import * as verbs4 from './verbs4.js';

export const GENERATORS = { articles, present, tenses, pronouns, words, level3, hand, verbs4 };

/** Max questions kept per lesson topic. Keeps the bank (and the app download) a sensible size. */
export const MAX_PER_TOPIC = 260;
