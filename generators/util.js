// Shared helpers for question generators. Generators are deterministic: same code -> same bank.
import { shuffle } from '../engine/picker.js';

/** Deterministic random numbers (mulberry32). */
export function seeded(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Short stable hash (FNV-1a, base36). Used so question ids never change between builds. */
export function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

export const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];
export const pickN = (arr, n, rng) => shuffle(arr, rng).slice(0, n);
export const shuffleCopy = (arr, rng) => shuffle(arr, rng);

/** Subject text in the middle of a sentence: lowercase it unless it starts with a name. */
export const mid = (text) => (/^(Marco|Giulia|Anna|Luca)(?![a-z])/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1));

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const levelOfTopic = (topic) => Number(/^lesson\.(\d)\./.exec(topic)?.[1] || 1);

/**
 * Build one question in the bank format. Returns null if it cannot be made safely
 * (fewer than `need` distinct distractors).
 */
export function makeQuestion({ gen, topic, prompt, answer, distractors, explain, rng, need = 3 }) {
  const seen = new Set([answer.trim().toLowerCase()]);
  const wrong = [];
  for (const d of distractors) {
    const k = String(d).trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    wrong.push(d);
    if (wrong.length === need) break;
  }
  if (wrong.length < need) return null;
  const options = shuffle([answer, ...wrong], rng);
  return {
    id: `g-${gen}-${hash(prompt + '|' + answer)}`,
    section: 'drill',
    topic,
    level: levelOfTopic(topic),
    prompt,
    options,
    answer: options.indexOf(answer),
    explain,
    source: 'generated',
    verified: true,
  };
}

/** Keep at most `max` questions per topic, chosen deterministically; drop duplicate ids. */
export function limitPerTopic(questions, max, rng) {
  const byId = new Map();
  for (const q of questions) if (q && !byId.has(q.id)) byId.set(q.id, q);
  const byTopic = new Map();
  for (const q of byId.values()) {
    if (!byTopic.has(q.topic)) byTopic.set(q.topic, []);
    byTopic.get(q.topic).push(q);
  }
  const out = [];
  for (const [, list] of [...byTopic.entries()].sort()) {
    out.push(...(list.length > max ? shuffle(list, rng).slice(0, max) : list));
  }
  return out.sort((a, b) => (a.id < b.id ? -1 : 1));
}
