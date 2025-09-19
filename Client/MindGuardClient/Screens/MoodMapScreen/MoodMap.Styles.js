import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  calendar: { marginBottom: 20 },
  entryList: { marginTop: 20 },
  entryTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  entryCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  entryMood: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  entryContent: { fontSize: 14, color: "#333" },
});
