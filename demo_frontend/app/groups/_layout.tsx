import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function GroupsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="List" // Use only the file name
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Create"
        options={{
          title: "Create Group",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />
    </Tabs>
  );
}
