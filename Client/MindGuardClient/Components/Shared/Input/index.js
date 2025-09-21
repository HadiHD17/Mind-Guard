import React from "react";
import { View, Text, TextInput } from "react-native";
import { createInputStyles } from "./input.styles";
import { useTheme } from "../../../Theme/useTheme";

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  style,
  ...props
}) {
  const { theme } = useTheme();
  const styles = createInputStyles(theme);
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
}
