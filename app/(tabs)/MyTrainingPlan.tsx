import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Dimensions } from 'react-native';
import WorkoutList from "../MyTrainingPlan/WorkoutList";
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';


export default function MyTrainingPlan() {
    const [dateFilter, setDateFilter] = useState(new Date())

    const dateToolBar = (
        <View style={{flexDirection: 'row', justifyContent:"center"}}>
            <Pressable style={styles.button} onPress={() => setDateFilter(moment(dateFilter).subtract(1, "w").toDate())}>
                <Icon name='west' />
            </Pressable>
            <Text style={{...styles.text, paddingVertical: 12, color: "black"}}>
                {moment(dateFilter).format("DD/MM/YY").toString()} - {moment(dateFilter).add(1, "w").format("DD/MM/YY").toString()}
            </Text>
            <Pressable style={styles.button} onPress={() => setDateFilter(moment(dateFilter).add(1, "w").toDate())}>
                <Icon name='east' />
            </Pressable>
        </View>
    )

    return (
        <View style={styles.container}>
            {dateToolBar}
            <WorkoutList dateFilter={dateFilter}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
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