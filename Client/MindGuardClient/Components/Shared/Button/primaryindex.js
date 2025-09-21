import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createPrimaryButtonStyles } from "./primary.styles";
import { useTheme } from "../../../Theme/useTheme";

export default function PrimaryButton({ title, onPress, style }) {
  const { theme } = useTheme();
  const styles = createPrimaryButtonStyles(theme);
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
