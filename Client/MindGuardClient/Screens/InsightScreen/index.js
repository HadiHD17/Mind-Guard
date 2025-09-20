import React from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import styles from "./insight.styles";
import MoodRiskCard from "../../Components/MoodRiskCard";
import TipCard from "../../Components/TipCard";
import WeeklySummaryCard from "../../Components/WeeklySummaryCard";
import useUser from "../../Hooks/useUser";
import { useInsights } from "../../Hooks/useInsights";
import { tipsFor } from "../../ml/tipsSeq";

export default function InsightScreen() {
  const { user } = useUser();
  const { entries, risk, loading, error } = useInsights(user);

  const moodForContext = entries?.[entries.length - 1]?.mood || "—";
  const defaultTips = [
    "Try 5 minutes of deep breathing",
    "Take a short walk in nature",
    "Journal your thoughts for 10 minutes",
  ];
  const recTips =
    risk.label === "AT_RISK"
      ? tipsFor("HIGH", moodForContext).slice(0, 3)
      : tipsFor("LOW", moodForContext).slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>Welcome, {user?.fullName || ""}</Text>

        <Text style={styles.sectionTitle}>AI Insights</Text>
        <MoodRiskCard
          riskLevel={risk.label === "AT_RISK" ? "HIGH" : "LOW"}
          mood={moodForContext}
          note={`Next 48h risk: ${(risk.prob * 100).toFixed(0)}%`}
        />

        <Text style={styles.sectionTitle}>Personalized Tips</Text>
        <TipCard tips={recTips.length ? recTips : defaultTips} />

        <Text style={styles.sectionTitle}>Weekly Summary</Text>
        <WeeklySummaryCard entries={entries} />

        {loading && (
          <View style={{ marginTop: 12 }}>
            <ActivityIndicator />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
