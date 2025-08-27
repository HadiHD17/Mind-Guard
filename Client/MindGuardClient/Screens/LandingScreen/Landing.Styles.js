import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "700", // bold
    textAlign: "center",
    marginBottom: 60,
    color: "#000",
  },
  buttonWrapper: {
    width: 208,
    alignItems: "center",
    gap: 15,
  },
  button: {
    width: 208,
    height: 51,
  },
});

export default styles;
