import React, { useState } from "react";
import { SafeAreaView, View, Text, ScrollView } from "react-native";
import FeelingCard from "../../Components/FeelingCard";
import styles from "./home.styles";
import MoodTrendCard from "../../Components/MoodTrendCard";
import UpcomingRoutineCard from "../../Components/UpcomingRoutineCard";
import LogMoodModal from "../../Components/LogMood";
import useUser from "../../Hooks/useUser";
import useMoods from "../../Hooks/useMoods";
import useRoutine from "../../Hooks/useRoutine";

export default function HomeScreen({ navigation }) {
  const { user, loading: userLoading, error: userError } = useUser();
  const {
    moods,
    loading: moodsLoading,
    error: moodsError,
  } = useMoods(user?.id);
  const {
    routine,
    loading: routineLoading,
    error: routineError,
  } = useRoutine(user?.id);

  const [logmoodvisible, setLogMoodVisible] = useState(false);

  if (userLoading || moodsLoading || routineLoading)
    return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {user?.fullName}</Text>

        {userError && (
          <Text style={styles.errorText}>
            Error loading user data: {userError}
          </Text>
        )}
        {moodsError && (
          <Text style={styles.errorText}>
            Error loading mood data: {moodsError}
          </Text>
        )}
        {routineError && (
          <Text style={styles.errorText}>
            Error loading routine data: {routineError}
          </Text>
        )}

        <Text style={styles.questionText}>How Are You Feeling Today?</Text>

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
