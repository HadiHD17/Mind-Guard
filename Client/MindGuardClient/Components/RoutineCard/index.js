import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Week from "../Week";
import { createRoutineCardStyles } from "./RoutineCard.Styles";
import { useTheme } from "../../Theme/useTheme";

export default function RoutineCard({
  routine,
  onDelete,
  onMarkComplete,
  setDays,
}) {
  const { theme } = useTheme();
  const styles = createRoutineCardStyles(theme);
  const today = new Date();
  const localDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const lastCompletedDate = routine.lastCompletedDate?.split("T")[0];

  const isCompletedToday = lastCompletedDate === localDate;

  return (
    <View
      style={[
        styles.card,
        isCompletedToday && { backgroundColor: theme.completed },
      ]}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{routine.description}</Text>
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompletedToday && { backgroundColor: theme.textMuted },
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
