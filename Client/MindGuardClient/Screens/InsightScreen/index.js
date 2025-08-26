import React, { useState } from "react";
import { View, Text } from "react-native";
import styles from "./insight.styles";
import Input from "../../Components/Shared/Input";

export default function InsightScreen() {
  const [text, setText] = useState("");
  return (
    <View style={styles.screen}>
      <Text>Insight</Text>
      <Input
        label="insight"
        placeholder="Enter your insight"
        value={text}
        onChangeText={setText}
      />
    </View>
  );
}
