import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "./EditModal.Styles";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../Components/Shared/Input";
import PrimaryButton from "../../Components/Shared/Button/primaryindex";
import SecondaryButton from "../../Components/Shared/Button/secondaryindex";
import api from "../../Api";
import { getUserData } from "../../Helpers/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUser from "../../Hooks/useUser";
import useEditAccount from "../../Hooks/useEditAccount";

export default function EditAccountModal({
  visible,
  onClose,
  onSave,
  initialData,
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");

  const { user } = useUser(); // Get user data from Redux
  const { editAccount } = useEditAccount();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!(name || "").trim()) newErrors.fullName = "Full name is required";
    if (!(email || "").trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";
    if (!(phone || "").trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (visible) {
      setName(initialData?.name || "");
      setEmail(initialData?.email || "");
      setPhone(initialData?.phone || "");
      setErrors({});
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    if (validate()) {
      try {
        await editAccount(name, email, phone, user.id, user.accessToken);
        onClose();
      } catch (err) {
        console.error("Failed to save account changes:", err);
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
            <Text style={styles.title}>Edit Account</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E3A5F" />
            </TouchableOpacity>
          </View>

          <View>
            <View style={{ marginBottom: 5 }}>
              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                style={{ width: "100%" }}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            <View style={{ marginBottom: 5 }}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={{ width: "100%" }}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={{ marginBottom: 5 }}>
              <Input
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                style={{ width: "100%" }}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
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
