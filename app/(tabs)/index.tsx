import HomePageCard from "@/components/HomePage/HomeScreenCard";
import { router } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
// import { PlanAPI } from "@/serverAPI/PlanAPI";
// import { Gender } from "../types/userFitness";

export default function HomePage() {
  const userName = 'User';

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
      <View style={{padding: 10}}>
        <Text style={[styles.homeText, {fontWeight: "bold", fontSize:25}]}>Hi {userName}!</Text>
        <Text style={[styles.homeText, {fontSize:18}]}>How can I help you today?</Text>
      </View>
      <HomePageCard 
          imageSrc={require('@/assets/calander.png')}
          title="Watch your trainning schedule!" 
          content="The trainings you did, your future trainings and more!"
          link="/MyTrainingPlan" />
      <HomePageCard 
          imageSrc={require('@/assets/statsGraph.png')} 
          title="Watch your progress and stats!"
          content="See your great improvement and more!"
          link="/ProgressAndStats" />

          
      {/* temporary! just to test the workout page. */}
      <WorkoutBtn/>
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
      margin: 20
    },
    homeText: {
      color: "#2f93ab"
    },

    workoutBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 30,
        width: 60,
        backgroundColor: 'grey',
        borderRadius: 100
    }
  });