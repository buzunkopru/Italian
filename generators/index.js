// All generators, in a fixed order. build-generated.js runs them with a fixed seed.
import * as articles from './articles.js';
import * as present from './present.js';
import * as tenses from './tenses.js';
import * as pronouns from './pronouns.js';
import * as words from './words.js';

export const GENERATORS = { articles, present, tenses, pronouns, words };

/** Max questions kept per lesson topic. Keeps the bank (and the app download) a sensible size. */
export const MAX_PER_TOPIC = 260;
