import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./RoutineModal.Styles";
import Input from "../Shared/Input";
import PrimaryButton from "../Shared/Button/primaryindex";
import SecondaryButton from "../Shared/Button/secondaryindex";
import Week from "../Week";
import { getUserData } from "../../Helpers/Storage";
import api from "../../Api";

export default function AddRoutineModal({ visible, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const u = await getUserData();
    setUser(u);
  };

  const handleCreate = async () => {
    if (!title || !time || selectedDays.length === 0) return;
    try {
      const res = await api.post(
        "/Routine",
        {
          userId: user.id,
          description: title,
          reminder_Time: time,
          frequency: selectedDays.join(","),
        },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      if (res.data.status === "success") {
        onCreate({
          id: res.data.payload.id,
          description: title,
          reminder_Time: time,
          frequency: selectedDays.join(","),
        });

        setTitle("");
        setTime("");
        setSelectedDays([]);
        onClose();
      }
    } catch (err) {
      console.log("Error creating routine:", err);
    }
  };
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Routine</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Inputs */}
            <Input
              label="Routine Name"
              placeholder="e.g., Morning Workout"
              value={title}
              onChangeText={setTitle}
              style={{ width: "100%" }}
            />
            <Input
              label="Time"
              placeholder="e.g., 07:00 AM"
              value={time}
              onChangeText={setTime}
              style={{ width: "100%" }}
            />

            {/* Days */}
            <Week
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
            />

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              <SecondaryButton
                title="Cancel"
                onPress={onClose}
                style={styles.button}
              />
              <PrimaryButton
                title="Create Routine"
                onPress={handleCreate}
                style={styles.button}
                disabled={!title || !time || selectedDays.length === 0}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
