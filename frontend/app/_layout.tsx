import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token, isCheckingAuth } = useAuthStore() as {
    checkAuth: () => void;
    user: any;
    token: string | null;
    isCheckingAuth: boolean;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const isSignedIn = !!(user && token);

  useEffect(() => {
    if (isCheckingAuth) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, segments, isCheckingAuth]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
