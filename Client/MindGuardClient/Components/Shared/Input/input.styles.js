import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "80%",
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: "rgba(36,36,36,0.3)",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 0,
    elevation: 1,
  },
});
