// app/_layout.js
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import useToken from "../util/useToken";
import { FilterRecipeProvider } from "../util/filterHooks";

export default function RootLayout() {
  const { token, loading } = useToken();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAppGroup = segments[0] === "(app)";

    if (token && !inAppGroup) {
      // Logged in but not in app stack → send to tabs
      router.replace("/(app)/(tabs)");
    } else if (!token && inAppGroup) {
      // Not logged in but in app stack → send to login
      router.replace("/");
    }
  }, [token, loading, segments]);

  return (
    <FilterRecipeProvider>
      <Stack
        screenOptions={{
          tabBarActiveTintColor: "#000",
          headerStyle: {
            backgroundColor: "#FB9637",
          },
          headerShadowVisible: false,
          headerTintColor: "#000",
          tabBarStyle: {
            backgroundColor: "#FB9637",
          },
        }}
      >
        {/* public screens */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login-callback" options={{ headerShown: false }} />

        {/* protected group */}
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </FilterRecipeProvider>
  );
}
