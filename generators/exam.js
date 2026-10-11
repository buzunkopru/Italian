// Exam-section questions (5 options, like the real paper): vocabulary in context and passage cloze.
// Hand-written and reviewed, so they are marked source "hand" and verified.
import { EXAM_VOCAB } from './handwritten/exam-vocab.js';
import { EXAM_CLOZE_PASSAGES } from './handwritten/exam-cloze.js';
import { EXAM_COMPLETION } from './handwritten/exam-completion.js';
import { EXAM_DIALOGUE } from './handwritten/exam-dialogue.js';
import { EXAM_PARAPHRASE } from './handwritten/exam-paraphrase.js';
import { EXAM_READING } from './handwritten/exam-reading.js';
import { EXAM_GRAMMAR } from './handwritten/exam-grammar.js';
import { EXAM_TRANSLATION } from './handwritten/exam-translation.js';
import { EXAM_PARAGRAPH } from './handwritten/exam-paragraph.js';
import { EXAM_IRRELEVANT } from './handwritten/exam-irrelevant.js';
import { hash } from './util.js';
import { shuffle } from '../engine/picker.js';

function build({ section, topic, level, prompt, answer, wrong, explain, rng, tag, extra = {} }) {
  const options = shuffle([answer, ...wrong], rng);
  return {
    id: `x-${tag}-${hash(prompt + '|' + answer)}`,
    section,
    topic,
    level,
    prompt,
    options,
    answer: options.indexOf(answer),
    explain,
    source: 'hand',
    verified: true,
    ...extra,
  };
}

export function vocabQuestions(rng) {
  return EXAM_VOCAB.map(([level, prompt, answer, wrong, explain]) =>
    build({ section: 'vocab', topic: 'exam.vocab', level, prompt, answer, wrong, explain, rng, tag: 'v' }));
}

/** Fill every blank except `target` with its correct answer; the target becomes "----". */
export function passagePrompt(passage, target) {
  return passage.text.replace(/\{(\d)\}/g, (_, n) => (Number(n) === target ? '----' : passage.blanks[Number(n) - 1][0]));
}

export function clozeQuestions(rng) {
  const out = [];
  for (const passage of EXAM_CLOZE_PASSAGES) {
    passage.blanks.forEach(([answer, wrong, explain], i) => {
      out.push(build({
        section: 'cloze', topic: 'exam.cloze', level: passage.level,
        prompt: passagePrompt(passage, i + 1), answer, wrong, explain, rng, tag: 'c',
      }));
    });
  }
  return out;
}

export function completionQuestions(rng) {
  return EXAM_COMPLETION.map(([level, prompt, answer, wrong, explain]) =>
    build({ section: 'completion', topic: 'exam.completion', level, prompt, answer, wrong, explain, rng, tag: 'k' }));
}

export function dialogueQuestions(rng) {
  return EXAM_DIALOGUE.map(([level, prompt, answer, wrong, explain]) =>
    build({ section: 'dialogue', topic: 'exam.dialogue', level, prompt, answer, wrong, explain, rng, tag: 'd' }));
}

export const PARAPHRASE_LEAD = 'Closest in meaning:';

export function paraphraseQuestions(rng) {
  return EXAM_PARAPHRASE.map(([level, sentence, answer, wrong, explain]) =>
    build({ section: 'paraphrase', topic: 'exam.paraphrase', level, prompt: `${PARAPHRASE_LEAD}\n${sentence}`, answer, wrong, explain, rng, tag: 'p' }));
}

export function readingQuestions(rng) {
  const out = [];
  for (const p of EXAM_READING) {
    p.questions.forEach(([prompt, answer, wrong, explain], i) => {
      const q = build({ section: 'reading', topic: 'exam.reading', level: p.level, prompt, answer, wrong, explain, rng, tag: 'r', extra: { passage: p.text, group: `read-${p.id}` } });
      q.id = `x-r-${p.id}-${i + 1}`;
      out.push(q);
    });
  }
  return out;
}

export function grammarQuestions(rng) {
  return EXAM_GRAMMAR.map(([level, prompt, answer, wrong, explain]) =>
    build({ section: 'grammar', topic: 'exam.grammar', level, prompt, answer, wrong, explain, rng, tag: 'g' }));
}

export function translationQuestions(rng) {
  return EXAM_TRANSLATION.map(([level, dir, sentence, answer, wrong, explain]) =>
    build({ section: 'translation', topic: 'exam.translation', level, prompt: `${dir === 'en-it' ? 'Best Italian version of:' : 'Best English version of:'}\n${sentence}`, answer, wrong, explain, rng, tag: 't' }));
}

export function paragraphQuestions(rng) {
  return EXAM_PARAGRAPH.map(([level, prompt, answer, wrong, explain]) =>
    build({ section: 'paragraph', topic: 'exam.paragraph', level, prompt, answer, wrong, explain, rng, tag: 'q' }));
}

/** "Which sentence does not belong?" The options are the sentence numbers, so they stay in order. */
export function irrelevantQuestions() {
  return EXAM_IRRELEVANT.map(([level, sentences, odd, explain]) => {
    const prompt = `Quale frase non appartiene al paragrafo?\n${sentences.map((s, i) => `(${i + 1}) ${s}`).join('\n')}`;
    return {
      id: `x-i-${hash(prompt)}`,
      section: 'irrelevant',
      topic: 'exam.irrelevant',
      level,
      prompt,
      options: [1, 2, 3, 4, 5].map((n) => `Frase ${n}`),
      answer: odd - 1,
      explain,
      source: 'hand',
      verified: true,
      ordered: true,
    };
  });
}

export function generate(rng) {
  return [...vocabQuestions(rng), ...clozeQuestions(rng), ...completionQuestions(rng), ...dialogueQuestions(rng), ...paraphraseQuestions(rng), ...readingQuestions(rng), ...grammarQuestions(rng), ...translationQuestions(rng), ...paragraphQuestions(rng), ...irrelevantQuestions()];
}
