import { StyleSheet } from "react-native";

export const createPrimaryButtonStyles = (theme) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
