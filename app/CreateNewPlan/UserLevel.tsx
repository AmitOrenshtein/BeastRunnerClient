import React, { FC, useState } from "react";
import { Text, View } from "react-native";
import RadioButton from "../../components/RadioButton";

interface UserLevelProps {
  userLevel: string;
  dispatchUserLevel: (userLevel: string) => void;
}

interface Option {
  label: string;
  value: string;
}

export const levelOptions: Option[] = [
  { label: "Beginner (little to non experience)", value: "Beginner" },
  {
    label: "Intermediate (comfortable running short distances)",
    value: "Intermediate",
  },
  {
    label: "Advanced (comfortable running longer distances)",
    value: "Advanced",
  },
];

const UserLevel: FC<UserLevelProps> = ({ userLevel, dispatchUserLevel }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userLevel
  );

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    dispatchUserLevel(value);
  };

  return (
    <View>
      <Text style={{ fontSize: 25, fontWeight: 600, marginVertical: 20, alignSelf: "center", margin: 40 }}>
        Choose your running level:{" "}
      </Text>
      <View style={{marginHorizontal: 40}}>
        <RadioButton
          options={levelOptions}
          selectedOption={selectedOption}
          onSelect={handleSelect}
        />
      </View>
    </View>
  );
};

export default UserLevel;
