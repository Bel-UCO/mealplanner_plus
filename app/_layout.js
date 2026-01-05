import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";

import { AuthProvider, useAuth } from "../util/useToken";
import { FilterRecipeProvider } from "../util/filterHooks";
import { FilterRecipeExploreProvider } from "../util/filterHooksExplore";
import { FilterRecipeSavedProvider } from "../util/filterHooksSaved";

function RootLayoutInner() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAppGroup = segments[0] === "(app)";

    if (token && !inAppGroup) {
      router.replace("/(app)/(tabs)");
    } else if (!token && inAppGroup) {
      router.replace("/");
    }
  }, [token, loading, segments]);

  return (
    <Stack
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerStyle: { backgroundColor: "#FB9637" },
        headerShadowVisible: false,
        headerTintColor: "#000",
        tabBarStyle: { backgroundColor: "#FB9637" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login-callback" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <FilterRecipeSavedProvider>
      <FilterRecipeExploreProvider>
        <FilterRecipeProvider>
          <AuthProvider>
            <RootLayoutInner />
          </AuthProvider>
        </FilterRecipeProvider>
      </FilterRecipeExploreProvider>
    </FilterRecipeSavedProvider>
  );
}
