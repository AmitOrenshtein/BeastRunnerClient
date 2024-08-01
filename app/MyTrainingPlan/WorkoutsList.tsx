import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import {Timeline} from "react-native-just-timeline";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { WeeklyPlan, Workout } from "../types/training";
import { TimelineObject } from "../types/timeline";
import EditWorkout from "./EditWorkout";
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';

export const BasicTimeline = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [editedWorkout, setEditedWorkout] = useState<Workout>({date: new Date(), workout: ""});
    const [plan, setPlan] = useState<WeeklyPlan[]>([]);
    const [workouts, setWorkouts] = useState<TimelineObject[]>([]);

    const formatToTimeline = (workout: Workout):TimelineObject | any => {
      return ({
        title: () => (
          <View style={{width:'100%'}}>
            <Text style={{fontSize: 10, color: '#999', marginBottom: 7}}>
              daily workout plan:
            </Text>
            <View style={styles.row}>
              <Text style={{marginBottom: 0, color: '#5384cf'}}>
                {workout.workout}
              </Text>
              <Pressable onPress={() => {setEditedWorkout(workout); setModalVisible(true)}}>
                  <Icon name='edit' />
              </Pressable>
            </View>
          </View>
        ),
        time: {
          content: moment(workout.date).format('ll'),
          style: {
            paddingTop: 8,
          },
        },
        icon: {
          content: 'check',
          style: {
            width: 35,
            height: 35,
            backgroundColor: '#5384cf',
            color: '#FFF',
            borderColor: '#FFF',
            fontSize: 16,
            paddingTop: 6,
            borderRadius: 18,
          },
        },
      });
    }
    
    useEffect(() => {
        PlanAPI.getPlan().then((res) => {
          setPlan(res.data.plan)
          const workouts:TimelineObject[] = []
          res.data.plan.forEach((week) => week.days.forEach(day => workouts.push(formatToTimeline(day))))
          setWorkouts(workouts)})
    }, []);
  
    return (
      <>
        <Timeline data={workouts}  />
        <EditWorkout plan={plan} setPlan={setPlan} modalVisible={modalVisible} setWorkout={setEditedWorkout} setModalVisible={setModalVisible} workout={editedWorkout}/>
        </>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        marginTop:20,
    },
    row: {
      justifyContent:"space-between",
        flexDirection:"row",
    },
  });