import React from "react";
import styles from "./FeelingCard.Styles";
import { TouchableOpacity, Text } from "react-native";

export default function FeelingCard({ title, bgColor, textColor, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.feelingCard, { backgroundColor: bgColor }]}
      onPress={onPress}>
      <Text style={[styles.feelingCardText, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
