// Builds content/questions/exam-hand.json (vocab-in-context + passage cloze) with a fixed seed.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generate } from '../generators/exam.js';
import { seeded } from '../generators/util.js';

export function buildExam() {
  return generate(seeded(777));
}

if (process.argv[1] && process.argv[1].endsWith('build-exam.js')) {
  const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'questions', 'exam-hand.json');
  const qs = buildExam();
  writeFileSync(file, JSON.stringify(qs, null, 1));
  const by = {};
  for (const q of qs) by[q.section] = (by[q.section] || 0) + 1;
  console.log(`exam-hand.json: ${qs.length} questions`, by);
}
