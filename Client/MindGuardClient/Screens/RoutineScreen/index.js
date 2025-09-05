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
import useUser from "../../Hooks/useUser";
import useRoutine from "../../Hooks/useRoutine";

export default function RoutineScreen({ navigation }) {
  const [AddRoutineModalVisible, setAddRoutineModalVisible] = useState(false);
  const { user } = useUser();
  const {
    routine,
    routines,
    loading,
    error,
    handleDeleteRoutine,
    handleMarkCompleteRoutine,
    handleUpdateRoutineDays,
    handleAddRoutine,
  } = useRoutine(user?.id, user?.accessToken);

  return (
    <SafeAreaView style={styles.container}>
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

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RoutineCard
            key={item.id}
            routine={item}
            onDelete={() => handleDeleteRoutine(item.id)}
            onMarkComplete={() => handleMarkCompleteRoutine(item.id)}
            setDays={(newDays) => handleUpdateRoutineDays(item.id, newDays)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
      />
      <AddRoutineModal
        visible={AddRoutineModalVisible}
        onClose={() => setAddRoutineModalVisible(false)}
        onCreate={(newRoutine) => {
          handleAddRoutine(
            newRoutine.title,
            newRoutine.time,
            newRoutine.selectedDays
          );
          setAddRoutineModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
