import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Input from "../../Components/Shared/Input";
import PrimaryButton from "../../Components/Shared/Button/primaryindex";
import styles from "./Register.Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../Api";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!phoneNumber.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validate()) {
      try {
        const res = await api.post("/Auth/Register", {
          fullName,
          email,
          password,
          phoneNumber,
        });
        const data = res.data;
        await AsyncStorage.setItem("@user_data", JSON.stringify(data));

        navigation.replace("MainTabs");
      } catch (error) {
        console.log("Register error:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.titleText}>Create Account</Text>

        <View style={styles.inputWrapper}>
          <Input
            label="Full Name"
            value={fullName}
            placeholder={"enter your full name"}
            onChangeText={setFullName}
            style={styles.input}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Input
            label="Email"
            value={email}
            placeholder={"enter your email address"}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputWrapper}>
          <Input
            label="Password"
            value={password}
            placeholder={"enter your password"}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Input
            label="Confirm Password"
            value={confirmPassword}
            placeholder={"Re-enter your password"}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Input
            label="Phone"
            value={phoneNumber}
            placeholder={"enter your phone number"}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <PrimaryButton
          title="Register"
          onPress={handleRegister}
          style={styles.registerButton}
        />

        <View style={styles.loginWrapper}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}>
            Sign in
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
