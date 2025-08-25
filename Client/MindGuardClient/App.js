import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

export default function App() {
  const [isTfReady, setIsTfReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Wait for tf to be ready
      await tf.ready();
      setIsTfReady(true);
    }
    prepare();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isTfReady ? (
        <Text>✅ TensorFlow.js is Ready!</Text>
      ) : (
        <Text>⏳ Loading TensorFlow.js...</Text>
      )}
    </View>
  );
}
