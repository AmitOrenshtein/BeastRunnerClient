import React, { FC, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Stepper from "react-native-stepper-ui";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import UserLevel from "./UserLevel";
import UserGoal from "./UserGoal";
import { UserFitnessData, UserPreferences } from "../types/user";
import PlanDates from "./PlanDates";
import { router } from "expo-router";
import {useGoogleFit} from "@/app/context/GoogleFitContext";
import UserData from "./UserData";
import StartPage from "./startPageNewPlan";
import appTheme from '../../appTheme';

enum Attributes {
  gender = "gender",
  age = "age",
  userRunningLevel = "userRunningLevel",
  userRunningGoal = "userRunningGoal",
  startDate = "startDate",
  endDate = "endDate",
}

const CreateNewPlan: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatePlanloading, setGeneratePlanloading] =
    useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>();
  const [googleFitData, setGoogleFitData] = useState<UserFitnessData>({
    height: 0,
    weight: 0,})
  const {
    getWeightSummary,
    getHeightSummary,
} = useGoogleFit();

const fetchGoogleFitData = async () => {
  try {
    const startTime = Date.now() - 90 * 24 * 60 * 60 * 1000; // Last 90 days
    const endTime = Date.now();
      getHeightSummary(startTime, endTime).then(res => setGoogleFitData(data => ({...data, height: res[0].height})));
      getWeightSummary(startTime, endTime).then(res => setGoogleFitData(data => ({...data, weight: res[0].weight}))); 
  } catch (error) {
    console.log("Google Fit data fetch error: ", error);
  }
};
  const generatePlan = async () => {
    setGeneratePlanloading(true);

    try {
      await fetchGoogleFitData()
      const plan = await PlanAPI.generatePlan({
        userPreferences: userPreferences,
        userFitnessData: googleFitData,
      });
      console.log(plan);
      if (userPreferences) {
        const response = PlanAPI.setUserData(userPreferences);
        if(!response) {
          console.log('error - can not save user data')
        }
      }
      setGeneratePlanloading(false);
      router.replace("/MyTrainingPlan");
    } catch (error) {
      console.error(error);
      setGeneratePlanloading(false);
    }
  };

  const handleChangePreferences =
    (attributeName: Attributes) => (checkedValue: string) => {
      console.log(checkedValue);
      setUserPreferences((prev) => {
        return {
          ...prev,
          [attributeName]: checkedValue,
        };
      });
    };

  const content = [
    <StartPage />,
    <UserData
      gender={userPreferences?.gender || null}
      age={userPreferences?.age || ''}
      dispatchUserGender={handleChangePreferences(Attributes.gender)}
      dispatchUserAge={handleChangePreferences(Attributes.age)}
    />,
    <UserLevel
      userLevel={userPreferences?.userRunningLevel || ""}
      dispatchUserLevel={handleChangePreferences(Attributes.userRunningLevel)}
    />,
    <UserGoal
      userGoal={userPreferences?.userRunningLevel || ""}
      dispatchUserGoal={handleChangePreferences(Attributes.userRunningGoal)}
    />,
    <PlanDates
      label="Start Date"
      dispatchDate={handleChangePreferences(Attributes.startDate)}
    />,
    <PlanDates
      label="End Date"
      dispatchDate={handleChangePreferences(Attributes.endDate)}
    />,
  ];

  return (
    <View style={styles.container}>
      {generatePlanloading ? (
        <ActivityIndicator size="large" color={appTheme.colors.themeColor} />
      ) : (
        <Stepper
          stepStyle={{backgroundColor: appTheme.colors.themeColor}}
          buttonStyle={{backgroundColor: appTheme.colors.themeColor, position:"static", margin: 40}}
          active={activeStep}
          content={content}
          onBack={() => setActiveStep((p) => p - 1)}
          onFinish={() => generatePlan()}
          onNext={() => setActiveStep((p) => p + 1)}
        />
      )}
    </View>
  );
};

export default CreateNewPlan;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
});
