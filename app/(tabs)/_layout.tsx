import {Tabs} from "expo-router";
import {Ionicons} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import appTheme from '../../appTheme'
import {useAccessTokenAndUserId} from "@/app/context/IdentifiersContext";
import GoogleLogin from "@/components/GoogleLogin";

export default function TabsLayout() {
    const {accessTokenState, userIdState} = useAccessTokenAndUserId();
    return (
        <>
            {!accessTokenState || !userIdState ? (<GoogleLogin/>) : (
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
                    <Tabs.Screen
                        name="GoogleFitData"
                        options={{
                            headerShown: false,
                            title: 'GoogleFit Data',
                            tabBarIcon: () => <AntDesign name='edit' size={24} color={appTheme.colors.themeColor}/>
                        }}
                    />
                </Tabs>
            )}
        </>
    )
}
