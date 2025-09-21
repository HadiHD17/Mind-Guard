import { StyleSheet } from "react-native";

export const createProfileCardStyles = (theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      minHeight: 82,
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
