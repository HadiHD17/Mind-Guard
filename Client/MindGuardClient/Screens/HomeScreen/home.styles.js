import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "left",
  },
  feelingCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },

  infoCardsColumn: {
    flexDirection: "column",
  },
});
