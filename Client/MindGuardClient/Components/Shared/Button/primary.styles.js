import { StyleSheet } from "react-native";

export default StyleSheet.create({
  button: {
    backgroundColor: "#80C6DA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    //width: "60%", // ✅ makes both buttons the same width relative to screen
    //alignSelf: "center", // ✅ centers them
  },
  text: {
    color: "#1E3A5F",
    fontSize: 16,
    fontWeight: "600",
  },
});
