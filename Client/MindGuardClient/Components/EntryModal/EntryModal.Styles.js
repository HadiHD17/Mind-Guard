import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center", // centers vertically
    alignItems: "center", // centers horizontally
    backgroundColor: "rgba(0,0,0,0.3)", // dim background
  },
  modalContainer: {
    width: 350,
    height: 300,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    padding: 15,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  textArea: {
    flex: 1,
    fontSize: 12,
    textAlignVertical: "top",
    padding: 8,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
});
