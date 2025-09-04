import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    width: "100%",
    height: "auto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  rightText: {
    fontSize: 14,
    color: "#80C6DA",
    fontWeight: "500",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dayContainer: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 5,
  },
  moodText: {
    fontSize: 20,
  },
});
