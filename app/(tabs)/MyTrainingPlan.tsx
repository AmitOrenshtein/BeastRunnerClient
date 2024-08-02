import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Dimensions } from 'react-native';
import {BasicTimeline} from "../MyTrainingPlan/WorkoutsList";
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';


export default function MyTrainingPlan() {
    return (
        <View style={styles.container}>
            {/* <BasicTimeline/> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      maxHeight: '100%',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        elevation: 3,
        marginHorizontal:15,
        width:width / 12,
      },
    text: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
    },
  });