import AppHeader from "@/components/Header";
import {Stack} from "expo-router";
import {GoogleFitProvider} from "@/app/context/GoogleFitContext";

export default function RootLayout() {
    return (
        <GoogleFitProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: true, header: () => <AppHeader/>}}/>
            </Stack>
        </GoogleFitProvider>
    );
}
