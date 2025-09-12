// src/ml/tips.js

// Accepts: "LOW" | "MEDIUM" | "HIGH" | "OK" | "AT_RISK"
export function normalizeRisk(risk) {
  const r = String(risk || "").toUpperCase();
  if (r === "OK") return "LOW";
  if (r === "AT_RISK") return "HIGH";
  if (["LOW", "MEDIUM", "HIGH"].includes(r)) return r;
  return "LOW";
}

// Base tips by risk (generic, safe)
const RISK_BASE = {
  LOW: [
    "😊 Keep doing what works: note 1 thing that went well today",
    "🏃‍♂️ 10–15 min light movement or a short walk",
    "💧 Hydrate and take 3 slow breaths before tasks",
    "📅 Keep a consistent sleep/wake window",
  ],
  MEDIUM: [
    "🫁 Box breathing (4–4–4–4) for 2–3 minutes",
    "📝 Brain-dump: write everything on your mind (5 min)",
    "📵 Reduce stimulation: 30 min off social media",
    "🚶‍♀️ 15–20 min outdoor walk, gentle pace",
  ],
  HIGH: [
    "🧘 5–10 min guided breathing or body scan",
    "☎️ Reach out to a trusted person; share how you feel",
    "📓 Name the feeling + 1 small next step (2–3 min)",
    "🌙 Prioritize sleep: dim lights, no screens for 1 hour",
    "⏳ Keep plans simple; avoid new commitments today",
  ],
};

// Mood-specific nudges layered on top (optional)
const MOOD_TWEAKS = {
  anxiety: [
    "🫁 Try the 5–4–3–2–1 grounding technique",
    "👣 Slow, counted exhales (exhale longer than inhale)",
  ],
  sadness: [
    "🤝 Schedule a brief check-in with someone you trust",
    "🌤️ Sunlight exposure for 10 min",
  ],
  anger: [
    "⏸️ Pause + label the trigger; cool-down walk (10 min)",
    "✍️ Write an unsent note to process the feeling",
  ],
  fear: [
    "🔍 List what’s in/out of your control (2 columns)",
    "🧩 Break tasks into the tiniest possible next action",
  ],
  stress: [
    "📋 3-item priority list; everything else is ‘later’",
    "⏱️ 25–5 focus timer (Pomodoro x2)",
  ],
  shame: [
    "💬 Write a compassionate message to yourself",
    "🧑‍⚕️ Consider sharing with a safe person or counselor",
  ],
  lonely: [
    "📲 Send a ‘thinking of you’ text to someone",
    "🏘️ Step outside to a public space for a bit",
  ],
  calm: [
    "🧭 Capture what’s working in 3 bullets",
    "🔁 Schedule more of what helped you feel calm",
  ],
  happy: [
    "🎧 Make a 2–song feel-good playlist",
    "🙌 Write down one win to revisit later",
  ],
  excited: [
    "🗺️ Channel energy: plan one concrete next step",
    "🧘 3 slow breaths to keep excitement balanced",
  ],
  confused: [
    "🧱 One small task you can finish in 10 min",
    "🧩 Ask: ‘What’s the real question?’ Write it down",
  ],
};

// Main function
export function tipsFor(risk, mood) {
  const R = normalizeRisk(risk); // LOW/MEDIUM/HIGH
  const m = String(mood || "").toLowerCase();

  const base = RISK_BASE[R] || RISK_BASE.LOW;
  const moodAdd = MOOD_TWEAKS[m] || [];

  // Merge with mild de-duplication
  const seen = new Set();
  const combined = [];
  for (const t of [...moodAdd, ...base]) {
    const key = t.toLowerCase();
    if (!seen.has(key)) {
      combined.push(t);
      seen.add(key);
    }
  }
  return combined.slice(0, 5); // return top 5
}
