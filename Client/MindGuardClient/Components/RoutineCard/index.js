import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Week from "../Week";
import styles from "./RoutineCard.Styles";

export default function RoutineCard({
  routine,
  onDelete,
  onMarkComplete,
  setDays,
}) {
  const daysArray = routine.frequency
    ? routine.frequency.split(",").map((day) => {
        // capitalize first letter
        return day.charAt(0).toUpperCase() + day.slice(1, 3);
      })
    : [];
  return (
    <View
      style={[
        styles.card,
        routine.completedToday && { backgroundColor: "#d3d3d3" }, // grey if completed today
      ]}>
      {/* Title & Delete */}
      <View style={styles.topRow}>
        <Text style={styles.title}>{routine.description}</Text>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      {/* Time */}
      <Text style={styles.time}>{routine.reminder_Time}</Text>

      {/* Days */}
      <Week selectedDays={daysArray} readOnly />

      {/* Mark as Complete */}
      <TouchableOpacity style={styles.completeButton} onPress={onMarkComplete}>
        <Text style={styles.completeButtonText}>Mark as complete</Text>
      </TouchableOpacity>
    </View>
  );
}
