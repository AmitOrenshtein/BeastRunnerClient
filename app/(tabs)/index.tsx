import { Text, View, StyleSheet } from "react-native";
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
      <Text>This is the home page!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
