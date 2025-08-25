// mlService.js

export function fillMissing(rows) {
  let lastMood = 3;
  let lastSent = 0;
  return rows.map((r) => {
    const mood = r.moodScore != null ? r.moodScore : lastMood;
    const sent = r.sentimentScore != null ? r.sentimentScore : lastSent;
    lastMood = mood;
    lastSent = sent;
    return { ...r, moodScore: mood, sentimentScore: sent };
  });
}

function toFeatures(r) {
  const moodNorm = r.moodScore / 5;
  const sentNorm = (r.sentimentScore + 1) / 2;
  const wrote = r.wroteJournal ? 1 : 0;
  const dow = r.dayOfWeek / 6;
  return [moodNorm, sentNorm, wrote, dow];
}

export function lastWindow(rows, windowSize = 7) {
  const filled = fillMissing(rows);
  const sub = filled.slice(-windowSize);
  return sub.map(toFeatures).flat();
}

// ---- simple model (pure JS) ----
export function trainAndPredict(dailyRows) {
  if (!dailyRows || dailyRows.length < 7) {
    return {
      probability: 0.3,
      label: "Normal",
      note: "Not enough history; defaulting normal.",
    };
  }

  const filled = fillMissing(dailyRows);
  const lowMoodCount = filled.filter((r) => r.moodScore <= 2).length;
  const prob = Math.min(1, lowMoodCount / filled.length + 0.2);

  return {
    probability: prob,
    label: prob >= 0.5 ? "At-Risk" : "Normal",
    note: "Prediction computed from last 15 days",
  };
}

export function tipsFor(prob) {
  if (prob >= 0.8)
    return ["5-min breathing now", "Text a friend", "Wind-down early tonight"];
  if (prob >= 0.6)
    return ["10-min walk", "Gratitude note", "Short guided meditation"];
  return [
    "Keep your routine streak",
    "Hydration check",
    "Plan a 5-min break tomorrow",
  ];
}
