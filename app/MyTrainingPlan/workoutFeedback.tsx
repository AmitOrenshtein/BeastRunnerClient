import { Text, View, StyleSheet, Pressable, Modal, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import {IsRePlanNeededValues, WeeklyPlan, Workout } from "../types/training";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Divider, Icon } from 'react-native-elements';
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { SegmentedButtons, TextInput } from 'react-native-paper';

export default function WorkoutFeedback({plan, setPlan, workout, modalVisible, setModalVisible, replanHanler}: 
    {plan: WeeklyPlan[], setPlan: React.Dispatch<React.SetStateAction<WeeklyPlan[]>>
        workout: Workout,
        modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, 
        replanHanler: React.Dispatch<React.SetStateAction<IsRePlanNeededValues>>}) {
    const [editedWorkout, setEditedWorkout] = useState<Workout>(workout);

    useEffect(() => {
        workout && setEditedWorkout(workout)
    }, [workout])

    const onSaveHandler = () => {
        const updatedPlan:WeeklyPlan[] = plan.map((week) => 
            ({week: week.week, days: week.days.map(day => 
                moment(workout.date, "YYYY-MM-DD").utc(true).toString() === moment(day.date, "YYYY-MM-DD").utc(true).toString() ? 
            editedWorkout : day) }));
            PlanAPI.updatePlan(updatedPlan).then((res) => {
                setPlan(res.data.updatedPlan.plan);
                if(res.data.rePlanNeeded != IsRePlanNeededValues.NoNeedForRePlan) {
                    replanHanler(res.data.rePlanNeeded);
                }
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
            <Text style={styles.modalText}>{workout.date.toString()}</Text>
            <TextInput
                keyboardType="numeric"
                style={{maxHeight: height / 10, width: width / 2}}
                outlineStyle={{borderColor:"#34bdeb"}}
                label={"Total time"}
                mode="outlined"
                editable
                onChangeText={(text) => setEditedWorkout({...editedWorkout, completedTime:Number.parseFloat(text)})}
                defaultValue={workout.completedTime?.toString()}
            />
            <TextInput
                keyboardType="numeric"
                style={{maxHeight: height / 10, width: width / 2}}
                outlineStyle={{borderColor:"#34bdeb"}}
                label={"Completed distance"}
                mode="outlined"
                editable
                onChangeText={(text) => setEditedWorkout({...editedWorkout, completedDistance:Number.parseFloat(text)})}
                defaultValue={workout.completedDistance?.toString()}
            />
            <Text style={styles.modalText}>How difficult was the workout?</Text>
            <SegmentedButtons
                style={{marginVertical:10}}
                density="medium"
                value={editedWorkout.difficultyFeedback?.toString() || "0"}
                onValueChange={(text) => setEditedWorkout({...editedWorkout, difficultyFeedback:Number.parseInt(text)})}
                buttons={[
                {
                    value: '1',
                    label: '1',
                    style:{minWidth:15}
                },
                {
                    value: '2',
                    label: '2',
                    style:{minWidth:15}
                },
                {
                    value: '3',
                    label: '3',
                    style:{minWidth:15}
                },
                {
                    value: '4',
                    label: '4',
                    style:{minWidth:15}
                },
                {
                    value: '5',
                    label: '5',
                    style:{minWidth:15}
                },
                ]}
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
      marginVertical: 10,
      textAlign: 'center',
      color:"gray"
    },
      row: {
        justifyContent:"space-between",
        flexDirection:"row",
      },
      textInput: {
        marginVertical:5
      }
  });
  
  