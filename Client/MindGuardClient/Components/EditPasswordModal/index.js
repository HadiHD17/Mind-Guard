import React, { useEffect, useState } from "react";
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
import { getUserData } from "../../Helpers/Storage";
import api from "../../Api";

export default function EditPasswordModal({ visible, onClose, onSave }) {
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!password.trim()) newErrors.password = "Password is required";
    if (!newpassword.trim()) newErrors.newpassword = "New password is required";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";
    else if (newpassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (visible) {
      setErrors({});
    }
  }, [visible]);

  const handleSave = async () => {
    if (validate()) {
      try {
        const user = await getUserData();
        const res = await api.put(
          `/User/UpdatePassword/${user.id}`,
          {
            currentPassword: password,
            newPassword: newpassword,
            confirmNewPassword: confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        if (res.data.status == "success") {
          onSave();
        }
        onClose();
      } catch (err) {
        console.log("Update Error", err);
      }
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Password</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E3A5F" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputsWrapper}>
            <View>
              <Input
                label="Current Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: "100%" }}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            <View>
              <Input
                label="New Password"
                value={newpassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={{ width: "100%" }}
              />
              {errors.newpassword && (
                <Text style={styles.errorText}>{errors.newpassword}</Text>
              )}
            </View>
            <View>
              <Input
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={{ width: "100%" }}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          </View>

          <View style={styles.buttonsWrapper}>
            <SecondaryButton
              title="Cancel"
              onPress={onClose}
              style={[styles.button]}
            />
            <PrimaryButton
              title="Save"
              onPress={handleSave}
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
