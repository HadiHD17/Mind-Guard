import React from "react";
import { View, Text } from "react-native";
import styles from "./MoodRiskCard.Styles";

export default function MoodRiskCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>⚠️ Mood Risk Alert</Text>
      <Text style={styles.description}>
        You might feel stressed in the next 3 days based on patterns and this
      </Text>
    </View>
  );
}
