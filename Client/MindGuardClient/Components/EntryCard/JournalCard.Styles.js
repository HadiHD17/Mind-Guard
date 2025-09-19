import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  day: {
    fontSize: 16,
    fontWeight: "600",
  },
  mood: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    fontSize: 12,
    color: "#333",
    marginBottom: 6,
  },
  sentiment: {
    fontSize: 12,
    fontWeight: "200",
    color: "#555",
  },
});
