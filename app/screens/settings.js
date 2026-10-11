import { downloadJSON, esc } from '../util.js';
import { localDay } from '../../engine/streak.js';

export async function render(root, ctx) {
  const { storage, toast } = ctx;
  const last = await storage.getSetting('lastBackup');
  const reports = await storage.getReports();
  const days = last ? Math.floor((Date.now() - last) / 86400000) : null;

  root.innerHTML = `
    <h1>Settings</h1>
    ${storage.persistent ? '' : `<div class="warn-banner">⚠️ Progress is not being saved in this browser. Install Mille to the Home Screen.</div>`}

    <div class="card">
      <h3>Backup</h3>
      <p class="muted small">Your progress lives only on this device. Export a file now and then, and use it to move progress between your iPhone and tablet.
      ${days === null ? '<b>No backup yet.</b>' : `Last backup: ${days === 0 ? 'today' : `${days} day(s) ago`}.`}</p>
      <button class="btn block" id="export">Export backup file</button>
      <div style="height:10px"></div>
      <label class="btn ghost block" for="importFile">Import backup file…</label>
      <input type="file" id="importFile" accept="application/json,.json" hidden>
    </div>

    <div class="card">
      <h3>Reported questions</h3>
      <p class="muted small" style="margin:0">${reports.length} reported so far. They are included in your backup.</p>
    </div>

    <div class="card">
      <h3>Reset</h3>
      <p class="muted small">Deletes all answers, reviews and settings on this device.</p>
      <button class="btn danger block" id="reset">Reset all progress</button>
    </div>

    <div class="card small muted">
      <h3>About</h3>
      <p>Mille v2 · personal study app for the Italian YDS.</p>
      <p>Sentences from Tatoeba (CC BY 2.0 FR) will be credited here once they are added.</p>
    </div>`;

  root.querySelector('#export').addEventListener('click', async () => {
    const data = await storage.exportAll();
    downloadJSON(`mille-backup-${localDay()}.json`, data);
    await storage.setSetting('lastBackup', Date.now());
    toast('Backup saved ✓');
  });

  root.querySelector('#importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!confirm('Replace ALL progress on this device with this backup?')) return;
      await storage.importAll(data);
      toast('Backup restored ✓');
      render(root, ctx);
    } catch (err) {
      toast(`Import failed: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  });

  root.querySelector('#reset').addEventListener('click', async () => {
    if (!confirm('Delete ALL progress on this device? This cannot be undone.')) return;
    await storage.resetAll();
    toast('Progress reset.');
    render(root, ctx);
  });
}
