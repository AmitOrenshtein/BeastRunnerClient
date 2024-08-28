import HomePageCard from "@/components/HomePage/HomeScreenCard";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CreateNewPlan from "../CreateNewPlan";
import appTheme from '../../appTheme';


export default function HomePage() {
  const userName = "User";

  const [isUserHasPlan, setIsUserHasPlan] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      PlanAPI.getPlan()
        .then((res) => {
          setIsUserHasPlan(res?.data?.plan?.length > 0);
          setIsPlanLoading(false);
        })
        .catch((e) => {
          setIsPlanLoading(false);
          setIsError(true);
          console.log(e);
        });
    }, [])
  );

  if (isError) {
    return (
      <Text style={[styles.homeText, { fontWeight: "bold", fontSize: 25 }]}>
        Error, Try again later :(
      </Text>
    );
  }

  if (isPlanLoading) {
    return <ActivityIndicator size="large" color={appTheme.colors.themeColor} />;
  }

  return isUserHasPlan ? (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <Text style={[styles.homeText, { fontWeight: "bold", fontSize: 25 }]}>
          Hi {userName}!
        </Text>
        <Text style={[styles.homeText, { fontSize: 18 }]}>
          How can I help you today?
        </Text>
      </View>
      <HomePageCard
        imageSrc={require("@/assets/calander.png")}
        title="Watch your trainning schedule!"
        content="The trainings you did, your future trainings and more!"
        link="/MyTrainingPlan"
      />
      <HomePageCard
        imageSrc={require("@/assets/statsGraph.png")}
        title="Watch your progress and stats!"
        content="See your great improvement and more!"
        link="/ProgressAndStats"
      />

      {/* temporary! just to test the workout page. */}
      <WorkoutBtn />
    </View>
  ) : (
    <CreateNewPlan />
  );
}

function WorkoutBtn() {
  function onClick() {
    router.replace("/Workout");
  }

  return (
    <TouchableOpacity style={styles.workoutBtn} onPress={onClick}>
      <Text>Workout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  homeText: {
    color: "#2f93ab",
  },

  workoutBtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 30,
    width: 60,
    backgroundColor: "grey",
    borderRadius: 100,
  },
});
