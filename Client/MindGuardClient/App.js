import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routes } from "./Routes/AppRoutes";
import BottomNav from "./Components/Shared/Bottom-Nav/index";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

const Stack = createNativeStackNavigator();

export default function App({ user }) {
  const initialRouteName = user ? "MainTabs" : "Landing";
  const [ready, setReady] = useState(false);
  const [backend, setBackend] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await tf.ready();
        // fastest on-device; otherwise fall back to CPU
        try {
          await tf.setBackend("rn-webgl");
        } catch {
          await tf.setBackend("cpu");
        }
        setBackend(tf.getBackend());
        setReady(true);
      } catch (e) {
        console.error("TF init error:", e);
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRouteName}>
        {routes.map((r) => (
          <Stack.Screen key={r.name} name={r.name} component={r.component} />
        ))}
        <Stack.Screen name="MainTabs" component={BottomNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
