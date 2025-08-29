import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./profile.styles";
import ProfileCard from "../../Components/ProfileCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditAccountModal from "../../Components/EditModal";
import EditPasswordModal from "../../Components/EditPasswordModal";
import { getUserData } from "../../Helpers/Storage";

export default function ProfileScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@user_data");
      navigation.replace("Landing");
    } catch (error) {
      console.log("logout error:", error);
    }
  };

  const [user, setUser] = useState(null);
  const fetchUser = async () => {
    const data = await getUserData();
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        <Text style={styles.welcomeText}>Welcome, {user?.fullName}</Text>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        <ProfileCard>
          <View>
            <Text style={styles.cardTitle}>{user?.fullName}</Text>
            <Text style={styles.cardSubtitle}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={() => setEditModalVisible(true)}>
            <Ionicons name="pencil" size={20} color="black" />
          </TouchableOpacity>
        </ProfileCard>
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
        <ProfileCard>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Account</Text>
            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => setEditPasswordVisible(true)}>
              <Text style={styles.cardSubtitle}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={{ marginTop: 12 }}>
              <Text style={[styles.cardSubtitle, { color: "red" }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ProfileCard>
        <EditAccountModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSave={(updatedUser) => setUser(updatedUser)}
          initialData={{
            name: user?.fullName || "",
            email: user?.email || "",
            phone: user?.phoneNumber || "",
          }}
        />
        <EditPasswordModal
          visible={editPasswordVisible}
          onClose={() => setEditPasswordVisible(false)}
          onSave={(data) => {
            console.log("Saved data:", data);
            setEditPasswordVisible(false);
          }}
        />
        ;
      </ScrollView>
    </SafeAreaView>
  );
}
