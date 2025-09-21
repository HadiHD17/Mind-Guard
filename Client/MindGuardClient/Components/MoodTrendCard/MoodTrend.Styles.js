import { StyleSheet } from "react-native";

export const createMoodTrendStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 25,
      marginBottom: 20,
      width: "100%",
      height: "auto",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    rightText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: "500",
    },
    daysRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    dayContainer: {
      alignItems: "center",
    },
    dayText: {
      fontSize: 12,
      fontWeight: "500",
      marginBottom: 5,
      color: theme.textSecondary,
    },
    moodText: {
      fontSize: 20,
    },
  });
