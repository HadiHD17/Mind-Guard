import { StyleSheet } from "react-native";

export const createMoodMapStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 16 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 10,
      color: theme.text,
    },
    calendar: { marginBottom: 20 },
    entryList: { marginTop: 20 },
    entryTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
      color: theme.text,
    },
    entryCard: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    entryMood: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 4,
      color: theme.text,
    },
    entryContent: { fontSize: 14, color: theme.textSecondary },
  });
