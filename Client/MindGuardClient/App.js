import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routes } from "./Routes/AppRoutes";
import BottomNav from "./Components/Shared/Bottom-Nav/index";

const Stack = createNativeStackNavigator();

export default function App({ user }) {
  const initialRouteName = user ? "MainTabs" : "Landing";

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
