import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import { FontAwesome } from '@expo/vector-icons'; // ✅ Import icons from Expo

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF69B4', // ✅ Pink for active tab
        tabBarInactiveTintColor: '#888', // Gray for inactive tabs
        tabBarShowLabel: false, // ✅ Hides the text labels
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          backgroundColor: 'white',
          borderTopLeftRadius: 500, // Rounded top left
          borderTopRightRadius: 500, // Rounded top right
          height: 60,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        },
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
        name="login"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
