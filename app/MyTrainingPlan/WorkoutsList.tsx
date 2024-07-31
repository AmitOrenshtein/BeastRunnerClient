import moment from "moment";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {Timeline} from "react-native-just-timeline";
import { getPlan } from "../api/serverApi";
import { WeeklyPlan, Workout } from "../types/training";


export const BasicTimeline = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [editedWorkout, setEditedWorkout] = useState<Workout>({date: new Date(), workout: ""});
    const [plan, setPlan] = useState<WeeklyPlan[]>([]);

    useEffect(() => {
        getPlan().then((res) => setPlan(res.data.plan))
    }, []);

    const data = [
      {
        title: {
          content: 'Event One Title',
        },
        description: {
          content: 'Event One Description',
        },
        time: {
          content: moment().format('ll'),
        },
      },
        {
        title: {
          content: 'Event Two Title',
        },
        description: {
          content: 'Event Two Description',
        },
        time: {
          content: moment().format('ll'),
        },
      }
    ];
  
    return (
        <Timeline data={data} />
    );
  };
  