const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-backend-wasm");
const { spawnSync } = require("child_process");
const {
  getOrCreateExperiment,
  createRun,
  logParam,
  logMetric,
} = require("./mlflow");

const CSV = path.join(__dirname, "artifacts", "training_seq_proxy.csv");
const OUT_DIR = path.join(__dirname, "artifacts", "model_mg_seq_v1");
const EXP = "mg-seq-risk";
const THRESHOLD = 0.6;
const EPOCHS = 30;
const BATCH = 16;
const SEQ_LEN = 7;

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

function loadRows() {
  const raw = fs.readFileSync(CSV, "utf8");
  const rows = Papa.parse(raw, { header: true, skipEmptyLines: true }).data;
  return rows
    .map((r) => ({
      mean3: +r.mean3,
      mean7: +r.mean7,
      trend3: +r.trend3,
      lastMood: String(r.lastMood || "").toLowerCase(),
      counts: MOODS.map((m) => +r[`count_${m}`] || 0),
      label: +r.label, // 0/1
    }))
    .filter(
      (r) =>
        Number.isFinite(r.mean3) &&
        Number.isFinite(r.mean7) &&
        Number.isFinite(r.trend3) &&
        (r.label === 0 || r.label === 1)
    );
}

function oneHotMood(mood) {
  return MOODS.map((m) => (m === mood ? 1 : 0));
}

function toXY(rows) {
  const X = [];
  const Y = [];
  for (const r of rows) {
    const x = [
      r.mean3,
      r.mean7,
      r.trend3,
      ...r.counts,
      ...oneHotMood(r.lastMood),
    ];
    X.push(x);
    Y.push(r.label);
  }
  return { X, Y, featLen: X[0]?.length || 0 };
}

function timeSplit(rows) {
  const n = rows.length;
  const nTrain = Math.max(1, Math.floor(n * 0.75));
  const nVal = Math.max(1, Math.floor(n * 0.1));
  const train = rows.slice(0, nTrain);
  const val = rows.slice(nTrain, nTrain + nVal);
  const test = rows.slice(nTrain + nVal);
  return { train, val, test };
}

async function saveModelToDir(model, outDir) {
  fs.mkdirSync(outDir, { recursive: true });

  const saveHandler = tf.io.withSaveHandler(async (artifacts) => {
    const weightsPath = path.join(outDir, "group1-shard1of1.bin");
    await fs.promises.writeFile(weightsPath, Buffer.from(artifacts.weightData));

    const modelJson = {
      modelTopology: artifacts.modelTopology,
      weightsManifest: [
        {
          paths: ["group1-shard1of1.bin"],
          weights: artifacts.weightSpecs,
        },
      ],
      format: "layers-model",
      generatedBy: "@tensorflow/tfjs",
      convertedBy: null,
    };
    const modelJsonPath = path.join(outDir, "model.json");
    await fs.promises.writeFile(
      modelJsonPath,
      JSON.stringify(modelJson, null, 2),
      "utf8"
    );

    return {
      modelArtifactsInfo: {
        dateSaved: new Date(),
        modelTopologyType: "JSON",
        modelTopologyBytes: JSON.stringify(modelJson.modelTopology).length,
        weightSpecsBytes: JSON.stringify(modelJson.weightsManifest).length,
        weightDataBytes: artifacts.weightData.byteLength,
      },
    };
  });

  await model.save(saveHandler);
}

