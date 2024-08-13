import {Image, StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper"
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import Theme from "@/appTheme";
import {
    clearAllDataFromAsyncStorage,
    saveAccessTokenInAsyncStorage,
    saveIdTokenInAsyncStorage,
    saveRefreshTokenInAsyncStorage,
    saveUserIdInAsyncStorage
} from "@/app/utils/AsyncStorageUtil";
import {googleSignin} from "@/serverAPI/AuthAPI";
import {useAccessTokenAndUserId} from "@/app/context/IdentifiersContext";
import {useGoogleFit} from "@/app/context/GoogleFitContext";
import {requestActivityRecognitionPermission} from "@/app/utils/PermissionsUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GoogleLogin() {
    const {setUserId, setAccessToken} = useAccessTokenAndUserId();
    const {configureGoogleFit, setGoogleAccessToken} = useGoogleFit();


    const signIn = async () => {
        console.log("Pressed sign-in button");

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const tokensFromGoogle = await GoogleSignin.getTokens();
            console.log("user info: ", userInfo);
            console.log("googleAccessToken= " + tokensFromGoogle.accessToken);
            if (userInfo.idToken && tokensFromGoogle.accessToken) {
                const res = await googleSignin(userInfo.idToken);
                console.log("response:", res);
                await configureGoogleFit();
                const hasPermission = await requestActivityRecognitionPermission();
                if (!hasPermission) {
                    alert('Activity Recognition permission is required to track your workout sessions.');
                }
                console.log("save new idToken in storage...");
                await AsyncStorage.setItem('googleAccessToken', tokensFromGoogle.accessToken);//todo: util function
                await saveIdTokenInAsyncStorage(userInfo.idToken);
                await saveAccessTokenInAsyncStorage(res.accessToken!);//todo: if undefine?
                await saveRefreshTokenInAsyncStorage(res.refreshToken!);//todo: if undefine?
                await (res._id! && saveUserIdInAsyncStorage(res._id!));//todo: if undefine?
                console.log("id token: ", userInfo.idToken);
                setUserId(res._id!);
                setAccessToken(res.accessToken!);
                setGoogleAccessToken(tokensFromGoogle.accessToken);
            }
        } catch (error) {
            console.log("Failed to sign-in with google account...");
            console.log(JSON.stringify(error));
            GoogleSignin.revokeAccess();
            GoogleSignin.signOut();
            clearAllDataFromAsyncStorage();
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/runnerLogo.jpg')}
                style={styles.logo}
            />
            <Text style={styles.title}>Run your way to your goals!</Text>
            <Text style={styles.subtitle}>Welcome to Beast Runner!</Text>
            <Text style={styles.subtitle}>Already training with us?</Text>
            <Text style={styles.subtitle}>Log in or join now!</Text>

            <Button
                mode="contained"
                onPress={signIn}
                style={styles.signInButton}
                contentStyle={styles.signInButtonContent}
                labelStyle={styles.signInButtonText}>
                JOIN US OR SIGN IN
            </Button>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: Theme.colors.white,
        marginTop: -100,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 8,
    },
    title: {
        fontSize: 15,
        fontStyle: "italic",
        color: Theme.colors.themeColor,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    subtitle: {
        fontSize: 24,
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    signInButton: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        backgroundColor: Theme.colors.themeColor,
    },
    signInButtonContent: {
        height: 60,
        width: 300,
    },
    signInButtonText: {
        fontSize: 20,
    },
});

