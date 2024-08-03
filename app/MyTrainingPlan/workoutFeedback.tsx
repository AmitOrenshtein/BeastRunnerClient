import { Text, View, StyleSheet, Button, Pressable, SafeAreaView, FlatList, Modal, TextInput } from "react-native";
import {WeeklyPlan, Workout } from "../types/training";
import React, { SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';
import { PlanAPI } from "@/serverAPI/PlanAPI";

export default function workoutFeedback({plan, setPlan, workout, setWorkout, modalVisible, setModalVisible}: 
    {plan: WeeklyPlan[], setPlan: React.Dispatch<React.SetStateAction<WeeklyPlan[]>>
        workout: Workout, setWorkout: React.Dispatch<React.SetStateAction<Workout>>, 
        modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [editedWorkout, setEditedWorkout] = useState<string>(workout.workout);

    useEffect(() => {
        workout && setEditedWorkout(workout.workout)
    }, [workout])

    const onSaveHandler = () => {
        const updatedPlan:WeeklyPlan[] = plan.map((week) => 
            ({week: week.week, days: week.days.map(day => 
                moment(workout.date).format("DD/MM/YY") === moment(day.date).format("DD/MM/YY") ? 
            { date: day.date ,workout: editedWorkout} : { date: day.date ,workout: day.workout}) }))
            PlanAPI.updatePlan(updatedPlan).then((res) => {
                setPlan(res.data.plan);
                setModalVisible(!modalVisible);
        })
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }
        }>
        <View style={styles.modalView}>
            <Text style={styles.modalText}>{moment(workout.date).format('ll')}</Text>
            <TextInput
                editable
                multiline
                numberOfLines={4}
                style={styles.input}
                onChangeText={setEditedWorkout}
                value={editedWorkout}
            />
          <View style={{flexDirection:"row"}}>
            <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
                <Icon color="white" name='close' />
            </Pressable>
            <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => onSaveHandler()}>
                <Icon color="white" name='save' />
            </Pressable>
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        marginHorizontal:'10%',
        marginVertical: '35vh',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flex: 1,
        justifyContent: 'center',
    },
    button: {
      borderRadius: 5,
      padding: 8,
      marginHorizontal:10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
        width: 'auto',
        margin: 15,
        borderWidth: 1,
        padding: 10,
      },
  });
  
  