import React from "react";
import { View, Text } from "react-native";
import styles from "./TipCard.Styles";

export default function TipCard({ text }) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
