// AddEntryModal.js
import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./EntryModal.Styles";
import PrimaryButton from "../Shared/Button/primaryindex";
import SecondaryButton from "../Shared/Button/secondaryindex";

const AddEntryModal = ({ visible, onClose, onSave }) => {
  const [entryText, setEntryText] = useState("");

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
            <PrimaryButton title="Save" onPress={() => onSave(entryText)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddEntryModal;
