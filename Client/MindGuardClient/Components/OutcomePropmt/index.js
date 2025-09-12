import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";
import styles from "./OutcomePrompt.styles";

export default function OutcomePrompt({ visible, onClose, onSubmit }) {
  const [isCrisis, setIsCrisis] = useState(null);
  const [notes, setNotes] = useState("");

  function reset() {
    setIsCrisis(null);
    setNotes("");
  }

  async function handleSubmit() {
    if (isCrisis == null) return;
    await onSubmit({ isCrisis, notes: notes.trim() || undefined });
    reset();
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Past 3 days — how did it go?</Text>
          <Text style={styles.sub}>
            Be honest with yourself. This helps improve your support.
          </Text>

          <View style={styles.row}>
            <Button
              title="I was okay"
              color={isCrisis === false ? "#38a169" : undefined}
              onPress={() => setIsCrisis(false)}
            />
            <Button
              title="Very bad day"
              color={isCrisis === true ? "#e53e3e" : undefined}
              onPress={() => setIsCrisis(true)}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Optional notes (e.g., panic spike, slept 2h)"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.row}>
            <Button
              title="Cancel"
              onPress={() => {
                reset();
                onClose();
              }}
            />
            <Button
              title="Submit"
              onPress={handleSubmit}
              disabled={isCrisis == null}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
