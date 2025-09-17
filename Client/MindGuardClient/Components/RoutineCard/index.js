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
  const today = new Date();
  const localDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const lastCompletedDate = routine.lastCompletedDate?.split("T")[0];

  const isCompletedToday = lastCompletedDate === localDate;

  return (
    <View
      style={[styles.card, isCompletedToday && { backgroundColor: "#d3d3d3" }]}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{routine.description}</Text>
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompletedToday && { backgroundColor: "#a9a9a9" },
          ]}
          onPress={onMarkComplete}
          disabled={isCompletedToday}>
          <Text style={styles.completeButtonText}>
            {isCompletedToday ? "Completed" : "Mark as done"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.time}>{routine.reminder_Time}</Text>

      <Week selectedDays={routine.frequency.split(",")} readOnly />

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={18} color="#fff" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}
