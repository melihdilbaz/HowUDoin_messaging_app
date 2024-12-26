import {useEffect, useState} from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import {Link, router, useRouter} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router/build/hooks";

/** BUTTON FOR MESSAGING SCREEN
 *  
 */
export default function RequestScreen() {
  const [requestId, setRequestId] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state


  const params = useLocalSearchParams();
  const { friend } = params; // Use params directly without setting state

  function navigateMessages() {
    router.push({
        pathname: "/friends/Messages",
        params: { friend },
    });
  }
  
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

    fetch("http://10.51.98.118:8080/friends/search?email="+friend,requestOptions)
        .then((response) => {
          if (!response.ok) {
            setRequestId("");
            setReceiverEmail("");
            setSenderEmail("");
            setStatus("");
            return response.text().then((errorMessage) => {
              throw new Error(errorMessage);
            });
          }
          // Parse the JSON if response is ok
          else return response.json();
        })
        .then((json) => {
          // Update state variables with values from the JSON response
          setRequestId(json.id);
          setSenderEmail(json.senderEmail);
          setReceiverEmail(json.receiverEmail);
          setStatus(json.status);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Error", error.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
  }

  useEffect(() => {
    fetchRequest();
  }, [params.friend]);

  async function submitSend() {
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
      const response = await fetch("http://10.51.98.118:8080/friends/add?email="+friend, requestOptions);
      const data = await response.text();
      Alert.alert("Update", data);
      fetchRequest();

    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred", "Please try again later.");
    }
  }

  async function submitAccept() {
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
      const response = await fetch("http://10.51.98.118:8080/friends/accept?id="+requestId, requestOptions);

      const data = await response.text();
      Alert.alert("Update", data);
      fetchRequest();

    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred", "Please try again later.");
    }
  }


  if (loading) {
    return (
      <View style={Styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={Styles.loadingText}>Loading...</Text>
      </View>
    );
  }

return (
  <View style={Styles.outerContainer}>
    <View style={Styles.infoContainer}>
      <Text style={Styles.infoText}>Request ID: {requestId}</Text>
      <Text style={Styles.infoText}>Sender Email: {senderEmail}</Text>
      <Text style={Styles.infoText}>Receiver Email: {receiverEmail}</Text>
      <Text style={Styles.infoText}>Status: {status}</Text>
    </View>
    <View style={Styles.buttonRow}>
      <Pressable style={[Styles.button, Styles.leftButton]} onPress={submitSend}>
        <Text style={Styles.buttonText}>Send Request</Text>
      </Pressable>
      <Pressable style={[Styles.button, Styles.leftButton]} onPress={submitAccept}>
        <Text style={Styles.buttonText}>Accept Request</Text>
      </Pressable>
    </View>
    <Pressable style={Styles.navigateButton} onPress={navigateMessages}>
      <Text style={Styles.buttonText}>Send a message to {friend}</Text>
    </Pressable>
  </View>
);
}

const Styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  infoContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  leftButton: {
    backgroundColor: "#264653", // Dark blue-green tone
  },
  rightButton: {
    backgroundColor: "#1D3557", // Dark navy blue
  },
  navigateButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#2A9D8F", // Teal blue tone
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
