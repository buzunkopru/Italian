# Mille v2: Design Doc

Status: draft for approval. No code has been written yet.
Goal: pass the Italian YDS with 55+ points (about 44 of 80 correct) within one year, starting from A1.

## 1. Goals and non-goals

**Goals**
- One app that replaces Duolingo (daily habit), WLingua (explained grammar) and Clozemaster (volume of sentence practice).
- Thousands of quick, multiple-choice questions, so practice never runs out.
- Practice that looks like the real exam, with a score estimate out of 80.
- Phone-first (iPhone), also good on an Android tablet. English and Italian only. No Turkish.

**Non-goals**
- Speaking, listening, or writing practice. YDS tests none of these, so audio is an optional memory aid only.
- Games such as crosswords or scramble. They teach little for the exam.
- Accounts, a server, or any paid service.
- Being a general Italian course. Everything serves the exam.

## 2. The exam model (from the 2013 English YDS booklet)

80 questions, five options each, one right answer, no negative marking, so always guess.
The Italian booklet may differ; this table is the template until we add a real Italian paper.

| Section | Qs | Skill |
|---|---|---|
| `vocab` | 6 | Word or phrase in context |
| `grammar` | 10 | Tenses, connectors, prepositions (often two blanks) |
| `cloze` | 10 | Passage with numbered blanks |
| `completion` | 10 | Finish the sentence logically |
| `translation` | 6 | Translate between the exam language and Turkish (we use Italian to English) |
| `reading` | 20 | Passage comprehension |
| `dialogue` | 5 | Complete a conversation |
| `paraphrase` | 4 | Closest-meaning sentence |
| `paragraph` | 4 | Fill the missing sentence of a paragraph |
| `irrelevant` | 5 | Find the sentence that doesn't belong |

Target: 44 correct. A realistic mix could be strong grammar, vocab, cloze, completion and dialogue (about 40 questions) plus about half of reading. The score estimator (section 7) tells you the real position.

## 3. How the learning works

Three layers, one loop:

1. **Learn**: the existing lesson structure (mental model, X-ray, bridge marker, quick check). Each lesson ends with a short check, then unlocks that topic's drills and SRS cards.
2. **Drill**: rounds of 10 quick questions on one topic. Wrong answers show a one-line explanation. Unlimited, drawn from the question bank.
3. **Exam**: the same question types as the booklet, first as small typed sets, later as full 80-question timed mocks.

**Spaced repetition** covers two things: vocabulary (the 1,000-word deck) and *questions you got wrong*. A missed question returns on the 1, 3, 7, 16, 35-day schedule already used in v1 (Leitner boxes).

## 4. The daily "Today" session (about 20 min)

The app builds it. You press one button.

1. **Reviews due** (cap 20 cards).
2. **New material**: the next step of your current lesson, or 10 new words.
3. **Weak-spot drill**: 10 questions from the topic with the lowest recent accuracy.
4. **Exam set**: 5 to 10 questions of one exam section, rotating, weighted toward sections where you lose the most points.
5. **Summary**: streak, topics improved, estimated score.

Extra modes stay available: pick a topic, pick an exam section, and (later) full mock.
Short on time? A "5-minute" button runs only steps 1 and 3.

## 5. Content system

### 5.1 Question format (one JSON shape for everything)

```json
{
  "id": "g-cong-00412",
  "section": "grammar",
  "topic": "congiuntivo.presente",
  "level": 3,
  "prompt": "Penso che Marco ---- molto stanco.",
  "options": ["è", "sia", "era", "sarebbe", "fosse"],
  "answer": 1,
  "explain": "'Penso che' triggers the present subjunctive: sia.",
  "source": "hand",
  "verified": true
}
```

Variants: a passage shared by several questions (cloze, reading), and a per-blank option list for double-blank grammar items. Fields `topic` and `section` drive all tracking.

### 5.2 Sources

