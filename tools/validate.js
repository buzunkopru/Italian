// Validate every question file under content/questions. Exit code 1 if anything is wrong.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateBank } from '../engine/schema.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const qdir = join(root, 'content', 'questions');

// Topics: every lesson, every level, plus any topic registered in content/topics.json
const known = new Set();
for (const f of readdirSync(join(root, 'content', 'lessons'))) {
  const lvl = JSON.parse(readFileSync(join(root, 'content', 'lessons', f), 'utf8'));
  known.add(`level.${lvl.id}`);
  lvl.lessons.forEach((l) => known.add(l.topic));
}

const all = [];
for (const f of readdirSync(qdir).filter((n) => n.endsWith('.json') && n !== 'index.json')) {
  const list = JSON.parse(readFileSync(join(qdir, f), 'utf8'));
  all.push(...list);
  console.log(`${f}: ${list.length} questions`);
}

const problems = validateBank(all, { knownTopics: known });
if (problems.length) {
  for (const p of problems.slice(0, 50)) console.log(`  ✗ ${p.id}: ${p.errors.join('; ')}`);
  console.log(`${problems.length} invalid of ${all.length}`);
  process.exit(1);
}
console.log(`OK: ${all.length} questions valid`);
