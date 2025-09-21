import { StyleSheet } from "react-native";

export const createStatsCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: theme.text,
    },
    value: {
      fontSize: 15,
      fontWeight: "400",
      color: theme.textSecondary,
    },
  });
