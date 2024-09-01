import {Tabs} from "expo-router";
import {AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import appTheme from '../../appTheme'
import {useAccessTokenAndUserId} from "@/app/context/IdentifiersContext";
import GoogleLogin from "@/components/GoogleLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleFit from "react-native-google-fit";
import {useGoogleFit} from "@/app/context/GoogleFitContext";
import {useEffect} from "react";
import {GoogleSignin} from "@react-native-google-signin/google-signin";

export default function TabsLayout() {
    const {accessTokenState, userIdState} = useAccessTokenAndUserId();
    const {configureGoogleFit, googleAccessTokenState} = useGoogleFit();

    useEffect(() => {
        configureGoogleSignIn();
        checkIfUserIsSignedIn();
    }, []);
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

    const checkIfUserIsSignedIn = async (): Promise<boolean> => {
        try {
            const idToken = await AsyncStorage.getItem('idToken');
            if (idToken && accessTokenState && userIdState && googleAccessTokenState) {
                console.log("Already signin to google (have idToken && accessTokenState && userIdState)");
                await configureGoogleFit();
                if (GoogleFit.isAuthorized) {
                    console.log("GoogleFit.isAuthorized is true also :)")
                    return true;
                } else {
                    alert("you have idToken but you are not authorized to googlefit....")
                    return false;
                }

            }
            console.log("You are not signin to google... needs to sign in");
            console.log("Your idToken && accessTokenState && userIdState: idtoken= " + idToken + " accessToken= " + accessTokenState + " userId= " + userIdState);//todo: to remove
            console.log("Your googleAccessToken= " + googleAccessTokenState);//todo: to remove
            return false;
        } catch (err) {
            console.log("Failed to check if you are signin or not... error: ", err);
            return false;
        }
    };


    return (
        <>
            {!accessTokenState || !userIdState || !googleAccessTokenState ? (<GoogleLogin/>) : (
                <Tabs>
                    <Tabs.Screen
                        name="MyTrainingPlan"
                        options={{
                            headerShown: false,
                            title: 'My training plan',
                            tabBarIcon: () => <Feather name='list' size={24} color={appTheme.colors.themeColor}/>
                        }}
                    />
                    <Tabs.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            title: 'Home',
                            tabBarIcon: () => <Ionicons name="home-outline" size={24}
                                                        color={appTheme.colors.themeColor}/>
                        }}
                    />
                    <Tabs.Screen
                        name="PersonalInfo"
                        options={{
                            headerShown: false,
                            title: 'Personal Info',
                            tabBarIcon: () => <AntDesign name='edit' size={24} color={appTheme.colors.themeColor}/>
                        }}
                    />

                    <Tabs.Screen
                        name="Workout"
                        options={{
                            headerShown: false,
                            title: 'Workout',
                            href: null,
                        }}
                    />
                    <Tabs.Screen
                        name="ProgressAndStats"
                        options={{
                            headerShown: false,
                            title: 'Progress And Stats',
                            href: null,
                        }}
                    />
                </Tabs>
            )}
        </>
    )
}
