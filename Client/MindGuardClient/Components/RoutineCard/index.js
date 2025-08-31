import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Week from "../Week";
import styles from "./RoutineCard.Styles";

export default function RoutineCard({
  routine,
  onDelete,
  onMarkComplete,
  setDays, // pass a setter function from parent to update days
}) {
  return (
    <View style={styles.card}>
      {/* Title & Delete */}
      <View style={styles.topRow}>
        <Text style={styles.title}>{routine.title}</Text>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      {/* Time */}
      <Text style={styles.time}>{routine.time}</Text>

      {/* Days */}
      <Week selectedDays={routine.days} setSelectedDays={setDays} />

      {/* Mark as Complete */}
      <TouchableOpacity style={styles.completeButton} onPress={onMarkComplete}>
        <Text style={styles.completeButtonText}>Mark as complete</Text>
      </TouchableOpacity>
    </View>
  );
}
