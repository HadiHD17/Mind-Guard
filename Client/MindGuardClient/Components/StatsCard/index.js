import React from "react";
import { View, Text } from "react-native";
import styles from "./StatsCard.Styles";

export default function StatsCard({
  mostCommonMood,
  currentStreak,
  totalEntries,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        Most common mood: <Text style={styles.value}>{mostCommonMood}</Text>
      </Text>
      <Text style={styles.label}>
        Current streak: <Text style={styles.value}>{currentStreak}</Text>
      </Text>
      <Text style={styles.label}>
        Total entries: <Text style={styles.value}>{totalEntries}</Text>
      </Text>
    </View>
  );
}
