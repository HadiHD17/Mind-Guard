import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#Fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#80C6DA",
    borderRadius: 20,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingBottom: 20,
  },
  analyzingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  analyzingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  analyzingSubText: {
    marginTop: 6,
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },

  // NEW for animated dots
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#80C6DA", // pick your brand color
    marginHorizontal: 4,
  },
  // Renders above everything in the screen
  // In your journal.styles.js
  analyzingOverlayAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Very high zIndex
  },
  analyzingBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 250,
  },
  // ... rest of your styles
});
