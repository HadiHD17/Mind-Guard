import { StyleSheet } from "react-native";

export const createWeeklySummaryCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
    },
    row: {
      fontSize: 12,
      fontWeight: "400",
      color: theme.text,
      marginBottom: 8,
    },
    value: {
      fontWeight: "600",
      color: theme.primary,
    },
  });
