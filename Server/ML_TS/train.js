// train.js — TensorFlow.js (WASM backend) trainer that saves model files to disk
// Requirements (in your mg-ml folder):
//   npm i @tensorflow/tfjs @tensorflow/tfjs-backend-wasm papaparse fs-extra
//
// Run: node train.js

const fs = require("fs-extra");
const path = require("path");
const Papa = require("papaparse");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-backend-wasm");

// --- config ---
const CSV_PATH = path.join(__dirname, "artifacts", "training_unified.csv");
const OUT_DIR = path.join(__dirname, "artifacts", "model_mg_risk_v1");

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
]; // keep in sync with prep.js
const RISKS = ["LOW", "MEDIUM", "HIGH"];

// --- utils ---
function oneHot(idx, len) {
  const a = new Array(len).fill(0);
  if (idx >= 0) a[idx] = 1;
  return a;
}
const MOOD_INDEX = Object.fromEntries(MOODS.map((m, i) => [m, i]));
const RISK_INDEX = Object.fromEntries(RISKS.map((r, i) => [r, i]));

function loadRows(p) {
  const raw = fs.readFileSync(p, "utf8");
  return Papa.parse(raw, { header: true, skipEmptyLines: true }).data;
}

function toXY(rows) {
  const X = [];
  const Y = [];
  const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };

  for (const r of rows) {
    const moodIdx = MOOD_INDEX[r.dominant_mood];
    const riskIdx = RISK_INDEX[r.risk_label];
    if (moodIdx == null || riskIdx == null) continue;

    const s = parseFloat(r.sentiment_score);
    if (Number.isNaN(s)) continue;

    // feature vector: [ sentiment, ...mood one-hot ]
    const x = [s, ...oneHot(moodIdx, MOODS.length)];
    const y = oneHot(riskIdx, RISKS.length);

    X.push(x);
    Y.push(y);
    counts[RISKS[riskIdx]]++;
  }
  return { X, Y, counts };
}

function computeClassWeights(counts) {
  // inverse frequency
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const weights = {};
  for (const [label, n] of Object.entries(counts)) {
    weights[RISK_INDEX[label]] = total / (RISKS.length * Math.max(1, n));
  }
  return weights;
}

// --- custom filesystem saver for pure tfjs (wasm/cpu) ---
async function saveModelToFS(model, outDir) {
  await fs.ensureDir(outDir);

  await model.save(
    tf.io.withSaveHandler(async (artifacts) => {
      const { modelTopology, weightSpecs, weightData } = artifacts;

      // Write model.json with a weights manifest that points to weights.bin
      const modelJSON = {
        modelTopology,
        format: "layers-model",
        generatedBy: `tfjs v${tf.version_core || tf.version.tfjs || "unknown"}`,
        convertedBy: null,
        weightsManifest: [
          {
            paths: ["group1-shard1of1.bin"],
            weights: weightSpecs,
          },
        ],
      };

      await fs.writeFile(
        path.join(outDir, "model.json"),
        JSON.stringify(modelJSON)
      );
      await fs.writeFile(
        path.join(outDir, "group1-shard1of1.bin"),
        Buffer.from(weightData)
      );

      return {
        modelArtifactsInfo: {
          dateSaved: new Date(),
          modelTopologyType: "JSON",
          modelTopologyBytes: Buffer.byteLength(
            JSON.stringify(modelTopology || {})
          ),
          weightSpecsBytes: Buffer.byteLength(
            JSON.stringify(weightSpecs || [])
          ),
          weightDataBytes: weightData ? weightData.byteLength : 0,
        },
      };
    })
  );
}

// --- main training flow ---
async function main() {
  console.log("Setting backend to WASM...");
  await tf.setBackend("wasm"); // or 'cpu' if wasm causes issues on your machine
  await tf.ready();
  console.log("TFJS backend:", tf.getBackend());

  console.log("↻ loading", path.relative(process.cwd(), CSV_PATH));
  const rows = loadRows(CSV_PATH);

  // shuffle rows
  tf.util.shuffle(rows);

  const { X, Y, counts } = toXY(rows);
  console.log("samples:", X.length, "class counts:", counts);

  const featLen = X[0].length; // 1 + MOODS.length

  // split
  const n = X.length;
  const nTrain = Math.floor(n * 0.8);
  const nVal = Math.floor(n * 0.1);
  const xT = tf.tensor2d(X);
  const yT = tf.tensor2d(Y);

  const xTrain = xT.slice([0, 0], [nTrain, featLen]);
  const yTrain = yT.slice([0, 0], [nTrain, RISKS.length]);
  const xVal = xT.slice([nTrain, 0], [nVal, featLen]);
  const yVal = yT.slice([nTrain, 0], [nVal, RISKS.length]);
  const xTest = xT.slice([nTrain + nVal, 0], [n - nTrain - nVal, featLen]);
  const yTest = yT.slice([nTrain + nVal, 0], [n - nTrain - nVal, RISKS.length]);

  // model
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 64, activation: "relu", inputShape: [featLen] })
  );
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: RISKS.length, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(1e-3),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  const classWeight = computeClassWeights(counts);
  console.log("classWeight:", classWeight);

  const es = tf.callbacks.earlyStopping({
    monitor: "val_acc", // WAS 'val_accuracy' — use 'val_acc' in tfjs
    patience: 3,
    restoreBestWeight: true,
  });

  const hist = await model.fit(xTrain, yTrain, {
    epochs: 15,
    batchSize: 512, // reduce if WASM RAM is tight (e.g., 128–256)
    validationData: [xVal, yVal],
    classWeight,
    callbacks: [es],
    verbose: 1,
  });

  const evalRes = model.evaluate(xTest, yTest);
  const [loss] = await evalRes[0].data();
  const [acc] = await evalRes[1].data();
  console.log(
    `\nTest loss: ${loss.toFixed(4)}  acc: ${(acc * 100).toFixed(2)}%`
  );

  // confusion matrix
  const yPred = model.predict(xTest);
  const predArr = yPred.arraySync();
  const trueArr = yTest.arraySync();
  const cm = Array.from({ length: 3 }, () => [0, 0, 0]);
  for (let i = 0; i < predArr.length; i++) {
    const p = predArr[i].indexOf(Math.max(...predArr[i]));
    const t = trueArr[i].indexOf(1);
    cm[t][p] += 1;
  }
  console.log("Confusion matrix rows = true [LOW,MEDIUM,HIGH]:");
  console.table(cm);

  // save model + meta
  await fs.ensureDir(OUT_DIR);
  await saveModelToFS(model, OUT_DIR);

  fs.writeFileSync(
    path.join(OUT_DIR, "meta.json"),
    JSON.stringify({ MOODS, RISKS, featLen }, null, 2)
  );

  console.log("\nSaved model to:", path.relative(process.cwd(), OUT_DIR));
}

// kick off
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
