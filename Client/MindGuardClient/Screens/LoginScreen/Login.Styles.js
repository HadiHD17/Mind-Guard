import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const inputWidth = 330;

export const createLoginStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
      backgroundColor: theme.background,
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
      color: theme.text,
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
      color: theme.warning,
      fontWeight: "500",
    },
    loginButton: {
      width: inputWidth,
    },
    errorText: {
      color: theme.error,
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
      color: theme.textMuted,
    },
    signupLink: {
      color: theme.primary,
      fontWeight: "bold",
    },
  });
