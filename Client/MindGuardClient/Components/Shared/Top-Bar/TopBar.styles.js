import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#80C6DA", // optional
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700", // bold
    color: "#000",
  },
  subtext: {
    fontSize: 14,
    fontWeight: "500", // medium
    color: "#000",
    marginTop: 4,
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
  },
});
