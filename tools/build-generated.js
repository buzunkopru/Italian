// Runs every generator with a fixed seed and writes content/questions/gen-level-N.json.
// Same code -> same files, so ids are stable and git diffs only show real changes.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GENERATORS, MAX_PER_TOPIC } from '../generators/index.js';
import { seeded, limitPerTopic } from '../generators/util.js';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'questions');

export function buildAll() {
  const all = [];
  for (const [name, g] of Object.entries(GENERATORS)) {
    const list = g.generate(seeded(1234));
    all.push(...list.filter(Boolean));
    console.log(`  ${name}: ${list.filter(Boolean).length}`);
  }
  return limitPerTopic(all, MAX_PER_TOPIC, seeded(99));
}

if (process.argv[1] && process.argv[1].endsWith('build-generated.js')) {
  const qs = buildAll();
  for (const level of [1, 2, 3, 4]) {
    const list = qs.filter((q) => q.level === level);
    if (list.length) writeFileSync(join(dir, `gen-level-${level}.json`), JSON.stringify(list, null, 1));
  }
  const by = {};
  for (const q of qs) by[q.topic] = (by[q.topic] || 0) + 1;
  console.log(`kept ${qs.length} questions`);
  console.log(by);
}
