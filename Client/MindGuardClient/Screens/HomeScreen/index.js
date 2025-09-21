import React, { useState } from "react";
import { SafeAreaView, View, Text, ScrollView } from "react-native";
import FeelingCard from "../../Components/FeelingCard";
import { createHomeStyles } from "./home.styles";
import MoodTrendCard from "../../Components/MoodTrendCard";
import UpcomingRoutineCard from "../../Components/UpcomingRoutineCard";
import LogMoodModal from "../../Components/LogMood";
import useUser from "../../Hooks/useUser";
import useMoods from "../../Hooks/useMoods";
import useRoutine from "../../Hooks/useRoutine";
import { useTheme } from "../../Theme/useTheme";

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);

  const { user, loading: userLoading, error: userError } = useUser();
  const {
    moods,
    loading: moodsLoading,
    error: moodsError,
    handleLogMood,
  } = useMoods(userLoading ? null : user?.id);

  const {
    routine,
    loading: routineLoading,
    error: routineError,
  } = useRoutine(user?.id, user?.accessToken);

  const [logmoodvisible, setLogMoodVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {user?.fullName}</Text>

        <Text style={styles.questionText}>How Are You Feeling Today?</Text>

        <View style={styles.feelingCardsRow}>
          <FeelingCard
            title="Add Journal Entry"
            bgColor={theme.primary}
            textColor="#fff"
            onPress={() => navigation.navigate("Journal")}
          />
          <FeelingCard
            title="Log Mood"
            bgColor={theme.primaryDark}
            textColor="#fff"
            onPress={() => setLogMoodVisible(true)}
          />
        </View>

        <View style={styles.infoCardsColumn}>
          <MoodTrendCard
            title="Mood Trend"
            rightText="View Details"
            onRightPress={() => navigation.replace("Map")}
            moods={moods.length ? moods : [{ day: "Mon", mood: "😐" }]}
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
              onRightPress={() => navigation.replace("Routine")}
              subtitle="No upcoming routine found"
            />
          )}
        </View>

        <LogMoodModal
          visible={logmoodvisible}
          onClose={() => setLogMoodVisible(false)}
          onSelectMood={(mood) => handleLogMood(mood)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
