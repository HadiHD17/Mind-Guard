import { StyleSheet } from "react-native";

export const createWeekStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    day: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginRight: 8,
      backgroundColor: theme.borderLight,
    },
    selectedDay: {
      backgroundColor: theme.primary,
    },
    dayText: {
      fontSize: 12,
      fontWeight: "400",
      color: theme.text,
    },
    selectedDayText: {
      color: "#fff",
      fontWeight: "600",
    },
  });
