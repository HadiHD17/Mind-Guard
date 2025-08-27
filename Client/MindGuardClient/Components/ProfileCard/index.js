import React from "react";
import { View } from "react-native";
import styles from "./ProfileCard.Styles";

export default function ProfileCard({ children }) {
  return <View style={styles.card}>{children}</View>;
}
