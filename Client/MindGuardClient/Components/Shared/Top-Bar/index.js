import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./TopBar.styles";

export default function TopBar({ userName = "User", onProfilePress }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Welcome, {userName}</Text>
        <Text style={styles.subtext}>
          Here is how you are feeling lately...
        </Text>
      </View>

      <TouchableOpacity onPress={onProfilePress} style={styles.avatar}>
        <Ionicons name="person-circle" size={40} color="#000" />
      </TouchableOpacity>
    </View>
  );
}
