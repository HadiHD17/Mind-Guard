import React from "react";

export const moodToEmoji = {
  happy: "😄",
  sad: "😔",
  angry: "😡",
  stressed: "😣",
  neutral: "😐",
  string: "❓", // fallback
};

export function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}
