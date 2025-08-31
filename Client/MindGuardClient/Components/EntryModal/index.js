import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./EntryModal.Styles";
import PrimaryButton from "../Shared/Button/primaryindex";
import SecondaryButton from "../Shared/Button/secondaryindex";
import api from "../../Api";
import { getUserData } from "../../Helpers/Storage";

export default function AddEntryModal({ visible, onClose, onSave }) {
  const [entryText, setEntryText] = useState("");
  const [user, setUser] = useState(null);
  const loadUser = async () => {
    const u = await getUserData();
    setUser(u);
  };

  const handleSave = async () => {
    try {
      const res = await api.post(
        `/Entry`,
        {
          userId: user.id,
          content: entryText,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (res.data.status === "success") {
        onSave(entryText);
        setEntryText("");
        onClose();
      }
    } catch (err) {
      console.log("Save entry error:", err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New Journal Entry</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* Text Area */}
          <TextInput
            style={styles.textArea}
            placeholder="How are you feeling today? Write about your thoughts, experiences, or anything on your mind..."
            placeholderTextColor="#666"
            multiline
            value={entryText}
            onChangeText={setEntryText}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <SecondaryButton title="Cancel" onPress={onClose} />
            <PrimaryButton title="Save" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
