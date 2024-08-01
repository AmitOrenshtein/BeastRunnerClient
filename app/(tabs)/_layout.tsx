import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import appTheme from '../../appTheme'

export default function TabsLayout() {
    return (
        <Tabs>      
            <Tabs.Screen
                name="MyTrainings"
                options={{
                    headerShown: false,
                    title: 'My trainings',
                    tabBarIcon: () => <Feather name='list' size={24} color={appTheme.colors.themeColor} />
                }}
            />      
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: () => <Ionicons name="home-outline" size={24} color={appTheme.colors.themeColor} />
                }}
            />      
            <Tabs.Screen
                name="PersonalInfo"
                options={{
                    headerShown: false,
                    title: 'Personal Info',
                    tabBarIcon: () => <AntDesign name='edit' size={24} color={appTheme.colors.themeColor} />
                }}
            />
            
            <Tabs.Screen
                name="MyTrainingPlan"
                options={{
                    headerShown: false,
                    title: 'My training plan',
                    href: null,
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
    )
}