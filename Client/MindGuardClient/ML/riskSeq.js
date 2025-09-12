// src/ml/riskSeq.js
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

// must match your training
export const MOODS = [
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

let model = null;

export async function loadSeqModel() {
  await tf.ready();
  if (model) return model;
  const modelJson = require("../assets/model/mg-seq-v1/model.json");
  const weights = [require("../assets/model/mg-seq-v1/group1-shard1of1.bin")];
  model = await tf.loadLayersModel(bundleResourceIO(modelJson, weights));
  return model;
}

function avg(a) {
  return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
}

function countsFor(entries) {
  const counts = Object.fromEntries(MOODS.map((m) => [m, 0]));
  for (const e of entries) {
    const m = String(e.mood || "").toLowerCase();
    if (counts[m] != null) counts[m] += 1;
  }
  return MOODS.map((m) => counts[m]);
}

export function buildFeatures(last7daysEntries) {
  const sentiments = last7daysEntries.map((e) => +e.sentimentScore || 0);
  const mean3 = avg(sentiments.slice(-3));
  const mean7 = avg(sentiments);
  const trend3 = mean3 - mean7;

  const lastMood = String(
    last7daysEntries[last7daysEntries.length - 1]?.mood || ""
  ).toLowerCase();
  const lastMoodOneHot = MOODS.map((m) => (m === lastMood ? 1 : 0));
  const moodCounts = countsFor(last7daysEntries);

  return [mean3, mean7, trend3, ...moodCounts, ...lastMoodOneHot];
}

export function predictSeqRisk(last7daysEntries, threshold = 0.5) {
  if (!model) throw new Error("Seq model not loaded");
  const x = buildFeatures(last7daysEntries);
  const t = tf.tensor2d([x], [1, x.length]);
  const p = model.predict(t).dataSync()[0];
  t.dispose();
  return { prob: p, label: p >= threshold ? "AT_RISK" : "OK" };
}
