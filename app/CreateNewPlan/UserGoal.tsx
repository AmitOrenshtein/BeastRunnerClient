import React, { FC, useState } from "react";
import { Text, View } from "react-native";
import RadioButton from "../../components/RadioButton";

interface UserGoalProps {
  userGoal: string;
  dispatchUserGoal: (userGoal: string) => void;
}

interface Option {
  label: string;
  value: string;
}

export const goalOptions: Option[] = [
  { label: "Increase Distance", value: "Increase Distance" },
  {
    label: "Improve Speed",
    value: "Improve Speed",
  },
  {
    label: "Build Endurance",
    value: "Build Endurance",
  },
  {
    label: "General Fitness improvement",
    value: "General Fitness improvement",
  },
];

const UserGoal: FC<UserGoalProps> = ({ userGoal, dispatchUserGoal }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(userGoal);

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    dispatchUserGoal(value);
  };

  return (
    <View>
      <Text style={{fontSize: 25, fontWeight: 600, marginVertical: 20, alignSelf: "center", margin: 40}}>
        Choose your Goal:{" "}
      </Text>
      <View style={{marginHorizontal: 40}}>
        <RadioButton
          options={goalOptions}
          selectedOption={selectedOption}
          onSelect={handleSelect}
        />
      </View>
    </View>
  );
};

export default UserGoal;
