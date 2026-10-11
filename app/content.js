// Loads static content (JSON) once and caches it.
const cache = new Map();

async function getJSON(path) {
  if (!cache.has(path)) {
    const p = fetch(path).then((r) => {
      if (!r.ok) throw new Error(`Could not load ${path} (${r.status})`);
      return r.json();
    });
    cache.set(path, p);
    p.catch(() => cache.delete(path)); // allow retry after a failure
  }
  return cache.get(path);
}

export const loadLevels = () => getJSON('content/levels.json');
export const loadLevel = (id) => getJSON(`content/lessons/level-${id}.json`);
export const loadWords = () => getJSON('content/words.json');
