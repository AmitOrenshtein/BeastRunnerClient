import {Button, StyleSheet, Text, View} from "react-native";
import {GoogleSignin, GoogleSigninButton} from "@react-native-google-signin/google-signin";
import {useEffect, useState} from "react";
import GoogleFit, {Scopes} from 'react-native-google-fit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useGoogleFit} from "@/app/context/GoogleFitContext";
import {
    clearAllDataFromAsyncStorage,
    saveAccessTokenInAsyncStorage,
    saveIdTokenInAsyncStorage,
    saveRefreshTokenInAsyncStorage,
    saveUserIdInAsyncStorage
} from "@/app/utils/AsyncStorageUtil";
import {googleSignin, logoutFromServer} from "@/serverAPI/AuthAPI";
import {useAccessTokenAndUserId} from "@/app/context/IdentifiersContext";

export default function GoogleLogin() {
    const {accessTokenState,userIdState,setUserId, setAccessToken} = useAccessTokenAndUserId();
    const [idToken, setIdToken] = useState<string>();
    const {getAllDailyRunningSessions,
        getAllDailyWalkingSessions,
        getDailyDistance,
        getDailyMovementMinutes,
        getDailyStepsNumber,
        getCurrentWeight,
        getCurrentHeight, getAverageHeartRate} = useGoogleFit();

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

    const configureGoogleFit = async () => {

        const options = {
            scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_BODY_READ,
                Scopes.FITNESS_LOCATION_READ,
                Scopes.FITNESS_HEART_RATE_READ,
                Scopes.FITNESS_REPRODUCTIVE_HEALTH_READ
            ],
        };
        const result = await GoogleFit.authorize(options);
        if (result.success) {
            console.log("authorized successfully to google-fit");
        } else {
            console.log('Google Fit authorization failed');
        }
    };

    const checkIfUserIsSignedIn = async (): Promise<boolean> => {
        const idToken = await AsyncStorage.getItem('idToken');
        if (idToken && accessTokenState && userIdState) {
            setIdToken(idToken);
            await configureGoogleFit();
            if(GoogleFit.isAuthorized){
                await fetchGoogleFitData();
            } else {
                alert("you have idToken but you are not authorized to googlefit....")
            }

            return true;
        }
        return false;
    };

    useEffect(() => {
        const initialize = async () => {
            const isSignedIn = await checkIfUserIsSignedIn();
            if (!isSignedIn) {
                configureGoogleSignIn();
            }
        };

        initialize();
    }, []);


    const signIn = async () => {
        console.log("Pressed sign-in button");

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log("user info: ",userInfo);
            if (userInfo.idToken) {
                console.log("save new idToken in storage...");
                const res = await googleSignin(userInfo.idToken);
                await saveIdTokenInAsyncStorage(userInfo.idToken);
                console.log("access token: ", accessTokenState);
                console.log("id token: ", idToken);
                setIdToken(userInfo.idToken ? userInfo.idToken : undefined);
                await saveAccessTokenInAsyncStorage(res.accessToken!);//todo: if undefine?
                setAccessToken(res.accessToken!);
                await saveRefreshTokenInAsyncStorage(res.refreshToken!);//todo: if undefine?
                await (res._id! && saveUserIdInAsyncStorage(res._id!));//todo: if undefine?
                setUserId(res._id!);
                console.log("response:", res);
                await configureGoogleFit();
                await fetchGoogleFitData();
            }
        } catch (error) {
            console.log(JSON.stringify(error));
            console.log("Failed to sign-in with google account...");
        }
    };

    const fetchGoogleFitData = async () => {
        try {
            const startTime = '2023-01-01T00:00:17.971Z';
            const endTime = new Date().toISOString();
            // getCurrentHeight(startTime, endTime).then(res => setGoogleFitData(res.pop()?.value || 0));
            // getCurrentWeight(startTime, endTime).then(res => alert("weight: "+res));
            // getDailyDistance(startTime, endTime).then(res => console.log("distance: ",res));
            // getDailyStepsNumber(startTime, endTime).then(res => console.log("steps: ",res));
            // getDailyMovementMinutes(startTime, endTime).then(res => console.log("movement_minutes: ",res));
            // getAllDailyRunningSessions(startTime, endTime).then(res => console.log("running sessions: ",res));
            // getAllDailyWalkingSessions(startTime, endTime).then(res => console.log("walking sessions: ",res));
            // getAverageHeartRate(startTime, endTime).then(res => console.log("heart_rate: ",res));
            getCurrentHeight(startTime, endTime).then(res => console.log("height: ",res));
            getCurrentWeight(startTime, endTime).then(res => console.log("weight: ",res));
            getDailyDistance(startTime, endTime).then(res => console.log("distance: ",res));
            getDailyStepsNumber(startTime, endTime).then(res => console.log("steps: ",res));
            getDailyMovementMinutes(startTime, endTime).then(res => console.log("movement_minutes: ",res));
            getAllDailyRunningSessions(startTime, endTime).then(res => console.log("running sessions: ",res));
            getAllDailyWalkingSessions(startTime, endTime).then(res => console.log("walking sessions: ",res));
            getAverageHeartRate(startTime, endTime).then(res => console.log("heart_rate: ",res));
        } catch (error) {
            console.log("Google Fit data fetch error: ", error);
        }
    };


    return (
        <View style={styles.container}>
            <Text>Google Login screen</Text>
            {idToken && <Text>{JSON.stringify(idToken)}</Text>}
            {!idToken &&  (
                <GoogleSigninButton size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Dark}
                                    onPress={signIn}/>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

