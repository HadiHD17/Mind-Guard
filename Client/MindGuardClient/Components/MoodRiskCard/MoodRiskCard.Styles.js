import { StyleSheet } from "react-native";

export const createMoodRiskCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.primaryDark,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: "600", // semi-bold
      color: "#FFFFFF",
      marginBottom: 8,
    },
    description: {
      fontSize: 12,
      fontWeight: "400",
      color: "#FFFFFF",
    },
  });
