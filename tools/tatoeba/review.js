// Hand review of cloze candidates.
//   node tools/tatoeba/review.js <candidates.json> print <cls> <from> <to>      show items [from, to)
//   node tools/tatoeba/review.js <candidates.json> reject <cls> <from> <to> <i,j,k>   reject those item numbers
//     (this also marks [from, to) as reviewed; everything reviewed and not rejected is accepted)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { toQuestion } from './lib.js';

const [file, cmd, cls, a, b, list] = process.argv.slice(2);
const data = JSON.parse(readFileSync(file, 'utf8'));
const ctx = { conn: data.conn, preps: data.preps, paradigms: data.paradigms };
const decisionsPath = join(dirname(fileURLToPath(import.meta.url)), 'decisions.json');
const dec = existsSync(decisionsPath) ? JSON.parse(readFileSync(decisionsPath, 'utf8')) : { reviewed: {}, rejected: [], note: 'item indexes refer to the seeded candidate order from prepare.js' };

const items = data.picked[cls];
const from = Number(a);
const to = Math.min(Number(b), items.length);

if (cmd === 'print') {
  for (let i = from; i < to; i++) {
    const q = toQuestion(items[i], ctx);
    if (!q) { console.log(`${i} (skipped: cannot build)`); continue; }
    const ans = q.options[q.answer];
    const wrong = q.options.filter((_, k) => k !== q.answer).join(', ');
    console.log(`${i} ${q.prompt} | ${ans} | ${wrong}${cls === 'conn' ? `  // ${q.translation}` : ''}`);
  }
} else if (cmd === 'reject') {
  const rej = (list || '').split(',').map((s) => s.trim()).filter(Boolean).map(Number);
  for (const i of rej) {
    if (i < from || i >= to) throw new Error(`${i} is outside [${from}, ${to})`);
    const tid = items[i].tid;
    if (!dec.rejected.includes(`${cls}:${tid}`)) dec.rejected.push(`${cls}:${tid}`);
  }
  dec.reviewed[cls] = Math.max(dec.reviewed[cls] || 0, to);
  writeFileSync(decisionsPath, JSON.stringify(dec, null, 1));
  console.log(`${cls}: rejected ${rej.length}, reviewed up to ${dec.reviewed[cls]}, total rejected ${dec.rejected.length}`);
}
