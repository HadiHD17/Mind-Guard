import React, { useState } from "react";
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

export default function RoutineScreen({ navigation }) {
  const [routines, setRoutines] = useState([
    {
      id: 1,
      title: "Morning Workout",
      time: "07:00 AM",
      days: ["Mon", "Wed", "Fri"],
    },
    {
      id: 2,
      title: "Read Book",
      time: "09:00 PM",
      days: ["Tue", "Thu", "Sat"],
    },
  ]);

  const [AddRoutineModalVisible, setAddRoutineModalVisible] = useState(false);

  const handleDelete = (id) => {
    setRoutines(routines.filter((r) => r.id !== id));
  };

  const handleMarkComplete = (id) => {
    console.log("Marked routine complete:", id);
  };

  const handleUpdateDays = (id, newDays) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, days: newDays } : r))
    );
  };
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
