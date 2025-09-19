import React from "react";

export const moodToEmoji = {
  happy: "😄",
  sad: "😔",
  angry: "😡",
  stressed: "😣",
  neutral: "😐",
  string: "❓",
};

export function getDayOfWeek(date) {
  const d = new Date(date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()];
}

export const getMostCommonMood = (entries) => {
  if (!entries || entries.length === 0) return "-";
  const moodCount = {};
  entries.forEach((e) => {
    moodCount[e.detectedEmotion] = (moodCount[e.detectedEmotion] || 0) + 1;
  });
  const sortedMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]);
  return sortedMoods[0][0];
};

export const getCurrentStreak = (entries) => {
  if (!entries || entries.length === 0) return "0 days";

  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  let streak = 0;
  for (let e of sorted) {
    if (["happy", "neutral"].includes(e.detectedEmotion)) streak++;
    else break;
  }
  return `${streak} days positive`;
};
