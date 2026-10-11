# Mille

Personal study app for the Italian YDS exam (goal: 55+). Phone-first PWA, no server, no framework.

- Design: `docs/DESIGN.md`
- Current plan: `docs/PLAN-step1-foundations.md`

## Commands

```
npm test         # unit tests
npm run validate # check every question in content/questions
npm run serve    # http://localhost:8080
npm run gen      # rebuild generated questions (content/questions/gen-*.json) and the index
npm run sample -- lesson.1.2 5   # print random generated questions to eyeball
npm run import   # one-time import of v1 lessons/words (needs archive/v1, which is not in git)
```

## Credits

Sentences from [Tatoeba](https://tatoeba.org) (CC BY 2.0 FR) will be credited here when added.

