import { Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

const AuthAwareLayout = () => {
  const { user, loading } = useAuth();

  if (loading) 
    return null;

  return (
    <Stack screenOptions={{
      headerShown: false, 
    }}>
      {user ? (
        <>
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="bg-movies" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="movies/[id]" 
            options={{ headerShown: false }} 
          />
        </>
      ) : (
          <Stack.Screen 
            name="(auth)" 
            options={{ headerShown: false }} 
          />
      )}
    </Stack>
  )
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <StatusBar hidden />
      <AuthAwareLayout />
    </AuthProvider>
  )
}

export default RootLayout