// One-time import: archive/v1 data -> content/*.json
// Usage: npm run import
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const v1 = join(root, 'archive', 'v1', 'js');

function load(file, exportName) {
  const code = readFileSync(join(v1, file), 'utf8') + `\n;${exportName}`;
  return vm.runInNewContext(code, { window: {}, console });
}

const data = load('data.js', 'MILLE_DATA');
const words = load('mille1000.js', 'MILLE_1000');

mkdirSync(join(root, 'content', 'lessons'), { recursive: true });
mkdirSync(join(root, 'content', 'questions'), { recursive: true });

const levelsOut = [];
const seedQuestions = [];

for (const lvl of data.levels) {
  const lessons = lvl.lessons.map((l) => {
    const { practiceDrill, unlockedCards, ...rest } = l;
    (practiceDrill || []).forEach((q, i) => {
      seedQuestions.push({
        id: `drill-${l.id}-${String(i + 1).padStart(3, '0')}`,
        section: 'drill',
        topic: `lesson.${l.id}`,
        level: lvl.id,
        prompt: q.sentence.replace('_____', '----'),
        options: q.options,
        answer: q.options.findIndex((o) => o.trim().toLowerCase() === q.target.trim().toLowerCase()),
        explain: q.explanation,
        translation: q.translation,
        source: 'v1',
        verified: false,
      });
    });
    return { ...rest, topic: `lesson.${l.id}` };
  });

  (lvl.cloze || []).forEach((q, i) => {
    seedQuestions.push({
      id: `cloze-L${lvl.id}-${String(i + 1).padStart(3, '0')}`,
      section: 'drill',
      topic: `level.${lvl.id}`,
      level: lvl.id,
      prompt: q.sentence.replace('_____', '----'),
      options: q.options,
      answer: q.options.findIndex((o) => o.trim().toLowerCase() === q.target.trim().toLowerCase()),
      explain: q.explanation,
      source: 'v1',
      verified: false,
    });
  });

  const meta = {
    id: lvl.id,
    name: lvl.name,
    tag: lvl.tag,
    badge: lvl.badge,
    description: lvl.description,
    accent: lvl.accent,
    lessons,
  };
  levelsOut.push({ id: lvl.id, name: lvl.name, tag: lvl.tag, badge: lvl.badge, description: lvl.description, accent: lvl.accent, lessonCount: lessons.length });
  writeFileSync(join(root, 'content', 'lessons', `level-${lvl.id}.json`), JSON.stringify(meta, null, 1));
}

writeFileSync(join(root, 'content', 'levels.json'), JSON.stringify(levelsOut, null, 1));

const wordsOut = words.map((w) => ({
  id: w.id, word: w.word, type: w.type, category: w.category, en: w.en,
  exampleIt: w.exampleIt, exampleEn: w.exampleEn, stage: w.stage,
  ...(w.gender && { gender: w.gender }),
  ...(w.article && { article: w.article }),
  ...(w.plural && { plural: w.plural }),
  ...(w.ydsTip && { ydsTip: w.ydsTip }),
  ...(w.ydsDecoder && { ydsDecoder: w.ydsDecoder }),
}));
writeFileSync(join(root, 'content', 'words.json'), JSON.stringify(wordsOut));
writeFileSync(join(root, 'content', 'questions', 'seed-v1.json'), JSON.stringify(seedQuestions, null, 1));

console.log(`levels: ${levelsOut.length}, lessons: ${levelsOut.reduce((a, l) => a + l.lessonCount, 0)}, words: ${wordsOut.length}, seed questions: ${seedQuestions.length}`);
const bad = seedQuestions.filter((q) => q.answer < 0);
if (bad.length) console.log('WARNING: questions with no matching answer:', bad.map((q) => q.id).join(', '));
