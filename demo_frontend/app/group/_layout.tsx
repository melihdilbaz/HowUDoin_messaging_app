import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function GroupLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Details"
        options={{
          title: "Group Details",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="info" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Messages"
        options={{
          title: "Group Messages",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="envelope" color={color} />,
        }}
      />
    </Tabs>
  );
}
