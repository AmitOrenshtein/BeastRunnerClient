import { Text, View, StyleSheet, Button, Pressable, SafeAreaView, FlatList } from "react-native";
import { Plan, Workout } from "../types/training";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';
import EditWorkout from "./EditWorkout";


export default function WorkoutList({dateFilter}:{dateFilter: Date}) {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [editedWorkout, setEditedWorkout] = useState<Workout>({date: new Date(), workout: ""});
    const plan:Plan = {"plan":[{"days":[{"date":"Tue Jul 23 2024","workout":"Rest"},{"date":"Wed Jul 24 2024","workout":"Easy run for 30 minutes at a comfortable pace"},{"date":"Thu Jul 25 2024","workout":"Rest"},{"date":"Fri Jul 26 2024","workout":"Easy run for 40 minutes at a comfortable pace"},{"date":"Sat Jul 27 2024","workout":"Tempo run for 20 minutes at a faster pace"},{"date":"Sun Jul 28 2024","workout":"Long run for 1 hour at a conversational pace"},{"date":"Mon Jul 29 2024","workout":"Rest"}],"week":1},{"days":[{"date":"Tue Jul 30 2024","workout":"Rest"},{"date":"Wed Jul 31 2024","workout":"Easy run for 35 minutes at a comfortable pace"},{"date":"Thu Aug 01 2024","workout":"Rest"},{"date":"Fri Aug 02 2024","workout":"Easy run for 45 minutes at a comfortable pace"},{"date":"Sat Aug 03 2024","workout":"Tempo run for 25 minutes at a faster pace"},{"date":"Sun Aug 04 2024","workout":"Long run for 1.15 hours at a conversational pace"},{"date":"Mon Aug 05 2024","workout":"Rest"}],"week":2},{"days":[{"date":"Tue Aug 06 2024","workout":"Rest"},{"date":"Wed Aug 07 2024","workout":"Easy run for 40 minutes at a comfortable pace"},{"date":"Thu Aug 08 2024","workout":"Rest"},{"date":"Fri Aug 09 2024","workout":"Easy run for 50 minutes at a comfortable pace"},{"date":"Sat Aug 10 2024","workout":"Tempo run for 30 minutes at a faster pace"},{"date":"Sun Aug 11 2024","workout":"Long run for 1.30 hours at a conversational pace"},{"date":"Mon Aug 12 2024","workout":"Rest"}],"week":3},{"days":[{"date":"Tue Aug 13 2024","workout":"Rest"},{"date":"Wed Aug 14 2024","workout":"Easy run for 45 minutes at a comfortable pace"},{"date":"Thu Aug 15 2024","workout":"Rest"},{"date":"Fri Aug 16 2024","workout":"Easy run for 55 minutes at a comfortable pace"},{"date":"Sat Aug 17 2024","workout":"Tempo run for 35 minutes at a faster pace"},{"date":"Sun Aug 18 2024","workout":"Long run for 1.45 hours at a conversational pace"},{"date":"Mon Aug 19 2024","workout":"Rest"}],"week":4},{"days":[{"date":"Tue Aug 20 2024","workout":"Rest"},{"date":"Wed Aug 21 2024","workout":"Easy run for 50 minutes at a comfortable pace"},{"date":"Thu Aug 22 2024","workout":"Rest"},{"date":"Fri Aug 23 2024","workout":"Easy run for 60 minutes at a comfortable pace"},{"date":"Sat Aug 24 2024","workout":"Tempo run for 40 minutes at a faster pace"},{"date":"Sun Aug 25 2024","workout":"Long run for 2 hours at a conversational pace"},{"date":"Mon Aug 26 2024","workout":"Rest"}],"week":5},{"days":[{"date":"Tue Aug 27 2024","workout":"Rest"},{"date":"Wed Aug 28 2024","workout":"Easy run for 55 minutes at a comfortable pace"},{"date":"Thu Aug 29 2024","workout":"Rest"},{"date":"Fri Aug 30 2024","workout":"Easy run for 65 minutes at a comfortable pace"},{"date":"Sat Aug 31 2024","workout":"Tempo run for 45 minutes at a faster pace"},{"date":"Sun Sep 01 2024","workout":"Long run for 2.15 hours at a conversational pace"},{"date":"Mon Sep 02 2024","workout":"Rest"}],"week":6},{"days":[{"date":"Tue Sep 03 2024","workout":"Rest"},{"date":"Wed Sep 04 2024","workout":"Easy run for 60 minutes at a comfortable pace"},{"date":"Thu Sep 05 2024","workout":"Rest"},{"date":"Fri Sep 06 2024","workout":"Easy run for 70 minutes at a comfortable pace"},{"date":"Sat Sep 07 2024","workout":"Tempo run for 50 minutes at a faster pace"},{"date":"Sun Sep 08 2024","workout":"Long run for 2.30 hours at a conversational pace"},{"date":"Mon Sep 09 2024","workout":"Rest"}],"week":7},{"days":[{"date":"Tue Sep 10 2024","workout":"Rest"},{"date":"Wed Sep 11 2024","workout":"Easy run for 65 minutes at a comfortable pace"},{"date":"Thu Sep 12 2024","workout":"Rest"},{"date":"Fri Sep 13 2024","workout":"Easy run for 75 minutes at a comfortable pace"},{"date":"Sat Sep 14 2024","workout":"Tempo run for 55 minutes at a faster pace"},{"date":"Sun Sep 15 2024","workout":"Long run for 2.45 hours at a conversational pace"},{"date":"Mon Sep 16 2024","workout":"Rest"}],"week":8},{"days":[{"date":"Tue Sep 17 2024","workout":"Rest"},{"date":"Wed Sep 18 2024","workout":"Easy run for 70 minutes at a comfortable pace"},{"date":"Thu Sep 19 2024","workout":"Rest"},{"date":"Fri Sep 20 2024","workout":"Easy run for 80 minutes at a comfortable pace"},{"date":"Sat Sep 21 2024","workout":"Tempo run for 60 minutes at a faster pace"},{"date":"Sun Sep 22 2024","workout":"Long run for 3 hours at a conversational pace"},{"date":"Mon Sep 23 2024","workout":"Rest"}],"week":9},{"days":[{"date":"Tue Sep 24 2024","workout":"Rest"},{"date":"Wed Sep 25 2024","workout":"Easy run for 75 minutes at a comfortable pace"},{"date":"Thu Sep 26 2024","workout":"Rest"},{"date":"Fri Sep 27 2024","workout":"Easy run for 85 minutes at a comfortable pace"},{"date":"Sat Sep 28 2024","workout":"Tempo run for 65 minutes at a faster pace"},{"date":"Sun Sep 29 2024","workout":"Long run for 3.15 hours at a conversational pace"},{"date":"Mon Sep 30 2024","workout":"Rest"}],"week":10},{"days":[{"date":"Tue Oct 01 2024","workout":"Rest"},{"date":"Wed Oct 02 2024","workout":"Easy run for 80 minutes at a comfortable pace"},{"date":"Thu Oct 03 2024","workout":"Rest"},{"date":"Fri Oct 04 2024","workout":"Easy run for 90 minutes at a comfortable pace"},{"date":"Sat Oct 05 2024","workout":"Tempo run for 70 minutes at a faster pace"},{"date":"Sun Oct 06 2024","workout":"Long run for 3.30 hours at a conversational pace"},{"date":"Mon Oct 07 2024","workout":"Rest"}],"week":11},{"days":[{"date":"Tue Oct 08 2024","workout":"Rest"},{"date":"Wed Oct 09 2024","workout":"Easy run for 85 minutes at a comfortable pace"},{"date":"Thu Oct 10 2024","workout":"Rest"},{"date":"Fri Oct 11 2024","workout":"Easy run for 95 minutes at a comfortable pace"},{"date":"Sat Oct 12 2024","workout":"Tempo run for 75 minutes at a faster pace"},{"date":"Sun Oct 13 2024","workout":"Long run for 3.45 hours at a conversational pace"},{"date":"Mon Oct 14 2024","workout":"Rest"}],"week":12}]}

    const getDaysInWeek = ():Date[] => {
        const days = []
        for(let i = 0; i < 7; i ++) {
            days.push(moment(dateFilter).add(i, "d").toDate())
        }
        return days;
    }

    const findDailyWorkout = (day: Date):Workout=> {
        let dailyTraining: Workout = {date: day, workout: ""};
        plan.plan.forEach((week) => 
            week.days.forEach((training) => 
                {if(moment(training.date).format("DD/MM/YY") === moment(day).format("DD/MM/YY")) dailyTraining.workout = training.workout}
            )
        )
        return dailyTraining
    }

    const Item = ({workout}: {workout: Workout}) => (
        <View style={styles.row}>
            <View style={styles.item}>
                <Text style={styles.date}>{moment(workout.date).format("DD/MM/YY")}</Text>
                <Text style={styles.title}>{workout.workout}</Text>
            </View>
            <Pressable style={styles.button} onPress={() => {setEditedWorkout(workout); setModalVisible(true)}}>
                <Icon name='edit' />
            </Pressable>
        </View>
      );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={getDaysInWeek().map((day) => findDailyWorkout(day))}
                renderItem={(item) =>  <Item workout={item.item}></Item>}
                keyExtractor={(item: Workout) => item.date.toString()}
            />
            <EditWorkout modalVisible={modalVisible} setWorkout={setEditedWorkout} setModalVisible={setModalVisible} workout={editedWorkout}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop:20,
        alignItems: 'center',
    },
    date: {
        width: width / 10, 
        marginRight:10,
        paddingVertical: height / 25,
        paddingHorizontal: width / 40,
        borderColor: '#b5cef7',
        borderWidth:1
    },
    item: {
        alignItems: "center",
        flexDirection:"row", 
        width: width / 2,
        height: height / 10
      },
      row: {
        alignItems: "center",
        justifyContent:"flex-end", 
        flexDirection:"row",
        borderColor: '#b5cef7',
        borderWidth:1
    },
    title: {
        fontSize: 16,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:25,
    },
  });