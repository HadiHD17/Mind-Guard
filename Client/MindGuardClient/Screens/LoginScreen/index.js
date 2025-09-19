import React from "react";
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
import { useSelector } from "react-redux";
import useLogin from "../../Hooks/useLogin";

export default function LoginScreen({ navigation }) {
  const { loading, error } = useSelector((state) => state.auth);

  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    handleLogin,
  } = useLogin(navigation);

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
            placeholder={"Enter your email address"}
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
            placeholder={"Enter your password"}
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
          title={loading ? "Logging in..." : "Login"}
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
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
