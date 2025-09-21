import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { createJournalStyles } from "./journal.styles";
import JournalCard from "../../Components/EntryCard";
import AddEntryModal from "../../Components/EntryModal";
import useUser from "../../Hooks/useUser";
import useJournals from "../../Hooks/useJournals";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../Theme/useTheme";

export default function JournalScreen() {
  const { theme } = useTheme();
  const styles = createJournalStyles(theme);
  const [AddEntryModalVisible, setAddEntryModalVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false); // shows "Analyzing…" overlay
  const { user, loading: userLoading, error: userError } = useUser();
  const { journals, loading, error, addJournalEntry } = useJournals(
    user?.id,
    user?.accessToken
  );

  const dotAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(dotAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [dotAnim]);

  const handleSaveEntry = async (entryText) => {
    const text = (entryText || "").trim();
    if (!text) return;

    setAddEntryModalVisible(false);

    await new Promise((r) => setTimeout(r, 30));

    setAnalyzing(true);

    try {
      await addJournalEntry(text);
    } catch (e) {
      console.warn("Failed to add journal entry:", e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome, {user ? user.fullName : ""}
        </Text>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Journal</Text>
          <TouchableOpacity
            style={[styles.addButton, analyzing && { opacity: 0.5 }]}
            onPress={() => setAddEntryModalVisible(true)}
            disabled={analyzing}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={journals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <JournalCard
              day={new Date(item.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              mood={item.detectedEmotion}
              content={item.content}
              sentiment={item.sentimentScore}
            />
          )}
          contentContainerStyle={styles.list}
        />

        <AddEntryModal
          visible={AddEntryModalVisible}
          onClose={() => setAddEntryModalVisible(false)}
          onSave={handleSaveEntry}
        />
        <Modal
          visible={analyzing}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {}}>
          <View style={styles.analyzingOverlayAbsolute} pointerEvents="auto">
            <View style={styles.analyzingBox}>
              <ActivityIndicator size="large" />
              <Text style={styles.analyzingText}>Analyzing your entry…</Text>

              <View style={styles.dotsRow}>
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      opacity: dotAnim.interpolate({
                        inputRange: [0, 0.33, 1],
                        outputRange: [1, 0.3, 1],
                      }),
                      transform: [
                        {
                          scale: dotAnim.interpolate({
                            inputRange: [0, 0.33, 1],
                            outputRange: [1, 0.85, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      opacity: dotAnim.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: [0.3, 1, 0.3, 0.3],
                      }),
                      transform: [
                        {
                          scale: dotAnim.interpolate({
                            inputRange: [0, 0.33, 0.66, 1],
                            outputRange: [0.85, 1, 0.85, 0.85],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      opacity: dotAnim.interpolate({
                        inputRange: [0, 0.66, 1],
                        outputRange: [0.3, 0.3, 1],
                      }),
                      transform: [
                        {
                          scale: dotAnim.interpolate({
                            inputRange: [0, 0.66, 1],
                            outputRange: [0.85, 0.85, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>

              <Text style={styles.analyzingSubText}>
                This takes a few seconds. We'll add it as soon as it's ready.
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
