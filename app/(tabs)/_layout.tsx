import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>      
            <Tabs.Screen
                name="MyTrainingPlan"
                options={{
                    headerShown: false,
                    title: 'My training plan'
                }}
            />      
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home'
                }}
            />      
            <Tabs.Screen
                name="PersonalInfo"
                options={{
                    headerShown: false,
                    title: 'Personal Info'
                }}
            />
        </Tabs>
    )
}