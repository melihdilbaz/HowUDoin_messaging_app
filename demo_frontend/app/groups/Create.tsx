import {useEffect, useState} from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import {Link, router, useRouter} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router/build/hooks";

/** BUTTON FOR MESSAGING SCREEN
 *  
 */
export default function GroupCreateScreen() {
  const [member, setMember] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [name, setName] = useState("");

  function getMembers(member : string) {
    setMembers((prevMembers) => [...prevMembers, member]);  }

  async function submitCreate() {
    const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "User is not authenticated");
        return;
      }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(members), // Convert requestBody to JSON
    };

    try {
      const response = await fetch("http://10.51.98.118:8080/groups/create?name="+name, requestOptions);
      const data = await response.text();
      Alert.alert("Update", data);

    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred", "Please try again later.");
    }
  }

  return (
    <View style={Styles.outerContainer}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.title}>Create a New Group</Text>
      </View>
      <View style={Styles.formContainer}>
        <TextInput
          style={Styles.textBoxes}
          placeholder="Enter group name"
          placeholderTextColor="gray"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          style={Styles.textBoxes}
          placeholder="Enter member email"
          placeholderTextColor="gray"
          onChangeText={(text) => setMember(text)}
          value={member}
        />
        <Pressable
          style={Styles.addButton}
          onPress={() => {
            if (member) {
              getMembers(member);
              setMember(""); // Clear input after adding
            }
          }}
        >
          <Text style={Styles.addButtonText}>Add {member || "a member"} to the group</Text>
        </Pressable>
      </View>
      <View style={Styles.footerContainer}>
        <Text style={Styles.footerText}>Are you done adding members?</Text>
        <Pressable style={Styles.createButton} onPress={submitCreate}>
          <Text style={Styles.createButtonText}>Create Group</Text>
        </Pressable>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "lightgreen",
    padding: 20,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "darkgreen",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textBoxes: {
    height: 50,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "black",
  },
  addButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "darkgreen",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: "darkgreen",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerContainer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 18,
    color: "darkgreen",
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: "darkgreen",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});