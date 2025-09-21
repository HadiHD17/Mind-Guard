import { StyleSheet } from "react-native";

export const createRoutineStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      marginLeft: 8,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
  });
