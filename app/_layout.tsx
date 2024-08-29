import AppHeader from "@/components/Header";
import {Stack} from "expo-router";
import {GoogleFitProvider} from "@/app/context/GoogleFitContext";
import {AccessTokenAndUserIdProvider} from "@/app/context/IdentifiersContext";
import { LogBox } from 'react-native';

export default function RootLayout() {

    LogBox.ignoreLogs([
        'TextElement: Support for defaultProps will be removed from function components in a future major release.',
        'Header: Support for defaultProps will be removed from function components in a future major release.',
        'DatePicker: Support for defaultProps will be removed from function components in a future major release.',
    ]);

    return (
        <AccessTokenAndUserIdProvider>
            <GoogleFitProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: true, header: () => <AppHeader/>}}/>
                </Stack>
            </GoogleFitProvider>
        </AccessTokenAndUserIdProvider>

    );
}
