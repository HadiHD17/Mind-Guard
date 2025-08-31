import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "./journal.styles";
import JournalCard from "../../Components/EntryCard";
import AddEntryModal from "../../Components/EntryModal";

const JournalScreen = ({ navigation }) => {
  const [AddEntryModalVisible, setAddEntryModalVisible] = useState(false);
  const journals = [
    {
      id: 1,
      day: "Monday",
      mood: "😊",
      content: "Had a great day!",
      sentiment: "positive",
    },
    {
      id: 2,
      day: "Tuesday",
      mood: "😔",
      content: "Felt a bit down.",
      sentiment: "negative",
    },
  ];

  const handleDelete = (id) => {
    console.log("Delete journal with id:", id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Welcome Message */}
        <Text style={styles.welcomeText}>Welcome</Text>

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
              day={item.day}
              mood={item.mood}
              content={item.content}
              sentiment={item.sentiment}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
        <AddEntryModal
          visible={AddEntryModalVisible}
          onClose={() => setAddEntryModalVisible(false)}
          onSave={(text) => {
            console.log("New journal entry:", text);
            setAddEntryModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default JournalScreen;
