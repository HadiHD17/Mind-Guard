import { StyleSheet } from "react-native";

export const createEditModalStyles = (theme) =>
  StyleSheet.create({
    modalWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      paddingHorizontal: 20,
    },
    modalContainer: {
      width: 355,
      maxWidth: "90%",
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },
    errorText: {
      color: theme.error,
      marginTop: 5,
      marginLeft: 30,
    },
    buttonsWrapper: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 40,
    },

    button: {
      flex: 1,
    },
  });
