import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayaout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}