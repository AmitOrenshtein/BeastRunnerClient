import AppHeader from "@/components/Header";
import {Stack} from "expo-router";
import {GoogleFitProvider} from "@/app/context/GoogleFitContext";
import {AccessTokenAndUserIdProvider} from "@/app/context/IdentifiersContext";

export default function RootLayout() {
    return (
        <GoogleFitProvider>
            <AccessTokenAndUserIdProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: true, header: () => <AppHeader/>}}/>
                </Stack>
            </AccessTokenAndUserIdProvider>
        </GoogleFitProvider>
    );
}
