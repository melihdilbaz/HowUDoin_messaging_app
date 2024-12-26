import {useEffect, useState} from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert, FlatList } from "react-native";
import {Link, router, useRouter} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router/build/hooks";

interface Account {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
export default function DetailScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [friend, setFriend] = useState("");

  const params = useLocalSearchParams();
  const { groupId, name, timestamp } = params; // Use params directly without setting state

  function navigateGroupMessages() {
    router.push({
        pathname: "/group/Messages",
        params: { groupId },
    });
  }
  
  useEffect(() => {
    async function fetchRequest() {
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

      fetch("http://10.51.98.118:8080/groups/"+groupId+"/members",requestOptions)
      .then((response) => response.json())
      .then((json) => setAccounts(json))
      .catch((error) => console.error(error));   
    }
    fetchRequest();
  }, [accounts]);

  async function submitAdd() {
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
    };

    try {
      if(!friend)
        Alert.alert("An error occurred", "Please try again later.");
      else {
        const response = await fetch("http://10.51.98.118:8080/groups/"+groupId+"/add-member?user="+friend, requestOptions);
        const data = await response.text();
        Alert.alert("Update", data);
      }

    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred", "Please try again later.");
    }
  }

  const renderMember = ({ item }: { item: Account }) => (
    <View style={Styles.memberContainer}>
      <Text style={Styles.memberEmail}>{item.email}</Text>
      <Text style={Styles.memberName}>
        {item.firstName} {item.lastName}
      </Text>
    </View>
  );

  return (
    <View style={Styles.outerContainer}>
      <View style={Styles.groupInfoContainer}>
        <Text style={Styles.groupName}>Group Name: {name}</Text>
        <Text style={Styles.groupTimestamp}>Created on: {timestamp}</Text>
      </View>
  
      <View style={Styles.listWrapper}>
        <FlatList
          data={accounts}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={Styles.membersList}
          showsVerticalScrollIndicator={false}
        />
      </View>
  
      <View style={Styles.inputWrapper}>
        <TextInput
          style={Styles.textBox}
          placeholder="Enter friend's email"
          onChangeText={(text) => setFriend(text)}
          value={friend}
        />
  
        <Pressable style={Styles.fixedButton} onPress={navigateGroupMessages}>
          <Text style={Styles.fixedButtonText}>Send a Message to the Group</Text>
        </Pressable>
  
        <Pressable style={Styles.addButton} onPress={submitAdd}>
          <Text style={Styles.addButtonText}>Add Member</Text>
        </Pressable>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "lightgreen",
    padding: 10,
  },
  groupInfoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    width: "100%",
    alignItems: "center",
  },
  groupName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "darkgreen",
    marginBottom: 5,
  },
  groupTimestamp: {
    fontSize: 16,
    color: "gray",
  },
  listWrapper: {
    flex: 1,
    marginBottom: 167, // Space above the buttons
  },
  membersList: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  memberContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    elevation: 1,
  },
  memberEmail: {
    fontSize: 16,
    color: "darkblue",
    fontWeight: "bold",
  },
  memberName: {
    fontSize: 14,
    color: "gray",
  },
  inputWrapper: {
    position: "absolute",
    bottom: 10,
    left: "5%",
    right: "5%",
    justifyContent: "center",
  },
  textBox: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  fixedButton: {
    backgroundColor: "darkblue",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  fixedButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "darkgreen",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
