import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { createBottomNavStyles } from "./bottom-nav.styles";
import { routes } from "../../../Routes/AppRoutes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../Theme/useTheme";

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  const { theme } = useTheme();
  const styles = createBottomNavStyles(theme);
  const insets = useSafeAreaInsets();
  return (
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
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          ...styles.tabBar,
          paddingBottom: insets.bottom + 10,
          height: 40 + insets.bottom,
        },
      })}>
      {routes
        .filter((r) =>
          ["Home", "Journal", "Insight", "Profile"].includes(r.name)
        )
        .map((r) => (
          <Tab.Screen key={r.name} name={r.name} component={r.component} />
        ))}
    </Tab.Navigator>
  );
}
