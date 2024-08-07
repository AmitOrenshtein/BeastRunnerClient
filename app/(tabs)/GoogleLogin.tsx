import {Text, View, StyleSheet, Button} from "react-native";
import {GoogleSignin, GoogleSigninButton, statusCodes, User} from "@react-native-google-signin/google-signin";
import {useEffect, useState} from "react";
import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useGoogleFit} from "@/app/context/GoogleFitContext";
import googleFit from "react-native-google-fit";

export default function GoogleLogin() {
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
            // @ts-ignore // androidClientId must annotate with ts-ignore!!!
            androidClientId: "your_androidClientId",//todo: put in env file,
            webClientId: 'your_webClientId', //todo: put in env file,
            iosClientId: "your_iosClientId",//todo: put in env file,
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
        if (idToken) {
            setIdToken(idToken);
            await fetchGoogleFitData();
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
            console.log("usere info: ",userInfo);
            setIdToken(userInfo.idToken ? userInfo.idToken : undefined);
            if (userInfo.idToken) {
                console.log("save new idToken in storage...");
                await AsyncStorage.setItem('idToken', userInfo.idToken);
                getTokensFromServer(userInfo.idToken);
                await configureGoogleFit();
                await fetchGoogleFitData();
            }
        } catch (error) {
            console.log(JSON.stringify(error));
            console.log("error");
        }
    };

    const getTokensFromServer =  (idToken: string) => {
        console.log("getting access & refresh tokens from server...")
        // try {
        //     const response = await fetch('YOUR_SERVER_URL/token', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ idToken }),
        //     });
        //     const { accessToken, refreshToken } = await response.json();
        //     await AsyncStorage.setItem('accessToken', accessToken);
        //     await AsyncStorage.setItem('refreshToken', refreshToken);
        // } catch (error) {
        //     console.log("Error getting tokens from server: ", error);
        //     setError("Error getting tokens from server: " + error);
        // }
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
            // setError("Google Fit data fetch error: " + error);
        }
    };

    const logout = () => {
        setIdToken(undefined);
        //Todo: remove all 3 tokens (id, refresh, access) and call logout from server
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
    }

    return (
        <View style={styles.container}>
            <Text>Google Login screen</Text>
            {idToken && <Text>{JSON.stringify(idToken)}</Text>}
            {idToken ? (
                <Button title="Logout" onPress={logout}/>
            ) : (
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

