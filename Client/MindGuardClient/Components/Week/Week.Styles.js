import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  day: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  selectedDay: {
    backgroundColor: "#80C6DA",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "400",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
});
