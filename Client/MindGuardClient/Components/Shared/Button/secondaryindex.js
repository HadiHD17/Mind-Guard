import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createSecondaryButtonStyles } from "./secondary.styles";
import { useTheme } from "../../../Theme/useTheme";

export default function SecondaryButton({ title, onPress, style }) {
  const { theme } = useTheme();
  const styles = createSecondaryButtonStyles(theme);
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
