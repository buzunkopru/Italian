# Attribution

## Tatoeba sentences

`content/questions/tatoeba-cloze.json` contains Italian sentences and English translations from
[Tatoeba](https://tatoeba.org), written by its volunteer contributors and released under
[CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/).

- Source: weekly exports at https://downloads.tatoeba.org/exports/ (downloaded 2026-10-11).
- Changes: sentences were filtered, one word was replaced by a blank, and distractor options were added.
- Every question keeps the original sentence id in its `ref` field (`tatoeba:<id>`); the author of a sentence
  can be found at `https://tatoeba.org/sentences/show/<id>`.
