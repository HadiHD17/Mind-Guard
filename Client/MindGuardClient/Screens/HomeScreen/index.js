import React from "react";
import { View, Text } from "react-native";
import styles from "./home.styles";
import PrimaryButton from "../../Components/Shared/Button/primaryindex";
import SecondaryButton from "../../Components/Shared/Button/secondaryindex";

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home</Text>
      <PrimaryButton title="go to journal" onPress={() => alert("journal")} />
      <SecondaryButton
        title="go to insights"
        onPress={() => alert("insights")}
      />
    </View>
  );
}
