import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { useColorScheme } from '@/hooks/useColorScheme';

import { PaperProvider, MD3DarkTheme,MD3LightTheme, configureFonts } from 'react-native-paper';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({
    config: {
      bodyLarge: { fontFamily: 'Inter_400Regular', fontSize: 16 },
      titleLarge: { fontFamily: 'Inter_700Bold', fontSize: 22 },
      labelMedium: { fontFamily: 'Inter_500Medium', fontSize: 14 },
    },
  }),
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC', // Adjust primary color for dark mode
    background: '#121212', // Pure black background
    surface: '#1E1E1E', // Darker surface color
    text: '#FFFFFF', // White text
  },
  fonts: lightTheme.fonts, // Use the same fonts in both themes
};


export default function RootLayout() {
  /* const colorScheme = useColorScheme();
   * const [loaded] = useFonts({
   *   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
   * });

   * useEffect(() => {
   *   if (loaded) {
   *     SplashScreen.hideAsync();
   *   }
   * }, [loaded]);

   * if (!loaded) {
   *   return null;
   * }
   */
  return (
    <PaperProvider theme={lightTheme} >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
