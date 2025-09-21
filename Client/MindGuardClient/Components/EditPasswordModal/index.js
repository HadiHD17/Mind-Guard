import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createEditPasswordModalStyles } from "./EditPasswordModal.Styles";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../Components/Shared/Input";
import PrimaryButton from "../../Components/Shared/Button/primaryindex";
import SecondaryButton from "../../Components/Shared/Button/secondaryindex";
import useUser from "../../Hooks/useUser";
import { useTheme } from "../../Theme/useTheme";
import useEditAccount from "../../Hooks/useEditAccount";

export default function EditPasswordModal({ visible, onClose, onSave }) {
  const { theme } = useTheme();
  const styles = createEditPasswordModalStyles(theme);

  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user } = useUser();
  const { editPassword } = useEditAccount();

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
        await editPassword(password, newpassword, user.id, user.accessToken);
        onClose();
      } catch (err) {
        console.error("Failed to save account changes:", err.response || err);
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
              <Ionicons name="close" size={24} color={theme.text} />
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
