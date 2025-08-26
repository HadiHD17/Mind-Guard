import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import BottomNav from "./Components/Shared/Bottom-Nav";
import TopBar from "./Components/Shared/Top-Bar";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        {/* Your main content goes here */}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    // optional: paddingHorizontal: 20,
    // optional: paddingTop: 10,
  },
});
