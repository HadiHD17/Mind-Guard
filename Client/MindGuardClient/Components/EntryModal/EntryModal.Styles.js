import { StyleSheet } from "react-native";

export const createEntryModalStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalContainer: {
      width: 350,
      height: 300,
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 15,
      justifyContent: "space-between",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    textArea: {
      flex: 1,
      fontSize: 12,
      textAlignVertical: "top",
      padding: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      marginVertical: 10,
      backgroundColor: theme.surface,
      color: theme.text,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 40,
    },
  });
