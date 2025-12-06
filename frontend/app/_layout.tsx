import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore() as {
    checkAuth: () => void;
    user: string | null;
    token: string | null;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const isSignedIn = true;

  // useEffect(() => {
  //   const authScreen = segments[0] === "(auth)";
  //   isSignedIn = user && token;
  // }, [user, token, segments]);

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
