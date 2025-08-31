import React from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "./Week.Styles";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Week({ selectedDays = [], onSelectDay }) {
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
            onPress={() => onSelectDay(day)}>
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
