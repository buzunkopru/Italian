// Storage layer: IndexedDB in the browser, in-memory for tests / fallback.
// All stores are simple key -> value maps.

export const STORES = ['answers', 'srs', 'settings', 'reports'];
export const BACKUP_FORMAT = 'mille-backup';
export const BACKUP_VERSION = 1;

export class MemoryBackend {
  constructor() {
    this.data = Object.fromEntries(STORES.map((s) => [s, new Map()]));
    this.persistent = false;
  }
  async get(store, key) { return this.data[store].get(key); }
  async put(store, key, value) { this.data[store].set(key, value); }
  async delete(store, key) { this.data[store].delete(key); }
  async all(store) { return [...this.data[store].entries()].map(([key, value]) => ({ key, value })); }
  async clear(store) { this.data[store].clear(); }
}

export class IndexedDBBackend {
  constructor(idb = globalThis.indexedDB, name = 'mille-v2') {
    this.idb = idb;
    this.name = name;
    this.persistent = true;
    this.dbPromise = null;
  }
  open() {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = this.idb.open(this.name, 1);
        req.onupgradeneeded = () => {
          for (const s of STORES) req.result.createObjectStore(s);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return this.dbPromise;
  }
  async run(store, mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const out = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve(out && 'result' in out ? out.result : undefined);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  get(store, key) { return this.run(store, 'readonly', (os) => os.get(key)); }
  put(store, key, value) { return this.run(store, 'readwrite', (os) => os.put(value, key)); }
  delete(store, key) { return this.run(store, 'readwrite', (os) => os.delete(key)); }
  clear(store) { return this.run(store, 'readwrite', (os) => os.clear()); }
  async all(store) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const rows = [];
      const req = db.transaction(store, 'readonly').objectStore(store).openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) { rows.push({ key: c.key, value: c.value }); c.continue(); } else resolve(rows);
      };
      req.onerror = () => reject(req.error);
    });
  }
}

/** Pick IndexedDB if it works, otherwise fall back to memory (flagged so the UI can warn). */
export async function createBackend() {
  try {
    if (!globalThis.indexedDB) throw new Error('no indexedDB');
    const b = new IndexedDBBackend();
    await b.open();
    return b;
  } catch (e) {
    console.warn('IndexedDB unavailable, progress will NOT be saved:', e);
    return new MemoryBackend();
  }
}

export class Storage {
  constructor(backend) {
    this.backend = backend;
  }
  get persistent() { return this.backend.persistent; }

  // --- answers: one record per answered question ---
  async recordAnswer({ qid, section, topic, correct, ms = 0, at = Date.now() }) {
    const key = `${String(at).padStart(15, '0')}-${Math.random().toString(36).slice(2, 7)}`;
    await this.backend.put('answers', key, { qid, section, topic, correct: !!correct, ms, at });
  }
  async getAnswers() {
    const rows = await this.backend.all('answers');
    return rows.map((r) => r.value).sort((a, b) => a.at - b.at);
  }

  // --- srs: one record per card/question id ---
  getSrs(id) { return this.backend.get('srs', id); }
  putSrs(id, state) { return this.backend.put('srs', id, state); }
  async getAllSrs() {
    const rows = await this.backend.all('srs');
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  // --- settings ---
  async getSetting(key, fallback = undefined) {
    const v = await this.backend.get('settings', key);
    return v === undefined ? fallback : v;
  }
  setSetting(key, value) { return this.backend.put('settings', key, value); }

  // --- reports: "this question looks wrong" ---
  async addReport({ qid, note = '', at = Date.now() }) {
    await this.backend.put('reports', `${at}-${qid}`, { qid, note, at });
  }
  async getReports() {
    const rows = await this.backend.all('reports');
    return rows.map((r) => r.value);
  }

  // --- backup / restore ---
  async exportAll() {
    const stores = {};
    for (const s of STORES) {
      const rows = await this.backend.all(s);
      stores[s] = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    }
    return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), stores };
  }

  /** Replace everything with the backup. Throws on a bad file, before touching any data. */
  async importAll(backup) {
    if (!backup || backup.format !== BACKUP_FORMAT) throw new Error('This is not a Mille backup file.');
    if (backup.version > BACKUP_VERSION) throw new Error('This backup is from a newer version of the app.');
    if (!backup.stores || typeof backup.stores !== 'object') throw new Error('Backup has no data.');
    for (const s of STORES) {
      const part = backup.stores[s];
      if (part !== undefined && (part === null || typeof part !== 'object' || Array.isArray(part))) {
        throw new Error(`Backup store "${s}" is damaged.`);
      }
    }
    for (const s of STORES) {
      await this.backend.clear(s);
      for (const [k, v] of Object.entries(backup.stores[s] || {})) await this.backend.put(s, k, v);
    }
  }

  async resetAll() {
    for (const s of STORES) await this.backend.clear(s);
  }
}
