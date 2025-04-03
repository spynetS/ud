import { Tabs } from 'expo-router';
import { useColorScheme, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import { FontAwesome } from '@expo/vector-icons'; // ✅ Import icons from Expo
import { BlurView } from "expo-blur";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white", // ✅ Pink for active tab
        tabBarInactiveTintColor: '#000', // Gray for inactive tabs
        tabBarShowLabel: false, // ✅ Hides the text labels
        //tabBarActiveBackgroundColor:Colors.primary,
        headerShown: false,

        tabBarStyle: {

          position: 'absolute',
          bottom: 25,
          marginLeft: 25,
          marginRight: 25,
          backgroundColor: '#ABAEABea',
          borderTopLeftRadius: 200, // Rounded top left
          borderTopRightRadius: 200,
          borderBottomLeftRadius: 200, // Rounded top left
          borderBottomRightRadius: 200, // Rounded top right
          borderTopWidth: 0, // Removes the default top border
          marginBottom: 0,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            style={{
              backgroundColor: props.accessibilityState?.selected ? Colors.primary : "transparent",
              borderRadius: 20, // Fully rounded when selected
              alignItems: "center",
              justifyContent: "center",
              width: 50, // Adjust for circular shape
              height: 50, // Match width for circle
              marginBottom: 10, // Adjust spacing
            }}
          />
        ),
        tabBarBackground: () => (
          <BlurView intensity={100} tint="dark" style={{}} />
        ),
      }}
    >
      {/* ✅ Home Tab with Icon */}
      <Tabs.Screen

        name="events"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome name="ticket"  style={{ backgroundColor: focused ? Colors.primary : "#00000000", padding: 0, borderRadius:20}} size={size} color={color} />
          ),

        }}
      />

      <Tabs.Screen
        name="ranking"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome name="trophy"  style={{ backgroundColor: focused ? Colors.primary : "#00000000", padding: 0, borderRadius:20}} size={size} color={color} />
          ),

        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome name="hand-o-right" style={{ backgroundColor: focused ? Colors.primary : "#00000000", padding: 0, borderRadius:20}} size={size} color={color} />
          ),

        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome name="comment-o"  style={{ backgroundColor: focused ? Colors.primary : "#00000000", padding: 0, borderRadius:20}} size={size} color={color} />
          ),

        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome name="user"  style={{ backgroundColor: focused ? Colors.primary : "#00000000", padding: 0, borderRadius:20}} size={size} color={color} />
          ),

        }}
      />

    </Tabs>
  );
}
