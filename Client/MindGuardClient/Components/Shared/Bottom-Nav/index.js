import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import styles from "./bottom-nav.styles";
import { routes } from "../../../Routes/AppRoutes";

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const current = routes.find((r) => r.name === route.name);

            if (current?.icon?.type === "FontAwesome5") {
              return (
                <FontAwesome5
                  name={current.icon.name}
                  size={size}
                  color={color}
                />
              );
            }

            return (
              <Ionicons
                name={focused ? current.icon.focused : current.icon.default}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: styles.tabBar,
        })}>
        {routes.map((r) => (
          <Tab.Screen key={r.name} name={r.name} component={r.component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
