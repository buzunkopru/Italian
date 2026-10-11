const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Escape text before putting it in innerHTML. Lesson content is trusted HTML and is NOT escaped. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

let toastTimer;
export function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/** Read aloud in Italian. Optional memory aid; silently does nothing if the device has no voice. */
export function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]*>/g, ''));
    u.lang = 'it-IT';
    u.rate = 0.9;
    const voice = synth.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('it'));
    if (voice) u.voice = voice;
    synth.speak(u);
  } catch { /* no speech support */ }
}

export function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
