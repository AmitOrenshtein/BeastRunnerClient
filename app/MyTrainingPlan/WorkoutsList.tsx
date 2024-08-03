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
    const [editPlanModalVisible, setEditPlanModalVisible] = useState<boolean>(false)
    const [editedWorkout, setEditedWorkout] = useState<Workout>({date: new Date(), workout: ""});
    const [plan, setPlan] = useState<WeeklyPlan[]>([]);

    useEffect(() => {
      PlanAPI.getPlan().then((res) => {
        setPlan(res.data.plan)
      })
  }, []);

    const cardsList = () => {
      return(<>
      {plan.map((week) => week.days).flat().map((workout) => (
        <View style={{flexDirection:"row", width:"100vw"}} key={workout.date.toString()}>
        <Text style={styles.dateText}>
          {moment(workout.date).format('ll')}
        </Text>
          <Card style={styles.card}>
            <Card.Content>
            <View style={{width:'100%'}}>
              <View style={styles.row}>
                <Text style={{fontSize: 13, color: '#5384cf'}}>
                  {workout.workout}
                </Text>
                {moment().isBefore(workout.date) && 
                <Pressable onPress={() => {setEditedWorkout(workout); setModalVisible(true)}}>
                    <Icon name='edit' />
                </Pressable>}
              </View>
              { !moment().isBefore(workout.date) &&
                <View style={styles.row}>
                  {workout.completedDistance && workout.completedDistance && 
                    <Text style={{fontSize: 12, color: '#077a28'}}>
                    {workout.completedTime}" | {workout.completedDistance} KM
                    </Text>}
                  <Pressable style={{marginTop:6}} onPress={() => {setEditedWorkout(workout); setEditPlanModalVisible(true)}}>
                    <Text style={{fontSize: 12, color: '#999', marginBottom: 7}}>
                        feedback
                    </Text>
                  </Pressable>
                </View>
              }
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
        <EditWorkout plan={plan} setPlan={setPlan} modalVisible={editPlanModalVisible} setWorkout={setEditedWorkout} setModalVisible={setEditPlanModalVisible} workout={editedWorkout}/>
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
      fontSize: 12,
      margin: 10
    },
    card: {
      borderRadius:3,
      marginVertical:4,
      width:"100%",
      maxWidth:width * 0.7
      }
  });
