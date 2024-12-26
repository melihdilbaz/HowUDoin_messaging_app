import {Text, View, StyleSheet, TextInput, Alert, Pressable,} from "react-native";
import {useState} from "react";
import {Link, router, useRouter} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
// downloaded as extra 

export default function Index() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  function submitRegister() {
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
          {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
          }
      ),
  }

  fetch("http://10.51.98.118:8080/auth/register",requestOptions)
      .then((response) => response.text())
      .then((result) => Alert.alert("Your register is done"))
      .catch((error) => console.error(error));
  }

  async function submitLogin() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    try {
      const response = await fetch("http://10.51.98.118:8080/auth/login", requestOptions);

      if (response.ok) {
        const data = await response.json();
        const { token, email: userEmail } = data;

        // Save the token securely
        // inside the local os
        await AsyncStorage.setItem("authToken", token);
        // console.error(token+"heree");
        router.push("/friends/List");
      } else {
        const errorMessage = await response.text();
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred", "Please try again later.");
    }
  }

  function testMethod()
  {
    console.log("sbuttton")
    router.push("../friends/List")
  }

  return (
    <View style={Styles.outerContainer}>
      {/* Login Form */}
      <View style={Styles.container}>
        <Text style={Styles.title}>Login</Text>
        <TextInput
          style={Styles.textInput}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={Styles.textInput}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <Pressable style={Styles.primaryButton} onPress={submitLogin}>
          <Text style={Styles.buttonText}>Login</Text>
        </Pressable>
      </View>

      {/* Register Form */}
      <View style={Styles.container}>
        <Text style={Styles.title}>Register</Text>
        <TextInput
          style={Styles.textInput}
          placeholder="First Name"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          style={Styles.textInput}
          placeholder="Last Name"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
        <TextInput
          style={Styles.textInput}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={Styles.textInput}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <Pressable style={Styles.secondaryButton} onPress={submitRegister}>
          <Text style={Styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "lightgreen",
    padding: 20,
  },
  container: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkgreen",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  primaryButton: {
    backgroundColor: "darkblue",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "darkgreen",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});