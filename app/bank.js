// The question bank: every file listed in content/questions/index.json, loaded once.
let bankPromise;

export function loadBank() {
  if (!bankPromise) {
    bankPromise = (async () => {
      const idx = await (await fetch('content/questions/index.json')).json();
      const lists = await Promise.all(idx.files.map(async (f) => {
        const r = await fetch(`content/questions/${f}`);
        if (!r.ok) throw new Error(`Could not load ${f}`);
        return r.json();
      }));
      const questions = lists.flat();
      return { questions, byId: new Map(questions.map((q) => [q.id, q])) };
    })();
    bankPromise.catch(() => { bankPromise = null; });
  }
  return bankPromise;
}
