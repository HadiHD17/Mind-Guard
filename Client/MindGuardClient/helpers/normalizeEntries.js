// Keep ONLY serializable values in Redux (no Date objects)

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
      // store ms (number) so Redux is happy
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

  // ascending by time
  entries.sort((a, b) => a.createdAtMs - b.createdAtMs);
  return entries;
}

// filter last N days using timestamps
export function lastNDays(entries, days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((e) => e.createdAtMs >= cutoff);
}
