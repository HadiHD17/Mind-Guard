import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MoodCard from "./MoodCard/index";
import styles from "./LogMood.Styles";
import useUser from "../../Hooks/useUser";

export default function LogMoodModal({ visible, onClose, onSelectMood }) {
  const { user } = useUser();
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = ["angry", "happy", "stressed", "neutral", "sad", "anxious"];

  const handlePress = (mood) => {
    if (!user?.id) return;
    setSelectedMood(mood);

    if (onSelectMood) onSelectMood(mood);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>How Are You Feeling?</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E3A5F" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardsWrapper}>
            {moods.map((mood) => (
              <MoodCard
                key={mood}
                title={mood}
                selected={selectedMood === mood}
                onPress={() => handlePress(mood)}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
