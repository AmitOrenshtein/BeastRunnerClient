import { Text, View, StyleSheet, Pressable, Modal } from "react-native";
import {WeeklyPlan, Workout } from "../types/training";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { TextInput } from 'react-native-paper';

export default function EditWorkout({plan, setPlan, workout, modalVisible, setModalVisible}: 
    {plan: WeeklyPlan[], setPlan: React.Dispatch<React.SetStateAction<WeeklyPlan[]>>
        workout: Workout, 
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
            style={{marginVertical:5}}
                outlineStyle={{borderColor:"#34bdeb"}}
                mode="outlined"
                editable
                multiline
                numberOfLines={2}
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
      color:"gray"
    },
  });
  
  