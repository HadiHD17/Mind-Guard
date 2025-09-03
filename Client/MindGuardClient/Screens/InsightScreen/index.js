import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, ScrollView } from "react-native";
import styles from "./insight.styles";
import MoodRiskCard from "../../Components/MoodRiskCard";
import TipCard from "../../Components/TipCard";
import WeeklySummaryCard from "../../Components/WeeklySummaryCard";
import { getUserData } from "../../Helpers/Storage";
import api from "../../Api";

export default function InsightScreen() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const u = await getUserData();
      setUser(u);

      if (u?.id) {
        const res = await api.get(`/Entries/user/${u.id}`, {
          headers: { Authorization: `Bearer ${u.token}` },
        });
        setEntries(res.data?.payload ?? []);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome */}
        <Text style={styles.welcome}>Welcome, {user ? user.fullName : ""}</Text>
        {/* AI Insights */}
        <Text style={styles.sectionTitle}>AI Insights</Text>
        <MoodRiskCard />
        {/* Personalized Tips */}
        <Text style={styles.sectionTitle}>Personalized Tips</Text>
        <TipCard text="🫁 Try 5 minutes of deep breathing exercises" />
        <TipCard text="🌿 Take a short walk in nature" />
        <TipCard text="📓 Write down your thoughts for 10 minutes" />
        {/* Weekly Summary */}
        <Text style={styles.sectionTitle}>Weekly Summary</Text>
        <WeeklySummaryCard entries={entries} />
      </ScrollView>
    </SafeAreaView>
  );
}
