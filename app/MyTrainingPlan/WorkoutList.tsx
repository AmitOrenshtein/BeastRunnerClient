import { Text, View, StyleSheet, Button, Pressable, SafeAreaView, FlatList, Platform } from "react-native";
import { WeeklyPlan, Workout } from "../types/training";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';
import EditWorkout from "./EditWorkout";
import { getPlan } from "../api/serverApi";


export default function WorkoutList({dateFilter}:{dateFilter: Date}) {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [editedWorkout, setEditedWorkout] = useState<Workout>({date: new Date(), workout: ""});
    const [plan, setPlan] = useState<WeeklyPlan[]>([]);

    useEffect(() => {
        //getPlan().then((res) => setPlan(res.data.plan))
    }, []);

    const getDaysInWeek = ():Date[] => {
        const days = []
        for(let i = 0; i < 7; i ++) {
            days.push(moment(dateFilter).add(i, "d").toDate())
        }
        return days;
    }

    const findDailyWorkout = (day: Date):Workout=> {
        let dailyTraining: Workout = {date: day, workout: "Rest"};        
        plan?.forEach((week) => 
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
            <EditWorkout plan={plan} setPlan={setPlan} modalVisible={modalVisible} setWorkout={setEditedWorkout} setModalVisible={setModalVisible} workout={editedWorkout}/>
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