# Step 1 Plan: Foundations

Scope: a new project skeleton that runs on GitHub Pages, with storage, the question format, a validator, the Today screen skeleton, and the existing lessons and words imported. No new question content yet.

Done when: the site loads on the iPhone from the GitHub Pages URL, installs to the Home Screen, works offline, shows the Today screen and the Learn list with all 44 lessons, shows the Words deck, and `npm test` passes.

## Tasks

1. **Archive and repo hygiene**
   - Move `palazzo_palace/`, root `js/`, root `css/`, old `index.html`, `sw.js`, `manifest.json` into `archive/v1/`.
   - Leave the PDFs where they are.
   - `git init`, add `.gitignore` excluding `*.pdf`, `archive/`, `node_modules/`.
   - Reason: the PDFs are third-party; the archive is dead code.

2. **Project skeleton**
   - `index.html`, `manifest.webmanifest`, `sw.js`
   - `app/` (screens), `engine/` (storage, srs, session, scoring), `content/`, `generators/`, `tools/`, `tests/`
   - Plain ES modules, no framework, no bundler. `package.json` only for running tests (Node's built-in test runner).

3. **Storage layer** (`engine/storage.js`)
   - IndexedDB wrapper: stores `answers`, `srs`, `settings`, `reports`.
   - Export all stores to one JSON file; import validates and restores.
   - Fallback to in-memory if IndexedDB is unavailable, with a visible warning.
   - Tests with a fake IndexedDB.

4. **Question format and validator** (`tools/validate.js`, `content/schema.md`)
   - Implements the JSON shape in DESIGN.md 5.1.
   - Checks: 5 options, answer index in range, no duplicate options, required fields, known `section` and `topic`, unique ids.
   - Tests with valid and invalid fixtures.

5. **Content import**
   - Convert `archive/v1/js/data.js` into `content/lessons/level-N.json` (lessons only; drop crosswords, the cloze arrays stay as seed questions for the validator).
   - Convert `mille1000.js` into `content/words.json`.
   - One-time script in `tools/`, then the output is checked in.

6. **Screens**
   - Router (hash-based), bottom tab bar: Today, Learn, Practice, Exam, Words, Progress.
   - Today: streak, "start" button (not yet functional beyond a stub), due count from SRS.
   - Learn: levels, lessons, lesson card (reuse the v1 lesson layout).
   - Words: search and filter over `words.json`.
   - Practice, Exam, Progress: placeholder pages.
   - Mobile-first CSS, dark theme, safe-area insets for the iPhone.

7. **PWA**
   - Manifest with real PNG icons (180, 192, 512) and iOS meta tags.
   - Service worker: precache app shell and content, cache-first for content, update on new version.

8. **Deploy**
   - Push to `buzunkopru/Italian` and enable GitHub Pages on the main branch.
   - Test URL on the iPhone: load, install, go offline.

## Order and checkpoints

1 → 2 → 4 → 3 → 5 → 6 → 7 → 8. After task 6, run the site locally and check at phone width. After task 8, verify on your actual iPhone.

## Not in step 1

Drill engine, SRS logic, generators, Tatoeba import, exam sections, score estimator. These are steps 2 onward.
