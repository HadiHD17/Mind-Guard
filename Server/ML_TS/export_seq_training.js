// Server/ML_TS/export_seq_training.js
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const { Client } = require("pg");

// Tunables
const LOOKBACK_DAYS = 7; // window for features
const HORIZON_DAYS = 2; // predict risk within next 2 days

const NEGATIVE_MOODS = new Set([
  "anxiety",
  "sadness",
  "anger",
  "fear",
  "stress",
  "shame",
  "lonely",
  "confused",
]);
const MOODS = [
  "anxiety",
  "sadness",
  "anger",
  "fear",
  "stress",
  "shame",
  "lonely",
  "calm",
  "happy",
  "excited",
  "confused",
];

function toDate(x) {
  return new Date(x);
}
function avg(a) {
  return a.length ? a.reduce((p, c) => p + c, 0) / a.length : 0;
}
function lastK(a, k) {
  const s = a.slice(-k);
  return s.length ? s : [];
}

async function main() {
  const client = new Client({
    host: process.env.PGHOST || "localhost",
    port: +(process.env.PGPORT || 5432),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "mindguard",
  });
  await client.connect();

  // Pull from your Journal_Entry (PascalCase per your C# model)
  const q = `
    SELECT "UserId" AS user_id,
           "CreatedAt" AS created_at,
           COALESCE("DetectedEmotion",'') AS mood,
           COALESCE("SentimentScore",0) AS sentiment
    FROM "Journal_Entries"
    WHERE "SentimentScore" IS NOT NULL
    ORDER BY "UserId", "CreatedAt" ASC;
  `;
  const { rows } = await client.query(q);
  await client.end();

  // Group by user
  const byUser = new Map();
  for (const r of rows) {
    const u = r.user_id;
    if (!byUser.has(u)) byUser.set(u, []);
    byUser.get(u).push({
      t: toDate(r.created_at),
      mood: String(r.mood || "").toLowerCase(),
      s: Number(r.sentiment),
    });
  }

  const samples = [];
  for (const [userId, arr] of byUser) {
    if (arr.length < 6) continue;
    for (let i = 0; i < arr.length; i++) {
      const anchor = arr[i];
      // history window (last 7 days up to anchor)
      const winStart = new Date(anchor.t.getTime() - LOOKBACK_DAYS * 86400000);
      const hist = arr.filter((e) => e.t > winStart && e.t <= anchor.t);
      if (hist.length < 3) continue;

      // features
      const sentiments = hist.map((h) => h.s);
      const mean3 = avg(lastK(sentiments, 3));
      const mean7 = avg(sentiments);
      const trend3 = mean3 - mean7;
      const lastMood = String(hist[hist.length - 1].mood || "").toLowerCase();
      const moodCounts = Object.fromEntries(
        MOODS.map((m) => [`count_${m}`, 0])
      );
      for (const h of hist)
        if (moodCounts[`count_${h.mood}`] != null)
          moodCounts[`count_${h.mood}`]++;

      // future 48h window (label)
      const horizonEnd = new Date(anchor.t.getTime() + HORIZON_DAYS * 86400000);
      const future = arr.filter((e) => e.t > anchor.t && e.t <= horizonEnd);
      const futureMean = avg(future.map((f) => f.s));
      const futureHasNeg = future.some((f) => NEGATIVE_MOODS.has(f.mood));
      const label = futureHasNeg || futureMean <= -0.2 ? 1 : 0;

      samples.push({
        user_id: userId,
        anchor_time: anchor.t.toISOString(),
        mean3,
        mean7,
        trend3,
        lastMood,
        ...moodCounts,
        label,
      });
    }
  }

  // Write CSV
  const outPath = path.join(__dirname, "artifacts", "training_seq_proxy.csv");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Papa.unparse(samples), "utf8");

  const n = samples.length;
  const pos = samples.filter((s) => s.label === 1).length;
  console.log(`✅ Wrote ${n} rows -> ${path.relative(process.cwd(), outPath)}`);
  console.log(
    `   Label distribution: 0=${n - pos}, 1=${pos} (pos ${
      n ? ((pos / n) * 100).toFixed(1) : 0
    }%)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
