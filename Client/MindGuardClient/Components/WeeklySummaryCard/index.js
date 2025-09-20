import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "./WeeklySummaryCard.Styles";

import { moodToEmoji } from "../../Helpers/MoodHelpers";
import { getUserData } from "../../Helpers/Storage";
import api from "../../Api";

export default function WeeklySummaryCard({ entries }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const user = await getUserData();
        if (!user?.id) throw new Error("User id not found");

        const res = await api.get(`/Summary/latest/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        if (cancelled) return;

        setSummary(res.data?.payload);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load summary");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator />
        <Text style={styles.row}>Loading weekly summary…</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.card}>
        <Text style={styles.row}>Couldn’t load weekly summary.</Text>
      </View>
    );
  }

  if (!summary) {
    return null;
  }

  const { mood_Trend, avG_Sentiment, insights } = summary;

  return (
    <View style={styles.card}>
      <Text style={styles.row}>
        Average Mood:{" "}
        <Text style={styles.value}>
          {moodToEmoji[mood_Trend] || "❓"} {mood_Trend}
        </Text>
      </Text>

      {typeof avG_Sentiment === "number" && (
        <Text style={styles.row}>
          Avg. Sentiment Score:{" "}
          <Text style={styles.value}>{avG_Sentiment}</Text>
        </Text>
      )}

      {insights && (
        <Text style={[styles.row, { marginTop: 4 }]}>
          Insight: <Text style={styles.value}>{insights}</Text>
        </Text>
      )}
    </View>
  );
}
