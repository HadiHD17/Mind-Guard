import { StyleSheet } from "react-native";

export const createTipCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.primary,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      fontWeight: "600", // semi-bold
      color: "#FFFFFF",
    },
  });
