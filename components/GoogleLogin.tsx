import {Image, StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper"
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {useEffect} from "react";
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

export default function GoogleLogin() {
    const {setUserId, setAccessToken} = useAccessTokenAndUserId();
    const {configureGoogleFit} = useGoogleFit();

    const configureGoogleSignIn = () => {
        GoogleSignin.configure({
            scopes: [
                'https://www.googleapis.com/auth/fitness.activity.read',
                'https://www.googleapis.com/auth/fitness.body.read',
                'https://www.googleapis.com/auth/fitness.location.read',
                'https://www.googleapis.com/auth/fitness.reproductive_health.read',
                'https://www.googleapis.com/auth/fitness.heart_rate.read'
            ],
            // @ts-ignore
            androidClientId: "your_androidClientId",//todo: get from env file,
            webClientId: 'your_webClientId', //todo: get from env file,
            iosClientId: "your_iosClientId",//todo: get from env file,
        });
    }


    useEffect(() => {
        configureGoogleSignIn();
    }, []);


    const signIn = async () => {
        console.log("Pressed sign-in button");

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log("user info: ", userInfo);
            if (userInfo.idToken) {
                const res = await googleSignin(userInfo.idToken);
                console.log("save new idToken in storage...");
                await saveIdTokenInAsyncStorage(userInfo.idToken);
                console.log("id token: ", userInfo.idToken);
                await saveAccessTokenInAsyncStorage(res.accessToken!);//todo: if undefine?
                setAccessToken(res.accessToken!);
                await saveRefreshTokenInAsyncStorage(res.refreshToken!);//todo: if undefine?
                await (res._id! && saveUserIdInAsyncStorage(res._id!));//todo: if undefine?
                setUserId(res._id!);
                console.log("response:", res);
                await configureGoogleFit();
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