| Source | Used for | Expected volume | Risk |
|---|---|---|---|
| **Generators** (code) | Verb forms, articles and contractions, plurals, agreement, preposition + article, participles | Effectively unlimited | Very low (rules are deterministic, verified against the PDFs' answer keys) |
| **Tatoeba sentences** (CC BY 2.0 FR, attribution page in app) | Cloze bank: blank a connector, preposition, article or verb form | Several thousand | Medium (some sentences are odd or wrong); filtered, see 5.3 |
| **Hand-written exam items** (written by Claude, then checked) | Vocabulary in context, connectors, completion, paraphrase, dialogue, irrelevant sentence, paragraph completion, reading passages | Target 1,500+ items over the year | Highest (Italian errors possible); see 5.3 |

### 5.3 Quality control

- Every item has `verified: true/false`. Unverified items never appear in exam mocks.
- Generated items are checked by rule tests (a test suite per generator).
- Tatoeba filter: 5 to 16 words, only common vocabulary, no names or slang, one blank, distractors from the same word class.
- Hand-written items go through a second independent review pass before `verified: true`.
- In-app **"Report"** button on every question. Reports are saved locally and exported with your backup, so errors can be fixed at once.
- Honest limit: I can't guarantee native-level correctness. Anything you doubt, report it, and cross-check with your PDF solutions.

### 5.4 Curriculum

Keep the 4 levels. Keep lessons 1.1 to 4.12. Add or deepen:

- Congiuntivo: presente, passato, imperfetto, trapassato, and the concordanza dei tempi
- Trapassato prossimo, futuro anteriore
- Ci and ne, combined pronouns, relative pronouns beyond "che" (cui, il quale)
- Implicit clauses (infinitive, participle, gerund: *dopo aver letto*, *pur essendo*)
- Verb + preposition pairs
- Comparatives and superlatives, indirect speech, passive with *andare*

Existing text content is reused, but each lesson needs a real drill set (target: 150 or more questions per lesson, drawn from the sources above).

## 6. Screens

1. **Today**: the daily session button, streak, due count, estimated score.
2. **Learn**: level, then lesson list, then lesson.
3. **Practice**: pick a topic, then rounds of 10.
4. **Exam**: pick a section or a mock. Mock mode: timer, no feedback until the end, flag-for-review.
5. **Words**: 1,000-word deck with search, audio and SRS toggle.
6. **Progress**: accuracy by topic and by section, estimated score, weak-spot list, history.
7. **Settings**: backup/restore, reports export, attributions.

Look: dark theme from v1, large tap targets, thumb-reachable buttons, one-handed use on an iPhone.

## 7. Tracking and the score estimator

Every answer stores: question id, section, topic, correct or wrong, time, date.

- **Topic mastery** = weighted accuracy over recent answers (recent counts more).
- **Section accuracy** per exam section.
- **Estimated score** = sum over sections of (section size × recent exam-style accuracy), scaled to 80 and then to 100. The app shows it as a range, not a single number, and shows "not enough data" below a minimum sample.
- The weak-spot picker reads these numbers, so it needs no manual setup.

## 8. Technical design

- **Stack**: plain static web app (HTML, CSS, JavaScript modules), installable as a PWA. No build server and no framework needed. Small and fast on a phone.
- **Storage**: IndexedDB for answers, SRS state, and progress (localStorage is too limited and fragile for this much data). Question bank ships as static JSON files, loaded per topic to keep the app quick.
- **Offline**: service worker caches the app and the question files.
- **Backup**: "Export" saves one JSON file (answers, SRS, reports). "Import" restores it. Reminder every 7 days. This is how progress moves between the iPhone and the tablet; there is no server.
- **iOS notes**: install via Share → Add to Home Screen. Installed apps keep storage far more reliably than Safari tabs. Italian text-to-speech works on iOS but depends on the installed voice.
- **Hosting**: static site on GitHub Pages or Netlify (free, HTTPS). Needed because an iPhone can't open the app from a file.
- **Code layout** (replaces the current root `js/` mess):
  - `app/`: shell and screens
  - `engine/`: session builder, SRS, scoring, storage
  - `generators/`: verb, article, plural, preposition, and so on, each with tests
  - `content/`: lessons, words, questions (JSON)
  - `tools/`: scripts for importing Tatoeba, validating the bank, building a stats report
- **Testing**: unit tests for engine and generators; a validator that checks every question (5 options, one answer, no duplicates, required fields).

## 9. What happens to the current folder

- PDFs stay untouched; you work through them yourself.
- `data.js` lessons and `mille1000.js` words are migrated into `content/` and kept.
- `palazzo_palace/` and the duplicate files in root `js/` and `css/` are not part of v2. I'd move them into an `archive/` folder rather than delete them.
- The old Mille app keeps working until v2 replaces it. Your v1 progress export can be imported once.

## 10. Build order

1. **Foundations**: new project layout, storage, question format, validator, Today screen skeleton, import of existing lessons and words.
2. **Practice engine**: drill rounds, SRS for questions and words, progress tracking.
3. **Level 1 and 2 content at volume** (generators, first Tatoeba import, hand-written items). This is the first usable version.
4. **Levels 3 and 4 content and the added curriculum**.
5. **Exam mode**: each section type, passage question types, then full timed mocks.
6. **Score estimator and weak-spot logic polish**.
7. **Final phase**: ongoing content growth, weak-spot tuning, mock exams.

Each step ends with something you can use on your phone. Steps 1 to 3 are the priority; you could start studying as soon as step 3.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Italian mistakes in generated or hand-written questions | Verified flag, second review pass, in-app Report button, PDF answer keys as a check |
| Italian exam differs from the English template | Add one real Italian booklet when you have it; sections are configurable |
| Losing progress (no server) | Weekly backup reminder, plain JSON export |
| Content volume is huge | Generators first; hand-written items prioritized by exam weight |
| Scope creep | Only features above; anything else waits |

## 12. Decisions made

1. Hosting: GitHub Pages, repo `https://github.com/buzunkopru/Italian` (public, currently empty).
2. v1 progress is not carried over. v2 starts fresh.
3. The Today session stays at 20 minutes, with the 5-minute short mode.
4. The app keeps the name "Mille" for now.

Note: a public repo means the question bank and lesson text are public. The YDS English PDF and the Schede PDFs are third-party material, so they are kept out of the repo (see section 9 and `.gitignore` in the plan).
