import * as SecureStore from "expo-secure-store";
import { ClerkProvider, SignedIn, useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded)
      return;

    const inTabsGroup = segments[0] === "(auth)";
    
    if (isSignedIn && !inTabsGroup){
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [isSignedIn]);

  return <Slot />;
}

export default function RootLayoutNav() {
  return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <InitialLayout />
      </ClerkProvider>
  );
}
