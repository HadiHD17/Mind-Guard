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
    ? routine.frequency
        .split(",")
        .map((day) => day.charAt(0).toUpperCase() + day.slice(1, 3))
    : [];

  const isCompleted = routine.completedToday;

  return (
    <View style={[styles.card, isCompleted && { backgroundColor: "#d3d3d3" }]}>
      {/* Title & Mark Complete */}
      <View style={styles.topRow}>
        <Text style={styles.title}>{routine.description}</Text>
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompleted && { backgroundColor: "#a9a9a9" },
          ]}
          onPress={onMarkComplete}
          disabled={isCompleted}>
          <Text style={styles.completeButtonText}>
            {isCompleted ? "Completed" : "Mark as done"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reminder Time */}
      <Text style={styles.time}>{routine.reminder_Time}</Text>

      {/* Days */}
      <Week selectedDays={daysArray} readOnly />

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={18} color="#fff" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}
