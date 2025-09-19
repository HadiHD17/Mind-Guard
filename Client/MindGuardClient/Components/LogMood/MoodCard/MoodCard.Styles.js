import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    width: 90,
    height: 80,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedCard: {
    backgroundColor: "#80C6DA",
    borderColor: "#1E3A5F",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#1E3A5F",
  },
  selectedText: {
    color: "#fff",
  },
});
