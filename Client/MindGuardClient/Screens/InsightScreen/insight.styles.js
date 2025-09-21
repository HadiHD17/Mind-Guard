import { StyleSheet } from "react-native";

export const createInsightStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 16,
    },
    welcome: {
      fontSize: 24,
      fontWeight: "600", // semi-bold
      color: theme.text,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      marginVertical: 12,
    },
  });
