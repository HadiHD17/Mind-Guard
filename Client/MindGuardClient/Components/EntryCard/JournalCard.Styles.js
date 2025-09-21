import { StyleSheet } from "react-native";

export const createJournalCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    day: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    mood: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.textSecondary,
    },
    content: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 6,
    },
    sentiment: {
      fontSize: 12,
      fontWeight: "200",
      color: theme.textTertiary,
    },
  });
