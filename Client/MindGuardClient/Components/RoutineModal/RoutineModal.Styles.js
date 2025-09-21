import { StyleSheet } from "react-native";

export const createRoutineModalStyles = (theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
    },

    buttonsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 40,
      marginTop: 16,
    },
    button: {
      flex: 1,
    },
  });
