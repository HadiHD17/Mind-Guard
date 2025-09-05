import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./EntryModal.Styles";
import PrimaryButton from "../Shared/Button/primaryindex";
import SecondaryButton from "../Shared/Button/secondaryindex";
import useUser from "../../Hooks/useUser";
import useJournals from "../../Hooks/useJournals";

export default function AddEntryModal({ visible, onClose, onSave }) {
  const [entryText, setEntryText] = useState("");
  const { user, loading: userLoading, error: userError } = useUser();
  const { addJournalEntry } = useJournals(user?.id, user?.accessToken);

  const handleSave = async () => {
    if (entryText.trim()) {
      addJournalEntry(entryText);
      onSave(entryText);
      setEntryText("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>New Journal Entry</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.textArea}
            placeholder="How are you feeling today? Write about your thoughts, experiences, or anything on your mind..."
            placeholderTextColor="#666"
            multiline
            value={entryText}
            onChangeText={setEntryText}
          />

          <View style={styles.buttonRow}>
            <SecondaryButton title="Cancel" onPress={onClose} />
            <PrimaryButton title="Save" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
