import { StyleSheet } from "react-native";

export const createProfileStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "left",
      color: theme.text,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 15,
      alignSelf: "left",
      color: theme.text,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "left",
      color: theme.text,
    },
    cardSubtitle: {
      fontSize: 12,
      marginTop: 2,
      textAlign: "left",
      color: theme.textSecondary,
    },
    preferenceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 5,
      width: "100%",
    },
  });
