import { Stack } from "expo-router";
import "../../global.css";
import AuthProvider from "../providers/AuthProvider";

export default function RootLayaout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
}