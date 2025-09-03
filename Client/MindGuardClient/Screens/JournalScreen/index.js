import React, { use, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "./journal.styles";
import JournalCard from "../../Components/EntryCard";
import AddEntryModal from "../../Components/EntryModal";
import api from "../../Api";
import { getUserData } from "../../Helpers/Storage";

export default function JournalScreen() {
  const [AddEntryModalVisible, setAddEntryModalVisible] = useState(false);
  const [journals, setJournals] = useState([]);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const u = await getUserData();
    setUser(u);
  };

  const getJournals = async () => {
    try {
      const res = await api.get(`/Entry/UserEntries/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (res.data.status === "success" && res.data.payload) {
        setJournals(res.data.payload);
      }
    } catch (err) {
      console.log("journal error: ", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      getJournals();
    }
  }, [user, journals]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Welcome Message */}
        <Text style={styles.welcomeText}>
          Welcome, {user ? user.fullName : ""}
        </Text>

        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Journal</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddEntryModalVisible(true)}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Journal Entries */}
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