(async () => {
  await tf.setBackend("wasm");
  await tf.ready();
  console.log("TFJS backend:", tf.getBackend());

  const rows = loadRows();
  const n = rows.length;
  const pos = rows.filter((r) => r.label === 1).length;
  const neg = n - pos;
  console.log(`rows=${n}  pos=${pos}  neg=${neg}`);
  if (n < 40 || pos === 0 || neg === 0) {
    console.error("Not enough balanced data. Add more labeled rows.");
    process.exit(1);
  }

  const { train, val, test } = timeSplit(rows);
  const dTr = toXY(train);
  const dVa = toXY(val);
  const dTe = toXY(test);

  const xTr = tf.tensor2d(dTr.X);
  const yTr = tf.tensor1d(dTr.Y).toFloat();
  const xVa = tf.tensor2d(dVa.X);
  const yVa = tf.tensor1d(dVa.Y).toFloat();
  const xTe = tf.tensor2d(dTe.X);
  const yTe = tf.tensor1d(dTe.Y).toFloat();

  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
      inputShape: [dTr.featLen],
    })
  );
  model.add(tf.layers.dropout({ rate: 0.25 }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({
    optimizer: tf.train.adam(1e-3),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  const posTr = dTr.Y.filter((y) => y === 1).length;
  const negTr = dTr.Y.length - posTr;
  const classWeight = {
    0: dTr.Y.length / (2 * Math.max(1, negTr)),
    1: dTr.Y.length / (2 * Math.max(1, posTr)),
  };
  console.log("classWeight:", classWeight, "train pos/neg:", posTr, negTr);

  const es = tf.callbacks.earlyStopping({
    monitor: "val_loss",
    patience: 3,
    restoreBestWeight: true,
  });

  const hist = await model.fit(xTr, yTr, {
    epochs: EPOCHS,
    batchSize: BATCH,
    validationData: [xVa, yVa],
    classWeight,
    callbacks: [es],
    verbose: 1,
  });

  const [lossT, accT] = model.evaluate(xTe, yTe).map((t) => t.dataSync()[0]);
  const probs = model.predict(xTe).dataSync();
  const yPred = Array.from(probs).map((p) => (p >= THRESHOLD ? 1 : 0));
  const yTrue = yTe.dataSync();

  let tp = 0,
    fp = 0,
    tn = 0,
    fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
  }
  const prec = tp / (tp + fp || 1);
  const rec = tp / (tp + fn || 1);
  const f1 = (2 * prec * rec) / (prec + rec || 1);

  console.log(
    `\nTest loss: ${lossT.toFixed(4)}  acc: ${(accT * 100).toFixed(
      1
    )}%  F1: ${f1.toFixed(3)}`
  );
  console.table({
    tp,
    fp,
    tn,
    fn,
    prec: +prec.toFixed(3),
    rec: +rec.toFixed(3),
    f1: +f1.toFixed(3),
  });

  await saveModelToDir(model, OUT_DIR);
  fs.writeFileSync(
    path.join(OUT_DIR, "meta.json"),
    JSON.stringify(
      {
        MOODS,
        featSpec: "mean3,mean7,trend3,counts(11),lastMoodOneHot(11)",
        lookbackDays: 7,
        horizonDays: 2,
        threshold: THRESHOLD,
      },
      null,
      2
    )
  );
  console.log("\nSaved model to:", path.relative(process.cwd(), OUT_DIR));

  try {
    const tracking = process.env.MLFLOW_TRACKING_URI || "http://localhost:5000";
    console.log("Logging to MLflow at:", tracking);

    const expId = await getOrCreateExperiment(EXP);
    const runId = await createRun(
      expId,
      `run_${new Date().toISOString().slice(0, 19)}`
    );

    await logParam(runId, "threshold", THRESHOLD);
    await logParam(runId, "epochs", EPOCHS);
    await logParam(runId, "batch_size", BATCH);
    await logParam(runId, "optimizer", "adam");
    await logParam(runId, "seq_len", SEQ_LEN);
    await logParam(runId, "feat_len", dTr.featLen);

    await logMetric(runId, "test_acc", accT);
    await logMetric(runId, "test_loss", lossT);
    await logMetric(runId, "test_f1", f1);
    await logMetric(runId, "tp", tp);
    await logMetric(runId, "fp", fp);
    await logMetric(runId, "tn", tn);
    await logMetric(runId, "fn", fn);

    const env = { ...process.env, MLFLOW_TRACKING_URI: tracking };
    const py = spawnSync(
      "python",
      [
        "mlflow_log_artifacts.py",
        "--experiment",
        EXP,
        "--run_id",
        runId,
        "--params",
        JSON.stringify({ trainer: "node-tfjs", dataset_rows: n }),
        "--metrics",
        JSON.stringify({}),
        "--artifacts_dir",
        OUT_DIR,
      ],
      { stdio: "inherit", env }
    );
    if (py.status !== 0) {
      console.error("MLflow artifact logging failed");
    } else {
      console.log("MLflow logging complete for run:", runId);
    }
  } catch (e) {
    console.error("MLflow logging error:", e.message || e);
  }

  xTr.dispose();
  yTr.dispose();
  xVa.dispose();
  yVa.dispose();
  xTe.dispose();
  yTe.dispose();
})();
