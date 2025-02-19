import React, { useState } from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import ProfileScreen from '@/app/(tabs)/profile';
import SwipeScreen from '@/app/(tabs)/index';
import BookmarkScreen from '@/app/(tabs)/bookmark';
import MessagesScreen from '@/app/(tabs)/message';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomNavigation } from 'react-native-paper';
import { IconSymbol } from '@/components/ui/IconSymbol';



export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'].tint;

  const [index, setIndex] = useState(0);

  const routes = [
    {
      key: 'profile',
      //title: 'Profile',
      focusedIcon: ({ color, size }) => <IconSymbol name="person.fill" color={color} size={size} />,
    },
    {
      key: 'swipe',
      //title: 'Swipe',
      focusedIcon: ({ color, size }) => <IconSymbol name="heart.fill" color={color} size={size} />,
    },
    {
      key: 'bookmark',
      //title: 'Bookmark',
      focusedIcon: ({ color, size }) => <IconSymbol name="bookmark.fill" color={color} size={size} />,
    },
    {
      key: 'messages',
      //title: 'Messages',
      focusedIcon: ({ color, size }) => <IconSymbol name="bubble.left.and.bubble.right.fill" color={color} size={size} />,
    },
  ];

  const renderScene = BottomNavigation.SceneMap({
    profile: ProfileScreen,
    swipe: SwipeScreen,
    bookmark: BookmarkScreen,
    messages: MessagesScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
