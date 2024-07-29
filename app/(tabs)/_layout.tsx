import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import appTheme from '../../appTheme'

export default function TabsLayout() {
    return (
        <Tabs>      
            <Tabs.Screen
                name="MyTraining"
                options={{
                    headerShown: false,
                    title: 'My Trainings',
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
                name="Workout"
                options={{
                    headerShown: false,
                    title: 'Workout',
                    href: null,
                }}
            />
        </Tabs>
    )
}