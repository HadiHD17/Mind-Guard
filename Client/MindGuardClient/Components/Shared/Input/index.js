import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./input.styles";

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(36,36,36,0.6)"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
