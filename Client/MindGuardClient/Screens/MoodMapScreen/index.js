import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import StatsCard from "../../Components/StatsCard";
import api from "../../Api/index.js";
import styles from "./MoodMap.Styles";
import { getUserData } from "../../Helpers/Storage.js";
import {
  getMostCommonMood,
  getCurrentStreak,
} from "../../Helpers/MoodHelpers.js";

export default function MoodMapScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDayEntries, setSelectedDayEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const loadUser = async () => {
    const u = await getUserData();
    setUser(u);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const res = await api.get(`/Entry/UserEntries/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const data = res.data.payload;

      setEntries(data);

      const marks = {};
      data.forEach((entry) => {
        const date = entry.createdAt.split("T")[0];
        let color = "#808080";
        if (entry.detectedEmotion === "happy") color = "#4CAF50";
        else if (entry.detectedEmotion === "sad") color = "#2196F3";
        else if (entry.detectedEmotion === "angry") color = "#F44336";
        else if (entry.detectedEmotion === "neutral") color = "#FFC107";

        marks[date] = {
          marked: true,
          dotColor: color,
        };
      });
      setMarkedDates(marks);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);

    const dayEntries = entries.filter((e) =>
      e.createdAt.startsWith(day.dateString)
    );
    setSelectedDayEntries(dayEntries);

    setMarkedDates((prev) => ({
      ...prev,
      [day.dateString]: {
        ...(prev[day.dateString] || {}),
        selected: true,
        selectedColor: "#000",
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Mood Map</Text>
      </View>

      {/* Calendar */}
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        style={styles.calendar}
        theme={{
          todayTextColor: "#4CAF50",
          arrowColor: "#000",
        }}
      />

      {/* Stats Card */}
      <StatsCard
        mostCommonMood={getMostCommonMood(entries)}
        currentStreak={getCurrentStreak(entries)}
        totalEntries={`${entries.length} mood logs`}
      />

      {/* Entries of selected day */}
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
