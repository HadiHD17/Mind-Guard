import { StyleSheet } from "react-native";

export const createRegisterStyles = (theme) =>
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
    titleText: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      color: theme.text,
    },
    inputWrapper: {
      width: 330,
      marginBottom: 5,
    },
    input: {
      width: "100%",
    },
    errorText: {
      color: theme.error,
      marginTop: 5,
      marginLeft: 0,
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
      color: theme.textMuted,
    },
    loginLink: {
      color: theme.primary,
      fontWeight: "bold",
    },
  });
