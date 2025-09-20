import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import StatsCard from "../../Components/StatsCard";
import styles from "./MoodMap.Styles";
import useMoodMap from "../../Hooks/useMoodMap";
import { getMostCommonMood, getCurrentStreak } from "../../Helpers/MoodHelpers";

export default function MoodMapScreen({ navigation }) {
  const {
    journals,
    loading,
    error,
    markedDates,
    selectedDayEntries,
    selectedDate,
    handleDayPress,
  } = useMoodMap();

  if (loading) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Mood Map</Text>
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        style={styles.calendar}
        theme={{
          todayTextColor: "#4CAF50",
          arrowColor: "#000",
        }}
      />

      <StatsCard
        mostCommonMood={getMostCommonMood(journals)}
        currentStreak={getCurrentStreak(journals)}
        totalEntries={`${journals.length} mood logs`}
      />

      {selectedDayEntries.length > 0 && (
        <View style={styles.entryList}>
          <Text style={styles.entryTitle}>Entries for {selectedDate}</Text>
          <FlatList
            data={selectedDayEntries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.entryCard}>
                <Text style={styles.entryMood}>{item.detectedEmotion}</Text>
                <Text style={styles.entryContent}>{item.content}</Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
