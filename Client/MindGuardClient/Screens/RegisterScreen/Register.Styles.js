import { StyleSheet } from "react-native";

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
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  inputWrapper: {
    width: 330,
    marginBottom: 15,
  },
  input: {
    width: "100%",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginLeft: 0, // align under input
  },
  registerButton: {
    width: 330,
    marginTop: 10,
  },
  loginWrapper: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "orange",
    fontWeight: "bold",
  },
});
