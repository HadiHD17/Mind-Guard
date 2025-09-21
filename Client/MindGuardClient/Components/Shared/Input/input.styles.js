import { StyleSheet } from "react-native";

export const createInputStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
      width: "80%",
      alignSelf: "center",
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 6,
    },
    input: {
      height: 40,
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: 6,
      paddingHorizontal: 10,
      fontSize: 12,
      color: theme.text,
      backgroundColor: theme.surface,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 1,
    },
  });
