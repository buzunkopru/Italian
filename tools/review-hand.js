// Print every hand-written item for a final read-through: node tools/review-hand.js [topic-prefix]
import { HAND_SETS } from '../generators/hand.js';
const prefix = process.argv[2] || '';
HAND_SETS.forEach(([topic, prompt, answer, wrong], i) => {
  if (topic.startsWith(`lesson.${prefix}`)) console.log(`${i} ${topic.slice(7)} | ${prompt} | ${answer} | ${wrong.join(', ')}`);
});
