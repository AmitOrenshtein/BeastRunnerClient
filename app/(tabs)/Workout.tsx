import Theme from "@/appTheme";
import MeasureValue from "@/components/Workout/MeasureValue";
import useRealTimeSpeed from "@/hooks/RealTimeSpeed";
import useWorkoutTimer from "@/hooks/WorkoutTimer";
import { Text, View, StyleSheet } from "react-native";

export default function HomePage() {
  
    const speed = useRealTimeSpeed();
    const timer = useWorkoutTimer();

    return (
        <View style={styles.container}>
            <View style={{flex: 1, alignItems:"center"}}>
                <Text style={styles.title}>Workout</Text>
            </View>
            <View style={{flex: 2}}>
                <View style={{flex:1, flexDirection:'row'}}>
                    <MeasureValue flex={1} text="km/h" value={speed}/>
                    <MeasureValue flex={1} text="Duration" value={timer}/>
                </View>
            </View>
            <MeasureValue flex={3} text="Distance" value={0} fontSize={35} />
            <View style={{flex: 1}}>
                <View style={styles.messageBox}>
                    <Text style={{color: Theme.colors.white}}>Good start! Keep going!</Text>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00506c',
    },
    center: {
        justifyContent:"center",
        alignItems:"center"
    },
    title: {
        fontSize:Theme.fontSizes.xLarge,
        padding:10,
        color: Theme.colors.white
    },
    messageBox: {
        flex:1,
        backgroundColor: '#3b3838',
        borderRadius:10,
        margin:15,
        padding:15,
        justifyContent:"center"
    }
  });