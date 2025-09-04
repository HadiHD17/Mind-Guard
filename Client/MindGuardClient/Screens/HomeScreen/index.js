import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, ScrollView } from "react-native";
import FeelingCard from "../../Components/FeelingCard";
import styles from "./home.styles";
import { getUserData } from "../../Helpers/Storage";
import MoodTrendCard from "../../Components/MoodTrendCard";
import UpcomingRoutineCard from "../../Components/UpcomingRoutineCard";
import api from "../../Api";
import { moodToEmoji, getDayOfWeek } from "../../Helpers/MoodHelpers";
import LogMoodModal from "../../Components/LogMood";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [routine, setRoutine] = useState(null);
  const [mood, setMood] = useState([]);
  const [logmoodvisible, setLogMoodVisible] = useState(false);

  const loadUser = async () => {
    const u = await getUserData();
    setUser(u);
  };

  const getMoods = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/Mood/All/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (res.data?.payload) {
        const transformed = res.data.payload.map((item) => ({
          day: getDayOfWeek(item.date),
          mood: moodToEmoji[item.mood_Label] || "❓",
        }));

        const uniqueByDay = Array.from(
          transformed
            .reduce((map, obj) => map.set(obj.day, obj), new Map())
            .values()
        );

        setMood(uniqueByDay);
      }
    } catch (err) {
      console.log("mood error: ", err);
    }
  };

  const getRoutine = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/Routine/UpcomingRoutine/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (res.data.status == "success") {
        setRoutine(res.data.payload);
      }
    } catch (err) {
      console.log("routine error: ", err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    getRoutine();
    getMoods();
  }, [user, routine, mood]);
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
            textColor="#fff"
            onPress={() => navigation.navigate("Journal")}
          />
          <FeelingCard
            title="Log Mood"
            bgColor="#1E3A5F"
            textColor="#fff"
            onPress={() => setLogMoodVisible(true)}
          />
        </View>

        {/* Info Cards */}
        <View style={styles.infoCardsColumn}>
          <MoodTrendCard
            title="Mood Trend"
            rightText="View Details"
            onRightPress={() => navigation.replace("Map")}
            moods={
              mood.length
                ? mood
                : [
                    { day: "Mon", mood: "😐" },
                    { day: "Tue", mood: "🙂" },
                    { day: "Wed", mood: "😔" },
                    { day: "Thu", mood: "😃" },
                    { day: "Fri", mood: "😐" },
                    { day: "Sat", mood: "😄" },
                    { day: "Sun", mood: "😐" },
                  ]
            }
          />

          {routine ? (
            <UpcomingRoutineCard
              title="Upcoming Routine"
              rightText="View Routines"
              onRightPress={() => navigation.replace("Routine")}
              subtitle={`${routine.description} at ${routine.reminder_Time}`}
            />
          ) : (
            <UpcomingRoutineCard
              title="Upcoming Routine"
              rightText="View Routines"
              onRightPress={() => console.log("View Routines pressed")}
              subtitle="No upcoming routine found"
            />
          )}
        </View>
        <LogMoodModal
          visible={logmoodvisible}
          onClose={() => setLogMoodVisible(false)}
          onSelectMood={() => setLogMoodVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
