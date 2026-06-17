import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAppStore } from "../src/store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loadUserData = useAppStore((s: any) => s.loadUserData);

  const [fontsLoaded] = useFonts({
    "Mplus1p-Regular": require("../assets/fonts/MPLUS1p-Regular.ttf"),
    "Mplus1p-Bold": require("../assets/fonts/MPLUS1p-Bold.ttf"),
    CherryBombOne: require("../assets/fonts/CherryBombOne-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      loadUserData();
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="goal-setting"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </>
  );
}
