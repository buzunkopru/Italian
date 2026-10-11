// Write the reviewed Tatoeba cloze questions into content/questions/tatoeba-cloze.json.
//   node tools/tatoeba/build.js <candidates.json>
// Only items inside the reviewed range of tools/tatoeba/decisions.json, and not rejected, are written.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { toQuestion } from './lib.js';

const here = dirname(fileURLToPath(import.meta.url));
const [file] = process.argv.slice(2);
if (!file) { console.error('usage: build.js <candidates.json>'); process.exit(1); }

const data = JSON.parse(readFileSync(file, 'utf8'));
const dec = JSON.parse(readFileSync(join(here, 'decisions.json'), 'utf8'));
const ctx = { conn: data.conn, preps: data.preps, paradigms: data.paradigms };
const rejected = new Set(dec.rejected);

const out = [];
const counts = {};
for (const [cls, items] of Object.entries(data.picked)) {
  const upTo = dec.reviewed[cls] || 0;
  items.slice(0, upTo).forEach((c) => {
    if (rejected.has(`${cls}:${c.tid}`)) return;
    const q = toQuestion(c, ctx);
    if (!q) return;
    q.verified = true; // a person read this item and its distractors
    out.push(q);
    counts[cls] = (counts[cls] || 0) + 1;
  });
}
out.sort((a, b) => (a.id < b.id ? -1 : 1));
writeFileSync(join(here, '..', '..', 'content', 'questions', 'tatoeba-cloze.json'), JSON.stringify(out, null, 1));
console.log(`wrote ${out.length} questions`, counts);
