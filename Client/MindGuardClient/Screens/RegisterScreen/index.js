import React from "react";
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
import useRegister from "../../Hooks/useRegister";

export default function RegisterScreen({ navigation }) {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phoneNumber,
    setPhoneNumber,
    errors,
    handleRegister,
    loading,
    error,
  } = useRegister(navigation);

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
            placeholder={"Enter your full name"}
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
            placeholder={"Enter your email address"}
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
            placeholder={"Enter your password"}
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
            placeholder={"Enter your phone number"}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        <PrimaryButton
          title={loading ? "Registering..." : "Register"}
          onPress={handleRegister}
          style={styles.registerButton}
          disabled={loading}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
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
