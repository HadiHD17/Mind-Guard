// Screens/Insight/index.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Text, SafeAreaView, ScrollView, Alert, Button } from "react-native";
import styles from "./insight.styles";
import MoodRiskCard from "../../Components/MoodRiskCard";
import TipCard from "../../Components/TipCard";
import WeeklySummaryCard from "../../Components/WeeklySummaryCard";
import { getUserData } from "../../Helpers/Storage";
import api from "../../Api";
import { loadRiskModel, predictRisk } from "../../ML/riskModel";
import { getSentimentScore } from "../../ML/sentiment";
import { tipsFor } from "../../ML/tips";

export default function InsightScreen() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [latestPred, setLatestPred] = useState(null);
  const [loading, setLoading] = useState(false);

  const safeGet = async (path, token) => {
    try {
      const res = await api.get(path, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res;
    } catch (e) {
      const status = e?.response?.status;
      const url = e?.response?.config?.url || path;
      // Silence 404 (not found) — just means no data yet
      if (status === 404) {
        console.log(`GET 404 (ok to ignore): ${url}`);
        return null;
      }
      console.error(
        `GET error ${status || ""} at ${url}`,
        e?.response?.data || e?.message
      );
      throw e;
    }
  };

  const loadData = useCallback(async () => {
    try {
      const u = await getUserData();
      setUser(u);
      if (!u?.id) return;

      // Entries
      const entriesRes = await safeGet(`/Entries/user/${u.id}`, u.token);
      if (entriesRes?.data?.payload) setEntries(entriesRes.data.payload);

      // Latest prediction
      const predRes = await safeGet(`/Prediction/${u.id}`, u.accessToken);
      const p = predRes?.data?.payload;
      if (p) {
        const riskLevel = String(
          p.risk_Level || p.riskLevel || "LOW"
        ).toUpperCase();
        const predictedDate = p.predicted_Date || p.predictedDate;
        const tipsArr = Array.isArray(p.tips)
          ? p.tips
          : typeof p.tips === "string"
          ? p.tips
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        setLatestPred({ riskLevel, tips: tipsArr, predictedDate });
      } else {
        setLatestPred(null);
      }
    } catch (e) {
      // Only alert on non-404s
      if (e?.response?.status !== 404) {
        Alert.alert(
          "Error",
          e?.response?.data?.message || e?.message || "Failed to load insights"
        );
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePredict = useCallback(async () => {
    try {
      if (!user?.accessToken) {
        Alert.alert("Not authenticated", "Please log in again.");
        return;
      }
      setLoading(true);

      const mood = entries?.[0]?.mood || "confused";
      const note = entries?.[0]?.note || "";

      await loadRiskModel();
      const sentiment = getSentimentScore(note);
      const { label, probs } = predictRisk(sentiment, mood);
      const tips = tipsFor(label, mood).slice(0, 3);

      const payload = {
        userId: user.id, // remove if server infers from JWT
        predicted_Date: new Date().toISOString(),
        risk_Level: label,
        tips: tips.join(" | "),
      };

      const postRes = await api.post("/Prediction", payload, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });

      console.log("Saved prediction:", postRes?.data?.payload);

      // Re-fetch latest (ignore 404 quietly if eventual consistency)
      await loadData();

      Alert.alert(
        "Prediction complete",
        `Risk: ${label}\nLOW: ${probs.LOW.toFixed(
          2
        )}  MED: ${probs.MEDIUM.toFixed(2)}  HIGH: ${probs.HIGH.toFixed(2)}`
      );
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [user, entries, loadData]);

  const moodForContext = entries?.[0]?.mood || "—";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>Welcome, {user ? user.fullName : ""}</Text>

        <Text style={styles.sectionTitle}>AI Insights</Text>
        <MoodRiskCard
          riskLevel={latestPred?.riskLevel || "LOW"}
          mood={moodForContext}
          note={
            latestPred?.predictedDate
              ? `Predicted for ${new Date(
                  latestPred.predictedDate
                ).toLocaleDateString()}`
              : undefined
          }
        />

        <Button
          title={loading ? "Predicting..." : "Run Prediction"}
          onPress={handlePredict}
          disabled={loading}
        />

        <Text style={styles.sectionTitle}>Personalized Tips</Text>
        <TipCard
          tips={
            latestPred?.tips?.length
              ? latestPred.tips
              : [
                  "🫁 Try 5 minutes of deep breathing",
                  "🌿 Take a short walk in nature",
                  "📓 Journal your thoughts for 10 minutes",
                ]
          }
        />

        <Text style={styles.sectionTitle}>Weekly Summary</Text>
        <WeeklySummaryCard entries={entries} />
      </ScrollView>
    </SafeAreaView>
  );
}
