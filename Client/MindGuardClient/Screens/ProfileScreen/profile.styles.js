import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#Fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#Fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    alignSelf: "left",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "left",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    width: "100%",
  },
});
