import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./journal.styles";
import JournalCard from "../../Components/EntryCard";
import AddEntryModal from "../../Components/EntryModal";
import useJournals from "../../Hooks/useJournals";
import useUser from "../../Hooks/useUser";

export default function JournalScreen() {
  const [AddEntryModalVisible, setAddEntryModalVisible] = useState(false);
  const { user, loading: userLoading, error: userError } = useUser();
  const { journals, loading, error } = useJournals(user?.id);

  if (userLoading || loading) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome, {user ? user.fullName : ""}
        </Text>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Journal</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddEntryModalVisible(true)}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {userError && (
          <Text style={styles.errorText}>
            Error loading user data: {userError}
          </Text>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}

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
          onSave={() => {
            setAddEntryModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
