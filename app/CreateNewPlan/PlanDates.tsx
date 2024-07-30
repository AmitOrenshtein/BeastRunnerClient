import { FC, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DatePicker from "react-native-modern-datepicker";

interface PropsI {
    label: string;
    dispatchDate: (newDate: string) => void
}

const PlanDates: FC<PropsI> = ({label, dispatchDate}) => {

  const handleSelectDate = (newDate: string) => {
    dispatchDate(newDate)
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25, fontWeight: 600, marginVertical: 10 }}>
        {label}
      </Text>
      <DatePicker
        mode="calendar"
        onDateChange={(date) => handleSelectDate(date)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
  },
});

export default PlanDates