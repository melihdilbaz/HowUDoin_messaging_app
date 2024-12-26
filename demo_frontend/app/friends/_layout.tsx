
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function FriendLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="List" // use only the file name
        options={{
          title: "Friends",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Requests",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="envelope" color={color} />,
        }}
      />
    </Tabs>
  );
}
