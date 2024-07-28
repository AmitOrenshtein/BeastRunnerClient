import React, { FC, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Stepper from "react-native-stepper-ui";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import UserLevel from "./UserLevel";
import UserGoal from "./UserGoal";
import { Gender, UserPreferences } from "../types/user";

enum Attributes {
  userRunningLevel = "userRunningLevel",
  userRunningGoal = "userRunningGoal",
}

const CreateNewPlan: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatePlanloading, setGeneratePlanloading] =
    useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>();

  const generatePlan = async () => {
    setGeneratePlanloading(true);

    try {
      const plan = await PlanAPI.generatePlan({
        userPreferences: userPreferences,
        //   userFitnessData: TODO: get data from google fit
      });
      console.log(plan);
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratePlanloading(false);
    }
  };

  const handleChangeRadioBtn =
    (attributeName: Attributes) => (checkedValue: string) => {
      setUserPreferences((prev) => {
        return {
          ...prev,
          [attributeName]: checkedValue,
        };
      });
    };

  const content = [
    <UserLevel
      userLevel={userPreferences?.userRunningLevel || ""}
      dispatchUserLevel={handleChangeRadioBtn(Attributes.userRunningLevel)}
    />,
    <UserGoal
      userGoal={userPreferences?.userRunningLevel || ""}
      dispatchUserGoal={handleChangeRadioBtn(Attributes.userRunningGoal)}
    />,
  ];

  return (
    <View style={styles.container}>
      <Stepper
        active={activeStep}
        content={content}
        onBack={() => setActiveStep((p) => p - 1)}
        onFinish={() => generatePlan()}
        onNext={() => setActiveStep((p) => p + 1)}
      />
      {generatePlanloading && (
        <ActivityIndicator size="large" color="#2ecc71" />
      )}
    </View>
  );
};

export default CreateNewPlan;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 25,
  },
});
