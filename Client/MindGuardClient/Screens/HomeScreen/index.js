import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, ScrollView } from "react-native";
import FeelingCard from "../../Components/FeelingCard";
import styles from "./home.styles";
import { getUserData } from "../../Helpers/Storage";
import AIInsightCard from "../../Components/AIInsightCard";
import MoodTrendCard from "../../Components/MoodTrendCard";
import UpcomingRoutineCard from "../../Components/UpcomingRoutineCard";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const u = await getUserData();
    setUser(u);
  };

  useEffect(() => {
    loadUser();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome */}
        <Text style={styles.welcomeText}>Welcome, {user?.fullName}</Text>

        {/* Question */}
        <Text style={styles.questionText}>How Are You Feeling Today?</Text>

        {/* Feeling Cards */}
        <View style={styles.feelingCardsRow}>
          <FeelingCard
            title="Add Journal Entry"
            bgColor="#80C6DA"
            textColor="#1E3A5F"
            onPress={() => console.log("Happy pressed")}
          />
          <FeelingCard
            title="Log Mood"
            bgColor="#1E3A5F"
            textColor="#fff"
            onPress={() => console.log("Sad pressed")}
          />
        </View>

        {/* Info Cards */}
        <View style={styles.infoCardsColumn}>
          <AIInsightCard
            title="AI Insight"
            subtitle="Your average mood this week is 5/10. Keep tracking to get personalized tips."
          />

          <MoodTrendCard
            title="Mood Trend"
            rightText="View Details"
            onRightPress={() => console.log("View Details pressed")}
            moods={[
              { day: "Mon", mood: "😐" },
              { day: "Tue", mood: "🙂" },
              { day: "Wed", mood: "😔" },
              { day: "Thu", mood: "😃" },
              { day: "Fri", mood: "😐" },
              { day: "Sat", mood: "😄" },
              { day: "Sun", mood: "😐" },
            ]}
          />

          <UpcomingRoutineCard
            title="Upcoming Routine"
            rightText="View Routines"
            onRightPress={() => console.log("View Routines pressed")}
            subtitle="Evening journal at 21:00"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
