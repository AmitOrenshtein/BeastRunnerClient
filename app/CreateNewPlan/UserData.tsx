import React, { FC, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { TextInput } from 'react-native-paper';
import RadioButton from "../../components/RadioButton";
import { Gender } from "../types/user";

interface UserDataProps {
  gender: Gender;
  age: string;
  dispatchUserGender: (gender: Gender) => void;
  dispatchUserAge: (age: string) => void;
}

interface GenderOption {
  label: Gender;
  value: Gender;
}

const genderOptions: GenderOption[] = [
  { label: Gender.female, value: Gender.female },
  { label: Gender.male, value: Gender.male },
];

const UserData: FC<UserDataProps> = ({ age, gender, dispatchUserAge, dispatchUserGender }) => {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(gender);
  const [selectedAge, setSelectedAge] = useState(age);

  const handleSelectGender = (value: Gender) => {
    setSelectedGender(value);
    dispatchUserGender(value);
  };

  const handleSelectAge = (age: string) => {
    setSelectedAge(age);
    dispatchUserAge(age);
  }

  return (
    <View>
      <View>
        <Text style={{ fontSize: 25, fontWeight: 600, marginVertical: 20 }}>
          Insert your age:{" "}
        </Text>
        <TextInput
          keyboardType="numeric"
          editable
          style={styles.modalText}
          onChangeText={handleSelectAge}
          value={selectedAge}
        />
      </View>
      <Text style={{ fontSize: 25, fontWeight: 600, marginVertical: 20 }}>
        Select your gender:{" "}
      </Text>
      <RadioButton
        options={genderOptions}
        selectedOption={selectedGender}
        onSelect={(gender: string) => handleSelectGender(gender as Gender)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  modalText: {
    marginVertical: 10,
    textAlign: 'center',
    color:"gray"
  },})
export default UserData;