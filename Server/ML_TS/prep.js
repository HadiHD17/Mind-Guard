// prep.js
const fs = require("fs-extra");
const Papa = require("papaparse");
const vader = require("vader-sentiment");
const _ = require("lodash");
const path = require("path");

// ==== Config ====
const DATA_DIR = path.join(__dirname, "data");
const OUT_DIR = path.join(__dirname, "artifacts");
const OUT_PATH = path.join(OUT_DIR, "training_unified.csv");

// Final moods we’ll train on
const MOODS = [
  "anxiety",
  "sadness",
  "anger",
  "fear",
  "shame",
  "stress",
  "lonely",
  "calm",
  "happy",
  "excited",
  "confused",
];

// Map GoEmotions (columns) -> our moods
const GOEMO_TO_MOOD = {
  admiration: "happy",
  amusement: "happy",
  joy: "happy",
  love: "happy",
  optimism: "happy",
  gratitude: "happy",
  pride: "happy",
  approval: "happy",
  relief: "calm",
  realization: "calm",
  caring: "calm",
  surprise: "excited",
  curiosity: "excited",
  desire: "excited",
  excitement: "excited",
  anger: "anger",
  annoyance: "anger",
  disgust: "anger",
  disapproval: "anger",
  fear: "fear",
  nervousness: "anxiety",
  confusion: "confused",
  sadness: "sadness",
  disappointment: "sadness",
  grief: "sadness",
  remorse: "shame",
  embarrassment: "shame",
};
// Priority if multiple flags are 1 for the same row
const MOOD_PRIORITY = [
  "anxiety",
  "fear",
  "sadness",
  "shame",
  "stress",
  "anger",
  "lonely",
  "confused",
  "excited",
  "calm",
  "happy",
];

// Thresholds for risk heuristic (tweak later if you like)
const HIGH_NEG = -0.65;
const MED_NEG = -0.4;

// ==== Helpers ====
function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return Papa.parse(raw, { header: true, skipEmptyLines: true }).data;
}

function toLowerNoSpace(s) {
  return String(s || "").toLowerCase();
}

// Normalize any free-text mood/status to our MOODS set
function normalizeMood(raw) {
  const s = toLowerNoSpace(raw);
  if (s.includes("anx")) return "anxiety";
  if (s.includes("sad") || s.includes("depr")) return "sadness";
  if (s.includes("ang") || s.includes("mad")) return "anger";
  if (s.includes("fear") || s.includes("panic") || s.includes("worr"))
    return "fear";
  if (s.includes("sham") || s.includes("guilt") || s.includes("embarr"))
    return "shame";
  if (s.includes("stress") || s.includes("overwhelm")) return "stress";
  if (s.includes("lonely") || s.includes("alone")) return "lonely";
  if (s.includes("calm") || s.includes("fine") || s.includes("ok"))
    return "calm";
  if (s.includes("happy") || s.includes("joy")) return "happy";
  if (s.includes("excite") || s.includes("energ")) return "excited";
  if (s.includes("confus")) return "confused";
  return "confused";
}

// VADER sentiment score −1..+1
function sentimentScore(text) {
  const t = String(text || "");
  const { compound } = vader.SentimentIntensityAnalyzer.polarity_scores(t);
  return Math.max(-1, Math.min(1, compound));
}

// Heuristic for risk label from features
function riskFromFeatures(sent, mood) {
  const veryHigh = new Set(["fear", "anxiety", "sadness", "shame"]);
  const negative = new Set([
    "anxiety",
    "sadness",
    "anger",
    "fear",
    "shame",
    "stress",
    "lonely",
  ]);
  if (sent <= HIGH_NEG && veryHigh.has(mood)) return "HIGH";
  if (sent <= MED_NEG && negative.has(mood)) return "MEDIUM";
  return "LOW";
}

// Get first active emotion from GoEmotions row with our priority
function dominantMoodFromGoEmotions(row) {
  // Collect active moods mapped to our set
  const active = [];
  for (const [emo, targetMood] of Object.entries(GOEMO_TO_MOOD)) {
    const v = row[emo];
    if (v === 1 || v === "1") active.push(targetMood);
  }
  if (active.length === 0) {
    // "neutral" or nothing active → fallback to 'confused'
    return "confused";
  }
  // Pick by priority
  for (const m of MOOD_PRIORITY) {
    if (active.includes(m)) return m;
  }
  // fallback to first mapped
  return active[0];
}

// ==== Loaders ====
function fromCombined() {
  const file = path.join(DATA_DIR, "combined_data.csv");
  const rows = readCsv(file);
  const out = [];

  for (const r of rows) {
    // Handle the “empty first column” by ignoring it.
    const text = r.statement ?? r.text ?? r[""] ?? "";
    const status = r.status ?? r.mood ?? r.label ?? "";
    const mood = normalizeMood(status);
    const sent = sentimentScore(text);
    const risk = riskFromFeatures(sent, mood);
    if (!text) continue;
    out.push({
      text,
      dominant_mood: mood,
      sentiment_score: sent,
      risk_label: risk,
    });
  }
  return out;
}

function fromGoEmotions(fileName) {
  const file = path.join(DATA_DIR, fileName);
  const rows = readCsv(file);
  const out = [];

  for (const r0 of rows) {
    // Ensure 0/1 numbers for emotion flags (Papa may parse as strings)
    const r = { ...r0 };
    for (const k of Object.keys(GOEMO_TO_MOOD)) {
      if (r[k] === "1") r[k] = 1;
      if (r[k] === "0") r[k] = 0;
    }

    const text = r.text ?? r.comment_text ?? r.body ?? "";
    if (!text) continue;

    const mood = dominantMoodFromGoEmotions(r);
    const sent = sentimentScore(text);
    const risk = riskFromFeatures(sent, mood);

    out.push({
      text,
      dominant_mood: mood,
      sentiment_score: sent,
      risk_label: risk,
    });
  }
  return out;
}

// ==== Main ====
(async () => {
  await fs.ensureDir(OUT_DIR);

  const a = fromCombined();
  const b1 = fromGoEmotions("goemotions_1.csv");
  const b2 = fromGoEmotions("goemotions_2.csv");
  const b3 = fromGoEmotions("goemotions_3.csv");

  // Merge
  let merged = a.concat(b1, b2, b3);

  // Basic cleanup: trim text, drop dupes by text
  merged = merged
    .map((r) => ({
      ...r,
      text: String(r.text).replace(/\s+/g, " ").trim(),
    }))
    .filter((r) => r.text.length > 0);

  merged = _.uniqBy(merged, (r) => r.text.toLowerCase());

  // Write CSV
  const csv = Papa.unparse(merged, {
    columns: ["text", "dominant_mood", "sentiment_score", "risk_label"],
  });
  await fs.writeFile(OUT_PATH, csv, "utf8");

  // Print a small report
  const total = merged.length;
  const moodCounts = _.countBy(merged, "dominant_mood");
  const riskCounts = _.countBy(merged, "risk_label");

  console.log(
    `\n✅ Wrote ${total} rows -> ${path.relative(process.cwd(), OUT_PATH)}`
  );
  console.log("   Mood distribution:", moodCounts);
  console.log("   Risk distribution:", riskCounts);
})();
