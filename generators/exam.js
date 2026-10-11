// Exam-section questions (5 options, like the real paper): vocabulary in context and passage cloze.
// Hand-written and reviewed, so they are marked source "hand" and verified.
import { EXAM_VOCAB } from './handwritten/exam-vocab.js';
import { EXAM_CLOZE_PASSAGES } from './handwritten/exam-cloze.js';
import { EXAM_COMPLETION } from './handwritten/exam-completion.js';
import { hash } from './util.js';
import { shuffle } from '../engine/picker.js';

function build({ section, topic, level, prompt, answer, wrong, explain, rng, tag }) {
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

export function generate(rng) {
  return [...vocabQuestions(rng), ...clozeQuestions(rng), ...completionQuestions(rng)];
}
