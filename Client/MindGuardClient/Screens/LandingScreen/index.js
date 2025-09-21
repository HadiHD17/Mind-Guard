import React from "react";
import { View, Text, Image } from "react-native";
import { createLandingStyles } from "./Landing.Styles";
import PrimaryButton from "../../Components/Shared/Button/primaryindex";
import SecondaryButton from "../../Components/Shared/Button/secondaryindex";
import { useTheme } from "../../Theme/useTheme";

export default function LandingScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createLandingStyles(theme);
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>Your AI Wellness Companion</Text>

      <View style={styles.buttonWrapper}>
        <SecondaryButton
          title="Get Started"
          onPress={() => navigation.navigate("Register")}
          style={styles.button}
        />
        <PrimaryButton
          title="Login"
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
        />
      </View>
    </View>
  );
}
