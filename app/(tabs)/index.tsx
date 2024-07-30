import CreateNewPlan from "../CreateNewPlan";
import { router } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
// import { PlanAPI } from "@/serverAPI/PlanAPI";
// import { Gender } from "../types/userFitness";

export default function HomePage() {
  // EXAMPLE for how to use api

  //   useEffect(() => {
  //     const generatePlan = async () => {
  //       const plan = await PlanAPI.generatePlan({
  //         age: 24,
  //         gender: Gender.male,
  //         height: 180,
  //         weight: 70,
  //       });

  //       // handle plan result
  //       generatePlan();
  //     };
  //   }, []);

  return (
    <View style={styles.container}>
      <CreateNewPlan />
    </View>
  );
}

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