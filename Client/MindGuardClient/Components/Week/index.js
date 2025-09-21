// Components/Week.js
import React from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import { createWeekStyles } from "./Week.Styles";
import { useTheme } from "../../Theme/useTheme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Week({
  selectedDays = [],
  setSelectedDays,
  readOnly = false,
}) {
  const { theme } = useTheme();
  const styles = createWeekStyles(theme);
  const toggleDay = (day) => {
    if (readOnly) return;
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}>
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day);
        return (
          <TouchableOpacity
            key={day}
            style={[styles.day, isSelected && styles.selectedDay]}
            onPress={() => toggleDay(day)}>
            <Text
              style={[styles.dayText, isSelected && styles.selectedDayText]}>
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
