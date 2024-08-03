import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { WeeklyPlan, Workout } from "../types/training";
import EditWorkout from "./EditWorkout";
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';
import { Card, Button } from 'react-native-paper';

export const BasicTimeline = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [editedWorkout, setEditedWorkout] = useState<Workout>({date: new Date(), workout: ""});
    const [plan, setPlan] = useState<WeeklyPlan[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
      PlanAPI.getPlan().then((res) => {
        setPlan(res.data.plan)
        const workouts:Workout[] = [];
        res.data.plan.forEach((week) => week.days.forEach(day => workouts.push(day)));
        setWorkouts(workouts);
      })
  }, []);

    const formatToTimelineItem = (workout: Workout) => {
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
              {moment().isBefore(workout.date) ? 
              <Pressable onPress={() => {setEditedWorkout(workout); setModalVisible(true)}}>
                  <Icon name='edit' />
              </Pressable> : 
              <View style={styles.row}>
                <Pressable style={{marginHorizontal:4}} onPress={() => {setEditedWorkout(workout); setModalVisible(true)}}>
                <Text style={{fontSize: 14, color: '#999', marginBottom: 7}}>
                   feedback
                </Text>
                </Pressable>
                <Text style={{fontSize: 14, color: '#999', marginBottom: 7}}>
                   feedback
                </Text>
              </View>
              }
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

    const cardsList = () => {
      return(<>
      {workouts.map((workout) => (
        <View style={{flexDirection:"row", width:"100vw"}} key={workout.date.toString()}>
        <Text style={styles.dateText}>
        {moment(workout.date).format('ll')}
        </Text>
          <Card style={styles.card}>
            <Card.Content>
            <View style={{width:'100%'}}>
            <Text style={{fontSize: 10, color: '#999', marginBottom: 7}}>
              daily workout plan:
            </Text>
            <View style={styles.row}>
              <Text style={{marginBottom: 0, color: '#5384cf'}}>
                {workout.workout}
              </Text>
              {moment().isBefore(workout.date) ? 
              <Pressable onPress={() => {setEditedWorkout(workout); setModalVisible(true)}}>
                  <Icon name='edit' />
              </Pressable> : 
              <View style={styles.row}>
                <Pressable style={{marginHorizontal:4}} onPress={() => {setEditedWorkout(workout); setModalVisible(true)}}>
                <Text style={{fontSize: 14, color: '#999', marginBottom: 7}}>
                   feedback
                </Text>
                </Pressable>
                <Text style={{fontSize: 14, color: '#999', marginBottom: 7}}>
                   feedback
                </Text>
              </View>
              }
            </View>
          </View>
            </Card.Content>
          </Card>
        </View>
      ))}
      </>)
    }
    
    return (
      <>
      {cardsList()}
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
    dateText: {
      width:"100%",
      maxWidth:width * 0.3,
      color:"gray", 
      fontSize: 12
    },
    card: {
      borderRadius:3,
      marginVertical:4,
      width:"100%",
      maxWidth:width * 0.7
      }
  });
