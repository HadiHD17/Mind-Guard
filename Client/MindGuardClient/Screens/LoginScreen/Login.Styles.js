import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const inputWidth = 330;

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1E3A5F",
  },
  input: {
    width: inputWidth,
    marginBottom: 5,
  },
  forgotWrapper: {
    width: inputWidth,
    alignItems: "flex-start",
    marginBottom: 30,
  },
  forgotText: {
    color: "#FF7F50",
    fontWeight: "500",
  },
  loginButton: {
    width: inputWidth,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 0,
  },
  inputWrapper: {
    width: inputWidth,
    marginBottom: 10,
  },
  signupWrapper: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#666",
  },
  signupLink: {
    color: "orange",
    fontWeight: "bold",
  },
});
