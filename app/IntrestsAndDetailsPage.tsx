 import React, { useState, useEffect } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView, StyleSheet } from "react-native";
import { Button, View, Text, TouchableOpacity, TextField } from "react-native-ui-lib";
import { Props } from "./signup";
import { User  } from "@/components/user";

const RenderItem = ({ item, remove }: { item: string; remove: () => void }) => {
  return (
    <View style={styles.renderItem}>
      <Text white>{item}</Text>
      <TouchableOpacity onPress={remove}>
        <Text style={{ color: "red" }}>Tabort</Text>
      </TouchableOpacity>
    </View>
  );
};

const IntrestsAndDetailsPage = ({ user, onNext }: Props) => {
  const [newInterest, setNewInterest] = useState<string>("");
  const [interests, setInterests] = useState<string[]>(user.interests);

  const [newDetail, setNewDetail] = useState<string>("");
  const [details, setDetails] = useState<string[]>(user.details);

  // Keep user updated when interests or details change (optional, but recommended)
  useEffect(() => {
    user.interests = interests;
  }, [interests]);

  useEffect(() => {
    user.details = details;
  }, [details]);

  const addInterest = () => {
    if (newInterest.trim() === "") return;
    setInterests(prev => [...prev, newInterest.trim()]);
    setNewInterest("");
  };

  const removeInterest = (index: number) => {
    setInterests(prev => prev.filter((_, i) => i !== index));
  };

  const addDetail = () => {
    if (newDetail.trim() === "") return;
    setDetails(prev => [...prev, newDetail.trim()]);
    setNewDetail("");
  };

  const removeDetail = (index: number) => {
    setDetails(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // Create updated user object with new interests and details
    const updatedUser: User = {
      ...user,
      interests,
      details,
    };
    onNext(updatedUser);
  };

  return (
    <GestureHandlerRootView style={{ flex: 0 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text white heading2>
          Mina intressen är
        </Text>
        <View left>
          <TextField
            placeholderTextColor="gray"
            value={newInterest}
            onChangeText={setNewInterest}
            placeholder="Ett intresse"
            style={styles.input}
          />
          <TouchableOpacity style={styles.input} onPress={addInterest}>
            <Text white>Lägg till intresse</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chiper}>
          {interests.map((item, index) => (
            <RenderItem
              key={`${item}-${index}`}
              item={item}
              remove={() => removeInterest(index)}
            />
          ))}
        </View>

        <Text white heading2>
          Detailjer om mig
        </Text>
        <View left>
          <TextField
            value={newDetail}
            placeholderTextColor="gray"
            onChangeText={setNewDetail}
            placeholder="En detail"
            style={styles.input}
          />
          <TouchableOpacity style={styles.input} onPress={addDetail}>
            <Text white>Lägg till detail</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chiper}>
          {details.map((item, index) => (
            <RenderItem
              key={`${item}-${index}`}
              item={item}
              remove={() => removeDetail(index)}
            />
          ))}
        </View>

        <Button marginT-50 onPress={handleNext}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Fortsätt</Text>
        </Button>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#000",
    borderColor: "gray",
    borderWidth: 1,
    color: "#a2a2a2",
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 15,
  },
  chiper: {
    backgroundColor: "#111",
    borderRadius: 12,
    flex: 1,
    overflow: "hidden",
    padding: 12,
  },
  renderItem: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 50,
  },

});

export default IntrestsAndDetailsPage;
