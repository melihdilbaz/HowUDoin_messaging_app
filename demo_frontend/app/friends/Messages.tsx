import {useEffect, useState} from "react";
import { Alert, View, Text, TextInput, StyleSheet, Pressable, FlatList } from "react-native";
import {Link, router, useLocalSearchParams, useRouter} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";


export default function MessagesScreen() {
    interface Message {
        senderEmail: string;
        timestamp: string;
        content: string;
      }
      
    const [messages, setMessages] = useState<Message[]>([]);    
    const [message, setMessage] = useState("");

    const params = useLocalSearchParams();
    const { friend } = params;


    async function fetchMessages() {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            Alert.alert("Error", "User is not authenticated");
            return;
        }

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(`http://10.51.98.118:8080/messages/?friend=${friend}`, requestOptions);
            const json = await response.json();
            setMessages(json);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch messages.");
        }
    }

    useEffect(() => {
        if (!friend) {
            Alert.alert("Error", "Friend parameter is missing.");
            return;
        }
        fetchMessages(); // Fetch messages initially
    }, [params.friend]);


    async function submitMessage() {
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
            body: JSON.stringify(
                {
                    content: message,
                }
            ),
        }
        try {
            const response = await fetch(`http://10.51.98.118:8080/messages/send?rEmail=${friend}`, requestOptions);
            const result = await response.text();
            Alert.alert("Message Sent", result);

            // Add the new message locally and refresh from backend for accuracy
            fetchMessages(); // Refresh from backend
            setMessage(""); // Clear the input field
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to send message.");
        }
    }

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={Styles.messageContainer}>
            <Text style={Styles.senderEmail}>{item.senderEmail}</Text>
            <Text style={Styles.messageContent}>{item.content}</Text>
            <Text style={Styles.timestamp}>{item.timestamp}</Text>
        </View>
    );

    return (
        <View style={Styles.outerContainer}>
            <View style={Styles.titleContainer}>
                <Text style={Styles.title}>Chat</Text>
            </View>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={Styles.messageList}
            />
            <View style={Styles.inputContainer}>
                <TextInput
                    style={Styles.textInput}
                    placeholder="Type a message..."
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                />
                <Pressable style={Styles.sendButton} onPress={submitMessage}>
                    <Text style={Styles.sendButtonText}>Send</Text>
                </Pressable>
            </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: "lightgreen",
    },
    titleContainer: {
        backgroundColor: "grey",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    messageList: {
        flexGrow: 1,
        padding: 10,
    },
    messageContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    senderEmail: {
        fontSize: 12,
        fontWeight: "bold",
        color: "blue",
    },
    messageContent: {
        fontSize: 14,
        marginVertical: 5,
    },
    timestamp: {
        fontSize: 10,
        color: "grey",
        textAlign: "right",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderColor: "lightgrey",
    },
    textInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: "white",
    },
    sendButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});