import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { trainAndPredict, tipsFor } from "./helpers/MLHelper";

export default function MoodTestScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scenario, setScenario] = useState("High");

  const mockDataSets = {
    Normal: [
      {
        date: "2025-08-10",
        moodScore: 4,
        sentimentScore: 0.5,
        wroteJournal: true,
        dayOfWeek: 1,
      },
      {
        date: "2025-08-11",
        moodScore: 3,
        sentimentScore: 0.3,
        wroteJournal: true,
        dayOfWeek: 2,
      },
      {
        date: "2025-08-12",
        moodScore: 4,
        sentimentScore: 0.6,
        wroteJournal: true,
        dayOfWeek: 3,
      },
      {
        date: "2025-08-13",
        moodScore: 3,
        sentimentScore: 0.5,
        wroteJournal: true,
        dayOfWeek: 4,
      },
      {
        date: "2025-08-14",
        moodScore: 4,
        sentimentScore: 0.6,
        wroteJournal: true,
        dayOfWeek: 5,
      },
      {
        date: "2025-08-15",
        moodScore: 3,
        sentimentScore: 0.4,
        wroteJournal: true,
        dayOfWeek: 6,
      },
      {
        date: "2025-08-16",
        moodScore: 4,
        sentimentScore: 0.5,
        wroteJournal: true,
        dayOfWeek: 0,
      },
      {
        date: "2025-08-17",
        moodScore: 3,
        sentimentScore: 0.3,
        wroteJournal: true,
        dayOfWeek: 1,
      },
      {
        date: "2025-08-18",
        moodScore: 4,
        sentimentScore: 0.6,
        wroteJournal: true,
        dayOfWeek: 2,
      },
      {
        date: "2025-08-19",
        moodScore: 3,
        sentimentScore: 0.5,
        wroteJournal: true,
        dayOfWeek: 3,
      },
      {
        date: "2025-08-20",
        moodScore: 4,
        sentimentScore: 0.6,
        wroteJournal: true,
        dayOfWeek: 4,
      },
      {
        date: "2025-08-21",
        moodScore: 3,
        sentimentScore: 0.4,
        wroteJournal: true,
        dayOfWeek: 5,
      },
      {
        date: "2025-08-22",
        moodScore: 4,
        sentimentScore: 0.5,
        wroteJournal: true,
        dayOfWeek: 6,
      },
      {
        date: "2025-08-23",
        moodScore: 3,
        sentimentScore: 0.3,
        wroteJournal: true,
        dayOfWeek: 0,
      },
      {
        date: "2025-08-24",
        moodScore: 4,
        sentimentScore: 0.6,
        wroteJournal: true,
        dayOfWeek: 1,
      },
    ],
    Moderate: [
      {
        date: "2025-08-10",
        moodScore: 2,
        sentimentScore: -0.3,
        wroteJournal: false,
        dayOfWeek: 1,
      },
      {
        date: "2025-08-11",
        moodScore: 3,
        sentimentScore: -0.1,
        wroteJournal: true,
        dayOfWeek: 2,
      },
      {
        date: "2025-08-12",
        moodScore: 2,
        sentimentScore: -0.2,
        wroteJournal: false,
        dayOfWeek: 3,
      },
      {
        date: "2025-08-13",
        moodScore: 3,
        sentimentScore: -0.1,
        wroteJournal: true,
        dayOfWeek: 4,
      },
      {
        date: "2025-08-14",
        moodScore: 2,
        sentimentScore: -0.3,
        wroteJournal: false,
        dayOfWeek: 5,
      },
      {
        date: "2025-08-15",
        moodScore: 3,
        sentimentScore: -0.2,
        wroteJournal: true,
        dayOfWeek: 6,
      },
      {
        date: "2025-08-16",
        moodScore: 2,
        sentimentScore: -0.1,
        wroteJournal: false,
        dayOfWeek: 0,
      },
      {
        date: "2025-08-17",
        moodScore: 3,
        sentimentScore: -0.2,
        wroteJournal: true,
        dayOfWeek: 1,
      },
      {
        date: "2025-08-18",
        moodScore: 2,
        sentimentScore: -0.1,
        wroteJournal: false,
        dayOfWeek: 2,
      },
      {
        date: "2025-08-19",
        moodScore: 3,
        sentimentScore: -0.2,
        wroteJournal: true,
        dayOfWeek: 3,
      },
      {
        date: "2025-08-20",
        moodScore: 2,
        sentimentScore: -0.1,
        wroteJournal: false,
        dayOfWeek: 4,
      },
      {
        date: "2025-08-21",
        moodScore: 3,
        sentimentScore: -0.2,
        wroteJournal: true,
        dayOfWeek: 5,
      },
      {
        date: "2025-08-22",
        moodScore: 2,
        sentimentScore: -0.1,
        wroteJournal: false,
        dayOfWeek: 6,
      },
      {
        date: "2025-08-23",
        moodScore: 3,
        sentimentScore: -0.2,
        wroteJournal: true,
        dayOfWeek: 0,
      },
      {
        date: "2025-08-24",
        moodScore: 2,
        sentimentScore: -0.1,
        wroteJournal: false,
        dayOfWeek: 1,
      },
    ],
    High: [
      {
        date: "2025-08-10",
        moodScore: 1,
        sentimentScore: -0.8,
        wroteJournal: false,
        dayOfWeek: 1,
      },
      {
        date: "2025-08-11",
        moodScore: 1,
        sentimentScore: -0.9,
        wroteJournal: false,
        dayOfWeek: 2,
      },
      {
        date: "2025-08-12",
        moodScore: 2,
        sentimentScore: -0.7,
        wroteJournal: false,
        dayOfWeek: 3,
      },
      {
        date: "2025-08-13",
        moodScore: 1,
        sentimentScore: -0.6,
        wroteJournal: false,
        dayOfWeek: 4,
      },
      {
        date: "2025-08-14",
        moodScore: 2,
        sentimentScore: -0.9,
        wroteJournal: false,
        dayOfWeek: 5,
      },
      {
        date: "2025-08-15",
        moodScore: 1,
        sentimentScore: -0.8,
        wroteJournal: false,
        dayOfWeek: 6,
      },
      {
        date: "2025-08-16",
        moodScore: 1,
        sentimentScore: -0.7,
        wroteJournal: false,
        dayOfWeek: 0,
      },
      {
        date: "2025-08-17",
        moodScore: 1,
        sentimentScore: -0.9,
        wroteJournal: false,
        dayOfWeek: 1,
      },
      {
        date: "2025-08-18",
        moodScore: 2,
        sentimentScore: -0.8,
        wroteJournal: false,
        dayOfWeek: 2,
      },
      {
        date: "2025-08-19",
        moodScore: 1,
        sentimentScore: -0.7,
        wroteJournal: false,
        dayOfWeek: 3,
      },
      {
        date: "2025-08-20",
        moodScore: 1,
        sentimentScore: -0.6,
        wroteJournal: false,
        dayOfWeek: 4,
      },
      {
        date: "2025-08-21",
        moodScore: 2,
        sentimentScore: -0.9,
        wroteJournal: false,
        dayOfWeek: 5,
      },
      {
        date: "2025-08-22",
        moodScore: 1,
        sentimentScore: -0.8,
        wroteJournal: false,
        dayOfWeek: 6,
      },
      {
        date: "2025-08-23",
        moodScore: 1,
        sentimentScore: -0.7,
        wroteJournal: false,
        dayOfWeek: 0,
      },
      {
        date: "2025-08-24",
        moodScore: 1,
        sentimentScore: -0.7,
        wroteJournal: false,
        dayOfWeek: 1,
      },
    ],
  };

  const fetchAndPredict = () => {
    setLoading(true);
    setResult(null);

    try {
      const dailyRows = mockDataSets[scenario];
      const prediction = trainAndPredict(dailyRows);
      const advice = tipsFor(prediction.probability);
      setResult({ prediction, advice });
    } catch (err) {
      console.error(err);
      setResult({ error: "Prediction failed" });
    }

    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
        Choose Scenario:
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {["Normal", "Moderate", "High"].map((s) => (
          <Button
            key={s}
            title={s}
            onPress={() => setScenario(s)}
            color={scenario === s ? "blue" : "gray"}
          />
        ))}
      </View>

      <Button
        title={loading ? "Running..." : "Test Mood Prediction"}
        onPress={fetchAndPredict}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {result && result.error && (
        <Text style={{ color: "red", marginTop: 20 }}>{result.error}</Text>
      )}

      {result && result.prediction && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Prediction:</Text>
          <Text>Label: {result.prediction.label}</Text>
          <Text>
            Probability: {(result.prediction.probability * 100).toFixed(2)}%
          </Text>

          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            Tips / Advice:
          </Text>
          {result.advice.map((tip, i) => (
            <Text key={i}>• {tip}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
