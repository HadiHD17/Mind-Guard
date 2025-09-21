import { StyleSheet } from "react-native";

export const createHomeStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 20,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: "600",
      textAlign: "left",
      marginBottom: 20,
      color: theme.text,
    },
    questionText: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 15,
      textAlign: "left",
      color: theme.text,
    },
    feelingCardsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 20,
    },

    infoCardsColumn: {
      flexDirection: "column",
    },
  });
