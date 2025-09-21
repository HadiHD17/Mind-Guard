import { StyleSheet } from "react-native";

export const createRoutineCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    time: {
      fontSize: 12,
      color: theme.info,
      marginBottom: 8,
    },
    completeButton: {
      borderColor: theme.primaryDark,
      borderWidth: 2,
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      alignSelf: "flex-start",
      marginTop: 8,
    },
    completeButtonText: {
      color: theme.primaryDark,
      fontWeight: "700",
      fontSize: 14,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: theme.error,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginTop: 8,
    },
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14,
      marginLeft: 4,
    },
  });
