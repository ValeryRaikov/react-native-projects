import { Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { SavedMoviesProvider } from "@/context/SavedMoviesContext";

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
      <SavedMoviesProvider>
        <StatusBar hidden />
        <AuthAwareLayout />
      </SavedMoviesProvider>
    </AuthProvider>
  )
}

export default RootLayout