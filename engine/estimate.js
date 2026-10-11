// Estimating the YDS score (out of 100; 80 questions at 1.25 points each, so points = share correct x 100).
import { EXAM_SECTIONS } from './schema.js';

export const TARGET = 55;
const MIN_ANSWERS = 10; // per section, before it counts towards the practice estimate
const RECENT = 100; // look at the latest answers per section only

/** Average of the last three mock exams (weighted by their length). null when there are none. */
export function mockEstimate(mocks) {
  if (!mocks || !mocks.length) return null;
  const last = mocks.slice(-3);
  const total = last.reduce((a, m) => a + m.total, 0);
  const correct = last.reduce((a, m) => a + m.correct, 0);
  return {
    points: Math.round((correct / total) * 1000) / 10,
    count: last.length,
    best: Math.max(...mocks.map((m) => m.points)),
    latest: mocks[mocks.length - 1].points,
  };
}

/**
 * Estimate from accuracy on exam-section practice, weighted by how many questions each section has in the real paper.
 * Only sections with enough answers count; `coverage` says how much of the paper that is.
 * Practice is untimed and questions repeat, so this usually runs higher than a real mock.
 */
export function practiceEstimate(answers) {
  const by = {};
  for (const a of answers) {
    if (!(a.section in EXAM_SECTIONS)) continue;
    (by[a.section] ||= []).push(a);
  }
  const totalWeight = Object.values(EXAM_SECTIONS).reduce((a, b) => a + b, 0);
  let weight = 0;
  let sum = 0;
  const sections = {};
  for (const [section, list] of Object.entries(by)) {
    const recent = list.sort((a, b) => a.at - b.at).slice(-RECENT);
    const acc = recent.filter((a) => a.correct).length / recent.length;
    sections[section] = { n: list.length, acc };
    if (recent.length >= MIN_ANSWERS) { weight += EXAM_SECTIONS[section]; sum += EXAM_SECTIONS[section] * acc; }
  }
  if (!weight) return null;
  return { points: Math.round((sum / weight) * 1000) / 10, coverage: weight / totalWeight, sections };
}
