import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RoutineCard from "../../Components/RoutineCard";
import styles from "./Routine.Styles";
import AddRoutineModal from "../../Components/RoutineModal";
import { getUserData } from "../../Helpers/Storage";
import api from "../../Api";

export default function RoutineScreen({ navigation }) {
  const [routines, setRoutines] = useState([]);
  const [user, setUser] = useState(null);
  const [AddRoutineModalVisible, setAddRoutineModalVisible] = useState(false);

  const loadUser = async () => {
    const u = await getUserData();
    setUser(u);
  };

  const loadRoutines = async () => {
    try {
      const res = await api.get(`/Routine/UserRoutine/${user.id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (res.data.status === "success" && res.data.payload) {
        const today = new Date().toISOString().split("T")[0];
        const routinesWithCompletion = res.data.payload.map((r) => ({
          ...r,
          completedToday: r.lastCompletedDate === today,
        }));
        setRoutines(routinesWithCompletion);
      }
    } catch (err) {
      console.log("Error fetching routines:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/Routine/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
    } catch (err) {
      console.log("Error deleting routine:", err);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      const res = await api.post(`/Routine/${id}`, null, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (res.data.status === "success" && res.data.payload) {
        const { routineId, date, isCompleted } = res.data.payload;
        setRoutines((prev) =>
          prev.map((r) =>
            r.id === routineId
              ? { ...r, completedToday: isCompleted, lastCompletedDate: date }
              : r
          )
        );
      }
    } catch (err) {
      console.log("Error marking routine complete:", err.message);
    }
  };

  const handleUpdateDays = (id, newDays) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, days: newDays } : r))
    );
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) loadRoutines();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Routines</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddRoutineModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Routines List */}
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RoutineCard
            routine={item}
            onDelete={() => handleDelete(item.id)}
            onMarkComplete={() => handleMarkComplete(item.id)}
            setDays={(newDays) => handleUpdateDays(item.id, newDays)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
      />
      <AddRoutineModal
        visible={AddRoutineModalVisible}
        onClose={() => setAddRoutineModalVisible(false)}
        onCreate={(newRoutine) => {
          setRoutines((prev) => [...prev, { id: Date.now(), ...newRoutine }]);
          setAddRoutineModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
