import { StyleSheet } from "react-native";

export const createSecondaryButtonStyles = (theme) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.primaryDark,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
