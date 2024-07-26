import AppHeader from "@/components/Header";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: true, header: () => <AppHeader/>}} />
      </Stack>
    </>
  );
}
