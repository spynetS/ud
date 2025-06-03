import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import {Typography, Colors, Text} from 'react-native-ui-lib';


import { useColorScheme } from '@/hooks/useColorScheme';
import { getProfile } from '@/components/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function darkenHexColor(hex, amount = 0.2) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.max(Math.floor(r * (1 - amount)), 0);
  g = Math.max(Math.floor(g * (1 - amount)), 0);
  b = Math.max(Math.floor(b * (1 - amount)), 0);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

async function loadColorsFromStorage() {
  const primary = await AsyncStorage.getItem('primary_color') || '#ff0000';
  const dark = darkenHexColor(primary);

  Colors.loadColors({
    primary,
    dark_primary: dark,
    gold: '#FFD700',
  });
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadColorsFromStorage();
  }, []);

  const [loaded] = useFonts({
    CustomFont: require('../assets/fonts/Manrope-VariableFont_wght.ttf'),
  });

  Typography.loadTypographies({
    heading: { fontFamily: 'CustomFont', fontSize: 44,  fontWeight: 'bold' },
    heading2: { fontFamily: 'CustomFont', fontSize: 24,fontWeight: 'bold'  },
               body: { fontFamily: 'CustomFont', fontSize: 16 },
               text90: { fontFamily: 'CustomFont', fontSize: 16 },
               text: { fontFamily: 'CustomFont', fontSize: 12 },
               text40: { fontFamily: 'CustomFont', fontSize: 10 },

               default: { fontFamily: 'CustomFont', fontSize: 16 },
  });

  Text.defaultProps = {
    style: { fontFamily: 'CustomFont' }
  };


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar hidden={false} style="dark" />
      <Stack >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="messageUser" options={{ headerShown: false }} />
        <Stack.Screen name="CreateEvent" options={{ headerShown: false }} />
        <Stack.Screen name="SeeEvent" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
