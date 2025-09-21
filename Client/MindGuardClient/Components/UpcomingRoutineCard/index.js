import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createUpcomingRoutineCardStyles } from "./UpcomingRoutineCard.Styles";
import { useTheme } from "../../Theme/useTheme";

export default function UpcomingRoutineCard({
  title,
  rightText,
  onRightPress,
  subtitle,
}) {
  const { theme } = useTheme();
  const styles = createUpcomingRoutineCardStyles(theme);
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
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
