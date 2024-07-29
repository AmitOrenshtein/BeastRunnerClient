import { router } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function HomePage() {
    return (
        <View style={styles.container}>
            <Text>This is the home page!</Text>
            <WorkoutBtn/>
        </View>
    );
};

function WorkoutBtn() {    

    function onClick() {
        router.replace('/Workout');
    }

    return (
            <TouchableOpacity style={styles.workoutBtn} onPress={onClick}>
                <Text>Workout</Text>
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    workoutBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 20,
        left: 20,
        height: 60,
        width: 60,
        backgroundColor: 'grey',
        borderRadius: 100
    }
  });