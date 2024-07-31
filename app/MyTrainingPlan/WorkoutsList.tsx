import moment from "moment";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {Timeline} from "react-native-just-timeline";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { WeeklyPlan, Workout } from "../types/training";
import { TimelineObject } from "../types/timeline";

const formatToTimeline = (workout: Workout):TimelineObject=> {
  return ({
    title: {
      content: workout.workout,
    },
    description: {
      content: 'something',
    },
    time: {
      content: moment(workout.date).format('ll'),
    },
  })
}

export const BasicTimeline = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [editedWorkout, setEditedWorkout] = useState<Workout>({date: new Date(), workout: ""});
    const [plan, setPlan] = useState<TimelineObject[]>([]);

    useEffect(() => {
        PlanAPI.getPlan().then((res) => {
          const workouts:TimelineObject[] = []
          res.data.plan.forEach((week) => week.days.forEach(day => workouts.push(formatToTimeline(day))))
          setPlan(workouts)})
    }, []);
  
    return (
        <Timeline data={plan} />
    );
  };
  