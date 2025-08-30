import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./MoodCard.Styles";

export default function MoodCard({ title, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}>
      <Text style={[styles.cardText, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
