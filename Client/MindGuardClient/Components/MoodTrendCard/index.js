import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createMoodTrendStyles } from "./MoodTrend.Styles";
import { useTheme } from "../../Theme/useTheme";

export default function MoodTrendCard({
  title,
  rightText,
  onRightPress,
  moods,
}) {
  const { theme } = useTheme();
  const styles = createMoodTrendStyles(theme);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {rightText && (
          <TouchableOpacity onPress={onRightPress}>
            <Text style={styles.rightText}>{rightText}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.daysRow}>
        {moods.map((item, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.moodText}>{item.mood}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
