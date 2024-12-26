import {useEffect, useState} from "react";
import { Alert, View, Text, TextInput, StyleSheet, Pressable, FlatList } from "react-native";
import {Link, router, useRouter} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ListScreen() {
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState("");

    function navigateRequest() {
        router.push({
            pathname: "/friends/request",
            params: { friend },
        });
    }
    
    function navigateGroupList() {
        router.push("/groups/List");
    }

    useEffect(() => {
        async function fetchFriends() {
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
            fetch("http://10.51.98.118:8080/friends/",requestOptions)
                .then((response) => response.json())
                .then((json) => setFriends(json))
                .catch((error) => console.error(error));   
        }
        fetchFriends(); 
    }, [friends]); // Empty dependency array ensures this runs once

    const renderFriend = ({ item }: { item: string }) => (
        <View style={Styles.friendContainer}>
          <Text style={Styles.friendText}>Friend's email: {item}</Text>
        </View>
    );

    return (
        <View style={Styles.outerContainer}>
          <View style={Styles.titleContainer}>
            <Text style={Styles.title}>Your Friend List</Text>
          </View>
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={Styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <View style={Styles.inputContainer}>
            <TextInput
              style={Styles.textBoxes}
              placeholder="Search a friend by an email"
              onChangeText={(text) => setFriend(text)}
              value={friend}
            />
            <Pressable style={Styles.searchButton} onPress={navigateRequest}>
              <Text style={Styles.buttonText}>Search</Text>
            </Pressable>
          </View>
          <Pressable style={Styles.groupButton} onPress={navigateGroupList}>
            <Text style={Styles.buttonText}>Your Groups</Text>
          </Pressable>
        </View>
      );
    }
    
    const Styles = StyleSheet.create({
      outerContainer: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        padding: 10,
      },
      titleContainer: {
        marginBottom: 20,
        alignItems: "center",
        backgroundColor: "#264653",
        padding: 20,
        borderRadius: 10,
      },
      title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
      },
      listContent: {
        paddingBottom: 20,
      },
      friendContainer: {
        backgroundColor: "#ffffff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
      },
      friendText: {
        fontSize: 16,
        color: "#333",
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      },
      textBoxes: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
      },
      searchButton: {
        backgroundColor: "#264653",
        padding: 10,
        borderRadius: 10,
        marginLeft: 10,
        alignItems: "center",
        justifyContent: "center",
      },
      groupButton: {
        backgroundColor: "#264653",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
      },
      buttonText: {
        color: "#fff",
        fontWeight: "bold",
      },
    });