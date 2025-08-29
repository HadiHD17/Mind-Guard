import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: 355,
    maxWidth: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  inputsWrapper: {
    gap: 15,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginLeft: 30,
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },

  button: {
    width: 100,
    height: 51,
  },
});
