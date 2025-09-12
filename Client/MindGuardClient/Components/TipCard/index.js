import React from "react";
import { View, Text } from "react-native";
import styles from "./TipCard.Styles";

export default function TipCard({ tips }) {
  // Accept either a single string or an array
  const list = Array.isArray(tips) ? tips : tips ? [tips] : [];

  return (
    <View style={styles.card}>
      {list.length === 0 ? (
        <Text style={styles.text}>
          Take one kind action for yourself today.
        </Text>
      ) : (
        list.map((t, i) => (
          <Text key={i} style={styles.text}>
            • {t}
          </Text>
        ))
      )}
    </View>
  );
}
