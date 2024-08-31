import { Text, View, StyleSheet, Pressable, Modal, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import {WeeklyPlan, Workout } from "../types/training";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Icon } from 'react-native-elements';
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { TextInput } from 'react-native-paper';
import {formatDate} from "@/app/(tabs)/PersonalInfo";

export default function EditWorkout({plan, setPlan, workout, modalVisible, setModalVisible}: 
    {plan: WeeklyPlan[], setPlan: React.Dispatch<React.SetStateAction<WeeklyPlan[]>>
        workout: Workout, 
        modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [editedWorkout, setEditedWorkout] = useState<Workout>(workout);

    useEffect(() => {
        workout && setEditedWorkout(workout)
    }, [workout])

    const onSaveHandler = () => {
        const updatedPlan:WeeklyPlan[] = plan.map((week) => 
            ({week: week.week, days: week.days.map(day => 
                moment(workout.date, "YYYY-MM-DD").utc(true).toString() === moment(day.date, "YYYY-MM-DD").utc(true).toString() ? 
            editedWorkout : day) }))
            PlanAPI.updatePlan(updatedPlan).then((res) => {
                setPlan(res.data.updatedPlan.plan);
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
            <Text style={styles.modalText}>{formatDate(workout.date.toString())}</Text>
            <TextInput
                style={{maxHeight: height / 10, width: width / 2}}
                outlineStyle={{borderColor:"#34bdeb"}}
                mode="outlined"
                label={"description"}
                editable
                multiline
                numberOfLines={2}
                onChangeText={(text) => setEditedWorkout({...editedWorkout, workout: {...editedWorkout.workout, description: text}})}
                value={editedWorkout.workout.description}
            />
                        <TextInput
                style={{maxHeight: height / 10, width: width / 2}}
                outlineStyle={{borderColor:"#34bdeb"}}
                mode="outlined"
                keyboardType="numeric"
                label={"distance"}
                editable
                multiline
                numberOfLines={2}
                onChangeText={(text) => setEditedWorkout({...editedWorkout, workout: {...editedWorkout.workout, distance: text}})}
                value={editedWorkout.workout.distance.toString()}
            />
                        <TextInput
                style={{maxHeight: height / 10, width: width / 2}}
                outlineStyle={{borderColor:"#34bdeb"}}
                mode="outlined"
                keyboardType="numeric"
                label={"workoutTime"}
                editable
                multiline
                numberOfLines={2}
                onChangeText={(text) => setEditedWorkout({...editedWorkout, workout: {...editedWorkout.workout, workoutTime: text}})}
                value={editedWorkout.workout.workoutTime.toString()}
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
        marginVertical: height / 5,
        minHeight: height / 2.5,
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
  
