import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./JournalCard.Styles";

export default function JournalCard({
  day,
  mood,
  content,
  sentiment,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.mood}>{mood}</Text>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color="red" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.content}>{content}</Text>

      {/* Sentiment */}
      <Text style={styles.sentiment}>Sentiment: {sentiment}</Text>
    </View>
  );
}
