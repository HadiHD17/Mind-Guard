import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routes } from "./Routes/AppRoutes";
import BottomNav from "./Components/Shared/Bottom-Nav/index";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Landing">
        {routes
          .filter((r) => ["Landing", "Login", "Register"].includes(r.name))
          .map((r) => (
            <Stack.Screen key={r.name} name={r.name} component={r.component} />
          ))}
        <Stack.Screen name="MainTabs" component={BottomNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
