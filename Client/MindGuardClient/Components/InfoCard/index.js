import React from "react";
import styles from "./InfoCard.Styles";
import { TouchableOpacity, View, Text } from "react-native";

export default function InfoCard({ title, subtitle, rightText, onRightPress }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <Text style={styles.infoCardTitle}>{title}</Text>
        {rightText && (
          <TouchableOpacity onPress={onRightPress}>
            <Text style={styles.infoCardRightText}>{rightText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.infoCardSubtitle}>{subtitle}</Text>
    </View>
  );
}
