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
        tabBarActiveTintColor: Colors.primary, // ✅ Pink for active tab
        tabBarInactiveTintColor: '#000', // Gray for inactive tabs
        tabBarShowLabel: false, // ✅ Hides the text labels
        //tabBarActiveBackgroundColor:Colors.primary,
        headerShown: false,

        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          backgroundColor: '#ABAEABaa',
          borderTopLeftRadius: 200, // Rounded top left
          borderTopRightRadius: 200,
          borderBottomLeftRadius: 200, // Rounded top left
          borderBottomRightRadius: 200, // Rounded top right
          height: 50,
          shadowColor: '#444444',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          evation: 5,
          marginBottom: 10,
        },
        tabBarBackground: () => (
          <BlurView intensity={50} tint="dark" style={{}} />
        ),
      }}
    >
      {/* ✅ Home Tab with Icon */}
      <Tabs.Screen

        name="events"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="ticket" size={size} color={color} />
          ),

        }}
      />

      <Tabs.Screen
        name="ranking"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="trophy" size={size} color={color} />
          ),

        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="hand-o-right" size={size} color={color} />
          ),

        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comment-o" size={size} color={color} />
          ),

        }}
      />

      {/* ✅ Profile Tab with Icon */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),

        }}
      />

    </Tabs>
  );
}
