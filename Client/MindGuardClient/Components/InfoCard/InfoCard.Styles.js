import { StyleSheet } from "react-native";

export default StyleSheet.create({
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    marginBottom: 10,
  },
  infoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoCardRightText: {
    fontSize: 14,
    color: "#1E90FF",
    fontWeight: "500",
  },
  infoCardSubtitle: {
    fontSize: 12,
    color: "#555",
  },
});
