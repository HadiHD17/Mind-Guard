// src/ml/sentiment.js
import winkSentiment from "wink-sentiment";

/** Returns ~[-1..+1], roughly aligned to VADER compound used in training */
export function getSentimentScore(text) {
  const r = winkSentiment(String(text || ""));
  const s = Math.max(-1, Math.min(1, r.score / 10)); // normalize and clamp
  return s;
}
