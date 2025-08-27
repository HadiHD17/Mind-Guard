import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 50,
    textAlign: "center", // ✅ only this one centered
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    alignSelf: "flex-start", // ✅ left aligned
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left", // ✅ inside cards left aligned
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "left", // ✅ inside cards left aligned
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    width: "100%",
  },
});
