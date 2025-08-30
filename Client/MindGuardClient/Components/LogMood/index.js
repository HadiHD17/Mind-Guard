import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MoodCard from "./MoodCard/index";
import styles from "./LogMood.Styles";
import { getUserData } from "../../Helpers/Storage";
import api from "../../Api";

export default function LogMoodModal({ visible, onClose, onSelectMood }) {
  const moods = ["angry", "happy", "stressed", "neutral", "sad", "anxious"];
  const [selectedMood, setSelectedMood] = useState(null);

  const logMood = async (mood) => {
    try {
      const user = await getUserData();
      const res = await api.post(
        "/Mood",
        {
          userId: user.id,
          mood_Label: mood,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (res.data.status == "success") {
        console.log("mood added ");
      }
      if (onSelectMood) onSelectMood(mood);
    } catch (err) {
      console.log("Mood error: ", err);
    }
  };

  const handlePress = async (mood) => {
    setSelectedMood(mood);
    await logMood(mood);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>How Are You Feeling?</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E3A5F" />
            </TouchableOpacity>
          </View>

          {/* Mood Cards */}
          <View style={styles.cardsWrapper}>
            {moods.map((mood, index) => (
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
