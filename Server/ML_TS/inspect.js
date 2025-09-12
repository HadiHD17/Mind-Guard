// inspect.js  (CommonJS so no extra config needed)
const fs = require("fs-extra");
const Papa = require("papaparse");
const path = require("path");

const FILES = [
  { key: "combined", file: "combined_data.csv" },
  { key: "goemo1", file: "goemotions_1.csv" },
  { key: "goemo2", file: "goemotions_2.csv" },
  { key: "goemo3", file: "goemotions_3.csv" },
];

function truncate(s, n = 90) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, n);
}

function guessText(row) {
  const candidates = ["text", "statement", "content", "body", "comment_text"];
  for (const k of candidates) if (k in row) return row[k];
  // fallback: first column value
  const firstKey = Object.keys(row)[0];
  return row[firstKey];
}

function guessMood(row) {
  const candidates = ["status", "mood", "label"];
  for (const k of candidates) if (k in row) return row[k];
  return null;
}

async function readCsv(p) {
  const raw = await fs.readFile(p, "utf8");
  const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
  return parsed.data;
}

async function inspectOne(relPath) {
  const full = path.join(__dirname, "data", relPath);
  if (!(await fs.pathExists(full))) {
    console.log(`⚠️  Missing: data/${relPath}`);
    return null;
  }
  const rows = await readCsv(full);
  const count = rows.length;
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  // heuristic: columns that look like emotions (0/1 values)
  const emoCols = headers.filter((h) => {
    const v = rows[0]?.[h];
    return v === "0" || v === "1" || v === 0 || v === 1;
  });

  console.log(`\n📄 ${relPath}`);
  console.log(`   rows: ${count}`);
  console.log(`   headers (${headers.length}): ${headers.join(", ")}`);
  if (emoCols.length)
    console.log(
      `   likely emotion flags: ${emoCols.slice(0, 20).join(", ")}${
        emoCols.length > 20 ? " …" : ""
      }`
    );

  // sample a few
  const sample = rows.slice(0, 3);
  sample.forEach((r, i) => {
    console.log(`   ├─ sample ${i + 1}:`);
    console.log(`   │   text: "${truncate(guessText(r))}"`);
    const mood = guessMood(r);
    if (mood != null)
      console.log(`   │   mood/status/label: "${truncate(mood)}"`);
  });

  return { headers, count };
}

(async () => {
  console.log("🔎 Inspecting CSVs in ./data ...");
  for (const f of FILES) {
    await inspectOne(f.file);
  }
  console.log("\n✅ Done. Share this output so we can lock the schema.");
})();
