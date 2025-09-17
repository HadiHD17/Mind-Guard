// __mocks__/normalize-entries.js

// Return a predictable normalized structure so tests don’t touch real logic.
const normalizeEntries = (entries = []) =>
  entries.map((e) => ({
    id: e?.id ?? "id",
    date: e?.date ?? "1970-01-01",
    content: e?.content ?? "",
    mood: e?.mood ?? "neutral",
    score: typeof e?.score === "number" ? e.score : 0,
  }));

// Simple deterministic "last N days" helper
const lastNDays = (n = 7, from = new Date("1970-01-08")) => {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
};

module.exports = { normalizeEntries, lastNDays };
