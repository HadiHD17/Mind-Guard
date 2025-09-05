import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styles from "./journal.styles";
import JournalCard from "../../Components/EntryCard";
import AddEntryModal from "../../Components/EntryModal";
import useUser from "../../Hooks/useUser";
import useJournals from "../../Hooks/useJournals";
import { Ionicons } from "@expo/vector-icons";

export default function JournalScreen() {
  const [AddEntryModalVisible, setAddEntryModalVisible] = useState(false);
  const { user, loading: userLoading, error: userError } = useUser();
  const { journals, loading, error, addJournalEntry } = useJournals(
    user?.id,
    user?.accessToken
  );

  const handleSaveEntry = (entryText) => {
    if (entryText.trim()) {
      addJournalEntry(entryText);
      setAddEntryModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome, {user ? user.fullName : ""}
        </Text>

        {userError && (
          <Text style={styles.errorText}>
            Error loading user data: {userError}
          </Text>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.headerRow}>
          <Text style={styles.title}>Journal</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddEntryModalVisible(true)}>
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
      </View>
    </SafeAreaView>
  );
}
