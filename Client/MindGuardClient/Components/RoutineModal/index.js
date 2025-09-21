import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createRoutineModalStyles } from "./RoutineModal.Styles";
import Input from "../Shared/Input";
import PrimaryButton from "../Shared/Button/primaryindex";
import SecondaryButton from "../Shared/Button/secondaryindex";
import Week from "../Week";
import { useTheme } from "../../Theme/useTheme";

export default function AddRoutineModal({ visible, onClose, onCreate }) {
  const { theme } = useTheme();
  const styles = createRoutineModalStyles(theme);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    if (visible) {
      setTitle("");
      setTime("");
      setSelectedDays([]);
    }
  }, [visible]);

  const handleCreate = () => {
    if (!title || !time || selectedDays.length === 0) return;

    try {
      onCreate({
        title,
        time,
        selectedDays,
        completedToday: false,
        occurrence: [],
      });

      onClose();
    } catch (err) {
      console.error("Error creating routine:", err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Routine</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
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
