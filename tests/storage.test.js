import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Storage, MemoryBackend } from '../engine/storage.js';

const fresh = () => new Storage(new MemoryBackend());

test('records and returns answers in time order', async () => {
  const s = fresh();
  await s.recordAnswer({ qid: 'b', section: 'grammar', topic: 'x', correct: false, at: 200 });
  await s.recordAnswer({ qid: 'a', section: 'grammar', topic: 'x', correct: true, at: 100 });
  const a = await s.getAnswers();
  assert.deepEqual(a.map((r) => r.qid), ['a', 'b']);
  assert.equal(a[0].correct, true);
});

test('settings fall back to the default', async () => {
  const s = fresh();
  assert.equal(await s.getSetting('streak', 0), 0);
  await s.setSetting('streak', 3);
  assert.equal(await s.getSetting('streak', 0), 3);
});

test('export then import round-trips everything', async () => {
  const a = fresh();
  await a.recordAnswer({ qid: 'q1', section: 'drill', topic: 't', correct: true, at: 5 });
  await a.putSrs('q1', { box: 2, due: '2026-10-12' });
  await a.setSetting('lastBackup', 1);
  await a.addReport({ qid: 'q1', note: 'typo', at: 9 });
  const dump = JSON.parse(JSON.stringify(await a.exportAll()));

  const b = fresh();
  await b.recordAnswer({ qid: 'old', section: 'drill', topic: 't', correct: false, at: 1 });
  await b.importAll(dump);
  assert.deepEqual((await b.getAnswers()).map((r) => r.qid), ['q1']);
  assert.deepEqual(await b.getSrs('q1'), { box: 2, due: '2026-10-12' });
  assert.equal((await b.getReports())[0].note, 'typo');
});

test('import rejects bad files without touching existing data', async () => {
  const s = fresh();
  await s.setSetting('keep', 'me');
  await assert.rejects(() => s.importAll({ format: 'nope' }), /not a Mille backup/);
  await assert.rejects(() => s.importAll(null), /not a Mille backup/);
  await assert.rejects(() => s.importAll({ format: 'mille-backup', version: 99, stores: {} }), /newer version/);
  await assert.rejects(() => s.importAll({ format: 'mille-backup', version: 1, stores: { answers: [] } }), /damaged/);
  assert.equal(await s.getSetting('keep'), 'me');
});

test('resetAll clears every store', async () => {
  const s = fresh();
  await s.recordAnswer({ qid: 'q', section: 'drill', topic: 't', correct: true });
  await s.resetAll();
  assert.equal((await s.getAnswers()).length, 0);
});
