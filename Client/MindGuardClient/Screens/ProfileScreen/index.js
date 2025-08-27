import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for edit & logout icons
import styles from "./profile.styles";
import ProfileCard from "../../Components/ProfileCard";

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);

  const handleLogout = () => {
    console.log("Logout pressed");
    // Add logout logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent} // ✅ apply alignment here
        style={styles.scrollView}>
        {/* Welcome */}
        <Text style={styles.welcomeText}>Welcome, John</Text>

        {/* Profile Settings Title */}
        <Text style={styles.sectionTitle}>Profile Settings</Text>

        {/* Card 1: User Info */}
        <ProfileCard>
          <View>
            <Text style={styles.cardTitle}>Name</Text>
            <Text style={styles.cardSubtitle}>john.doe@email.com</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color="black" />
          </TouchableOpacity>
        </ProfileCard>

        {/* Card 2: Preferences */}
        <ProfileCard>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Preferences</Text>
            <View style={styles.preferenceRow}>
              <Text style={styles.cardSubtitle}>Dark Mode</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
            <View style={styles.preferenceRow}>
              <Text style={styles.cardSubtitle}>Calendar Syncing</Text>
              <Switch value={calendarSync} onValueChange={setCalendarSync} />
            </View>
          </View>
        </ProfileCard>

        {/* Card 3: Account */}
        <ProfileCard>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Account</Text>
            <TouchableOpacity style={{ marginTop: 12 }}>
              <Text style={styles.cardSubtitle}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={{ marginTop: 12 }}>
              <Text style={[styles.cardSubtitle, { color: "red" }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ProfileCard>
      </ScrollView>
    </SafeAreaView>
  );
}
