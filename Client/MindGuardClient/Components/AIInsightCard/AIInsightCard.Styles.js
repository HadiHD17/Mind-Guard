import { StyleSheet } from "react-native";

export const createAIInsightCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 25,
      marginBottom: 20,
      width: "100%",
      height: 130,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
      color: theme.text,
    },
    subtitle: {
      fontSize: 12,
      fontWeight: "400",
      color: theme.textSecondary,
    },
  });
