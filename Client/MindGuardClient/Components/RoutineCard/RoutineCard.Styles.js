import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#2196F3",
    marginBottom: 8,
  },
  completeButton: {
    borderColor: "#1E3A5F",
    borderWidth: 2,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  completeButtonText: {
    color: "#1E3A5F",
    fontWeight: "700",
    fontSize: 14,
  },
});
