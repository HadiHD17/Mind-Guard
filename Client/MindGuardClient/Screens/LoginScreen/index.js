import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import styles from "./Login.Styles";
import Input from "../../Components/Shared/Input";
import PrimaryButton from "../../Components/Shared/Button/primaryindex";
import api from "../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Enter a valid email");
        valid = false;
      }
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };

  const HandleLogin = async () => {
    if (validate()) {
      try {
        const res = await api.post("/Auth/Login", {
          email,
          password,
        });
        const data = res.data;

        await AsyncStorage.setItem("@user_data", JSON.stringify(data));

        navigation.replace("MainTabs");
      } catch (error) {
        console.log("Login error:", error);
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

        <Text style={styles.welcomeText}>Welcome Back</Text>
        <View style={styles.inputWrapper}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.inputWrapper}>
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.forgotWrapper}
          onPress={() => alert("Forgot Password")}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Login"
          style={styles.loginButton}
          onPress={HandleLogin}
        />
        <View style={styles.signupWrapper}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("Register")}>
            Sign up
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
