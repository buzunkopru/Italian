// Print random generated questions for eyeballing: node tools/sample.js [topic] [n]
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { seeded } from '../generators/util.js';
import { shuffle } from '../engine/picker.js';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'questions');
const [topic, n = '3'] = process.argv.slice(2);
const all = readdirSync(dir).filter((f) => f.startsWith('gen-')).flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
const topics = [...new Set(all.map((q) => q.topic))].sort();
for (const t of topic ? [topic] : topics) {
  console.log(`\n== ${t} ==`);
  for (const q of shuffle(all.filter((x) => x.topic === t), seeded(Date.now() % 1000)).slice(0, Number(n))) {
    console.log(`${q.prompt}\n   ${q.options.map((o, i) => (i === q.answer ? `[${o}]` : o)).join(' | ')}\n   ↳ ${q.explain}`);
  }
}
