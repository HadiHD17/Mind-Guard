import { StyleSheet } from "react-native";

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  title: { fontSize: 18, fontWeight: "800" },
  sub: { color: "#444" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4,
  },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
});
