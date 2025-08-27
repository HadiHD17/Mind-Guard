import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "./EditPasswordModal.Styles";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../Components/Shared/Input";
import PrimaryButton from "../../Components/Shared/Button/primaryindex";
import SecondaryButton from "../../Components/Shared/Button/secondaryindex";

export default function EditPasswordModal({ visible, onClose, onSave }) {
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Password</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E3A5F" />
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.inputsWrapper}>
            <Input
              label="Current Passowrd"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Input
              label="New Password"
              value={newpassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonsWrapper}>
            <SecondaryButton
              title="Cancel"
              onPress={onClose}
              style={[styles.button]}
            />
            <PrimaryButton
              title="Save"
              onPress={() => onSave({ password, newpassword, confirmPassword })}
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
