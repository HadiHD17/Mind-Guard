import React from "react";
import { View, Text } from "react-native";
import { createAIInsightCardStyles } from "./AIInsightCard.Styles";
import { useTheme } from "../../Theme/useTheme";

export default function AIInsightCard({ title, subtitle }) {
  const { theme } = useTheme();
  const styles = createAIInsightCardStyles(theme);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
