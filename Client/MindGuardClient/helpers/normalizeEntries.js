export function normalizeEntries(raw = []) {
  const entries = raw.map((e) => {
    const iso =
      e.createdAt ||
      e.CreatedAt ||
      e.date ||
      e.Date ||
      new Date().toISOString();
    const createdAtMs = new Date(iso).getTime();

    return {
      createdAtMs,
      mood:
        e.detectedEmotion ||
        e.DetectedEmotion ||
        e.mood ||
        e.Mood ||
        "confused",
      sentimentScore: e.sentimentScore ?? e.SentimentScore ?? e.sentiment ?? 0,
    };
  });

  entries.sort((a, b) => a.createdAtMs - b.createdAtMs);
  return entries;
}

export function lastNDays(entries, days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((e) => e.createdAtMs >= cutoff);
}
