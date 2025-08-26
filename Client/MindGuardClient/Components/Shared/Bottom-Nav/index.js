import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import styles from "./bottom-nav.styles";

import { View, Text } from "react-native";
function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home</Text>
    </View>
  );
}
function JournalScreen() {
  return (
    <View style={styles.screen}>
      <Text>Journal</Text>
    </View>
  );
}
function InsightScreen() {
  return (
    <View style={styles.screen}>
      <Text>Insight</Text>
    </View>
  );
}
function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text>Profile</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Home") {
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Journal") {
              return (
                <Ionicons
                  name={focused ? "book" : "book-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Insight") {
              return <FontAwesome5 name="brain" size={size} color={color} />;
            } else if (route.name === "Profile") {
              return (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={size}
                  color={color}
                />
              );
            }
          },
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: styles.tabBar,
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Journal" component={JournalScreen} />
        <Tab.Screen name="Insight" component={InsightScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
