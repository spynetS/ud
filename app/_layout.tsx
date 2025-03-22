import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import {Typography, Colors, Text} from 'react-native-ui-lib';


import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  Colors.loadColors({
    primary: '#FF69B4',
    gold: '#FFD700',
  });



  const [loaded] = useFonts({
    CustomFont: require('../assets/fonts/KOMIKAX_.ttf'),
  });

  Typography.loadTypographies({
    heading: { fontFamily: 'CustomFont', fontSize: 24 },
    body: { fontFamily: 'CustomFont', fontSize: 16 },
    text90: { fontFamily: 'CustomFont', fontSize: 16 },
    text: { fontFamily: 'CustomFont', fontSize: 16 },
    text40: { fontFamily: 'CustomFont', fontSize: 16 },

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
      <StatusBar hidden={false} style="light" />
      <Stack >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
