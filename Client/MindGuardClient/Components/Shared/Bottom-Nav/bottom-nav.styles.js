import { StyleSheet } from "react-native";

export const createBottomNavStyles = (theme) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      height: 60,
    },
  });
