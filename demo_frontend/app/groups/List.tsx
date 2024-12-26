import React from "react";
import {useEffect, useState} from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert, FlatList } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {Link, router, useRouter} from "expo-router";

interface Group {
  id: string;
  name: string;
  members: object[];
  messages: object[];
  timestamp: string;
}

export default function GroupListScreen() {
  const [groups, setGroups] = useState<Group[]>([]);

  const navigateDetails = (groupId: string, name: string, timestamp: string) => {
    router.push({
      pathname: "/group/Details",
      params: { groupId, name, timestamp },
    });
  };

  
  function navigateCreate() {
    router.push("/groups/Create");
  };

  useEffect(() => {
    async function fetchGroups() {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
        Alert.alert("Error", "User is not authenticated");
        return;
        }
        
        // Add the token to the Authorization header
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };  
        try {
          const response = await fetch("http://10.51.98.118:8080/groups/list", requestOptions);
          if (response.ok) {
            const data = await response.json();
            setGroups(data); // Assuming the response is an array of Group objects
          } else {
            Alert.alert("Error", await response.text());
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "An error occurred while fetching groups");

        }
    }
    fetchGroups(); 
  }, []); // Empty dependency array ensures this runs once

  const renderGroup = ({ item }: { item: Group }) => (
    <Pressable style={Styles.listItem} onPress={() => navigateDetails(item.id, item.name, item.timestamp)}>
      <Text style={Styles.listItemText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={Styles.outerContainer}>
      <View style={Styles.container}>
        <Text style={Styles.title}>Your Groups</Text>
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          contentContainerStyle={Styles.list}
        />
      </View>
    </View>
    /*      <Pressable style={Styles.createButton} onPress={navigateCreate}>
        <Text style={Styles.createButtonText}>Create Group</Text>
      </Pressable>*/
  );
}

const Styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "lightgreen",
    padding: 10,
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "green",
    marginBottom: 15,
  },
  list: {
    flexGrow: 1,
    paddingTop: 10,
  },
  listItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  listItemText: {
    fontSize: 18,
    color: "darkgreen",
    fontWeight: "bold",
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
    paddingVertical: 15,
    backgroundColor: "#264653",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
  },
});