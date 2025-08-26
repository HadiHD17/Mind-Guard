import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./secondary.styles";

export default function SecondaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
