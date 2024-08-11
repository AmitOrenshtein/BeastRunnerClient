import {StyleSheet, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import { Dimensions } from 'react-native';
import {BasicTimeline} from "../MyTrainingPlan/WorkoutsList";


export default function MyTrainingPlan() {
    return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <BasicTimeline/>
          </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      maxHeight: '100%',
    }
  });