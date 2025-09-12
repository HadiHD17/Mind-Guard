// src/ml/riskModel.js
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

// keep EXACTLY the same order used during training
export const MOODS = [
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

export const RISKS = ["LOW", "MEDIUM", "HIGH"];

let model = null;

export async function loadRiskModel() {
  await tf.ready();
  if (model) return model;
  // require() so Metro bundles the files
  const modelJson = require("../assets/model/mg-risk-v1/model.json");
  const weights = [require("../assets/model/mg-risk-v1/group1-shard1of1.bin")];
  model = await tf.loadLayersModel(bundleResourceIO(modelJson, weights));
  return model;
}

function oneHotMood(mood) {
  return MOODS.map((m) => (m === mood ? 1 : 0));
}

/** sentimentScore: -1..+1; mood: one of MOODS */
export function predictRisk(sentimentScore, mood) {
  if (!model) throw new Error("Model not loaded. Call loadRiskModel() first.");
  const x = [sentimentScore, ...oneHotMood(mood)];
  const input = tf.tensor2d([x], [1, x.length]);
  const probsT = model.predict(input);
  const probs = probsT.dataSync(); // [pLOW, pMED, pHIGH]
  input.dispose();
  probsT.dispose?.();

  let best = 0,
    idx = 0;
  for (let i = 0; i < probs.length; i++)
    if (probs[i] > best) {
      best = probs[i];
      idx = i;
    }
  return {
    label: RISKS[idx],
    probs: { LOW: probs[0], MEDIUM: probs[1], HIGH: probs[2] },
  };
}

// somewhere in your screen file (e.g., Checkin/Insight)
// deps you already have in your project:
import api from "../Api";
import { getUserData } from "../Helpers/Storage";
import { getSentimentScore } from "./sentiment";
import { tipsFor } from "./tips";
import { useEffect, useState } from "react";
