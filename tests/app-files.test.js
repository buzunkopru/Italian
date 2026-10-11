import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('every file the service worker precaches exists', () => {
  const sw = readFileSync(join(root, 'sw.js'), 'utf8');
  const list = sw.match(/const ASSETS = \[([\s\S]*?)\];/)[1];
  const files = [...list.matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((f) => f !== './');
  assert.ok(files.length > 10);
  for (const f of files) assert.ok(existsSync(join(root, f)), `missing: ${f}`);
});

test('every app/engine module is precached (offline completeness)', async () => {
  const { readdirSync } = await import('node:fs');
  const sw = readFileSync(join(root, 'sw.js'), 'utf8');
  const mods = [];
  for (const dir of ['app', 'app/screens', 'engine']) {
    for (const f of readdirSync(join(root, dir))) if (/\.(js|css)$/.test(f)) mods.push(`${dir}/${f}`);
  }
  for (const m of mods) assert.ok(sw.includes(`'${m}'`), `not precached: ${m}`);
});

test('manifest icons exist', () => {
  const m = JSON.parse(readFileSync(join(root, 'manifest.webmanifest'), 'utf8'));
  for (const i of m.icons) assert.ok(existsSync(join(root, i.src)), `missing icon ${i.src}`);
});

test('no PDFs are tracked by the ignore rules', () => {
  assert.match(readFileSync(join(root, '.gitignore'), 'utf8'), /^\*\.pdf$/m);
});

test('question index lists exactly the question files on disk', async () => {
  const { listFiles } = await import('../tools/build-index.js');
  const idx = JSON.parse(readFileSync(join(root, 'content/questions/index.json'), 'utf8'));
  assert.deepEqual(idx.files, listFiles(), 'run: npm run index');
});
