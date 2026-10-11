import { Storage, createBackend } from '../engine/storage.js';
import { toast, esc } from './util.js';
import { localDay } from '../engine/dates.js';
import { recordStudyDay } from '../engine/streak.js';

const ROUTES = {
  today: () => import('./screens/today.js'),
  learn: () => import('./screens/learn.js'),
  words: () => import('./screens/words.js'),
  settings: () => import('./screens/settings.js'),
  practice: () => import('./screens/practice.js'),
  session: () => import('./screens/session.js'),
  progress: () => import('./screens/progress.js'),
  exam: () => import('./screens/placeholder.js'),
};

const root = document.getElementById('view');
let ctx;

function parseHash() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  return { name: parts[0] || 'today', params: parts.slice(1) };
}

async function route() {
  const { name, params } = parseHash();
  const loader = ROUTES[name] || ROUTES.today;
  const tab = name === 'session' || !ROUTES[name] ? 'today' : name;
  document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
  try {
    const mod = await loader();
    await mod.render(root, ctx, params, tab);
    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err);
    root.innerHTML = `<div class="empty"><p>Something went wrong loading this screen.</p><p class="small">${esc(err.message)}</p><a class="btn" href="#/today">Back to Today</a></div>`;
  }
}

async function start() {
  const storage = new Storage(await createBackend());
  ctx = {
    storage,
    toast,
    // call whenever the user studies; keeps the daily streak
    async touchStreak() {
      const next = recordStudyDay(await storage.getSetting('streak'), localDay());
      await storage.setSetting('streak', next);
    },
  };

  // Ask the browser not to evict our data (helps on iOS and Android).
  try { await navigator.storage?.persist?.(); } catch { /* ignore */ }

  window.addEventListener('hashchange', route);
  await route();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker failed', e));
  }
}

start();
