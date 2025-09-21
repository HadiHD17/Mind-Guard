import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createJournalCardStyles } from "./JournalCard.Styles";
import { useTheme } from "../../Theme/useTheme";

export default function JournalCard({ day, mood, content, sentiment }) {
  const { theme } = useTheme();
  const styles = createJournalCardStyles(theme);
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.mood}>{mood}</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{content}</Text>

      {/* Sentiment */}
      <Text style={styles.sentiment}>Sentiment: {sentiment}</Text>
    </View>
  );
}
