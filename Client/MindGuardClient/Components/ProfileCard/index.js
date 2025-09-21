import React from "react";
import { View } from "react-native";
import { createProfileCardStyles } from "./ProfileCard.Styles";
import { useTheme } from "../../Theme/useTheme";

export default function ProfileCard({ children }) {
  const { theme } = useTheme();
  const styles = createProfileCardStyles(theme);
  return <View style={styles.card}>{children}</View>;
}
