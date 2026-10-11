// Writes content/questions/index.json: the list of question files the app (and service worker) load.
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'questions');
export function listFiles() {
  return readdirSync(dir).filter((n) => n.endsWith('.json') && n !== 'index.json').sort();
}
if (process.argv[1] && process.argv[1].endsWith('build-index.js')) {
  const files = listFiles();
  writeFileSync(join(dir, 'index.json'), JSON.stringify({ files }, null, 1));
  console.log(`index.json: ${files.length} file(s)`);
}
