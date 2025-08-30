import React from "react";
import { View, Text } from "react-native";
import styles from "./AIInsightCard.Styles";

export default function AIInsightCard({ title, subtitle }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
