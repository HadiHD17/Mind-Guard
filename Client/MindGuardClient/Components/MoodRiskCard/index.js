import React from "react";
import { View, Text } from "react-native";
import { createMoodRiskCardStyles } from "./MoodRiskCard.Styles";
import { useTheme } from "../../Theme/useTheme";

const RISK_COLORS = {
  LOW: "#38a169", // green
  MEDIUM: "#dd6b20", // orange
  HIGH: "#e53e3e", // red
};

const RISK_LABEL = {
  LOW: "Low Risk",
  MEDIUM: "Medium Risk",
  HIGH: "High Risk",
};

export default function MoodRiskCard({ riskLevel = "LOW", mood = "—", note }) {
  const { theme } = useTheme();
  const styles = createMoodRiskCardStyles(theme);

  const color = RISK_COLORS[riskLevel] ?? "#3b82f6";
  const label = RISK_LABEL[riskLevel] ?? riskLevel;

  return (
    <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: color }]}>
      <Text style={styles.title}>
        <Text style={{ color }}>
          {riskLevel === "HIGH" ? "⚠️ " : riskLevel === "MEDIUM" ? "⚠ " : "✅ "}
        </Text>
        {label}
      </Text>

      <Text style={styles.description}>
        Based on recent patterns{mood && mood !== "—" ? ` (mood: ${mood})` : ""}
        , we estimate your near-term mental wellness risk as{" "}
        <Text style={{ fontWeight: "700", color: "#FFFFFF" }}>{label}</Text>.
      </Text>

      {note ? (
        <Text style={[styles.description, { opacity: 0.8 }]}>{note}</Text>
      ) : null}
    </View>
  );
}
