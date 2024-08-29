import moment from "moment";
import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { WeeklyPlan, Workout } from "../types/training";
import EditWorkout from "./EditWorkout";
const { width, height } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import { Card, Button, ActivityIndicator } from "react-native-paper";
import WorkoutFeedback from "./workoutFeedback";
import { useFocusEffect } from "@react-navigation/native";
import { useGoogleFit } from "../context/GoogleFitContext";
import appTheme from '../../appTheme'

export const BasicTimeline = () => {
  const {fetchSessionsDataFromGoogleFit} = useGoogleFit();
  const [editPlanModalVisible, setEditPlanModalVisible] =
    useState<boolean>(false);
  const [feedbackModalVisible, setFeedbackModalVisible] =
    useState<boolean>(false);
  const [editedWorkout, setEditedWorkout] = useState<Workout>({
    date: new Date(),
    workout: {
      title: '',
      distance: '',
      workoutTime: '',
      description: '',
    },
  });
  const [plan, setPlan] = useState<WeeklyPlan[]>([]);
  const [isLoading, setIsLoadong] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoadong(true);
      PlanAPI.getPlan().then((res) => {
        const newPlan = [...res.data.plan];
        const startTime = Date.now() - 60 * 24 * 60 * 60 * 1000; // Last 90 days
        const endTime = Date.now();
        fetchSessionsDataFromGoogleFit(startTime, endTime).then(sessions => {
          setPlan(newPlan.map(week => ({week: week.week, days: week.days.map(day => {
            const dailySession = sessions.find(session => moment(new Date(+session.startTime)).format('ll') === moment(day.date, "YYYY-MM-DD").utc(true).format('ll'));
            if(dailySession)
              return {...day, completedDistance: +(dailySession.distance / 1609).toFixed(0), completedTime: +((dailySession.endTime - dailySession.startTime) / 60000).toFixed(0)}
             else return day
          })}
        )))
          setPlan(newPlan)
          setIsLoadong(false);
        }).catch(() => {
          setPlan(newPlan);
          setIsLoadong(false);
        })
      });
    }, [])
  );

  const cardsList = () => {
    return (
      <>
        {plan
          .map((week) => week.days)
          .flat()
          .map((workout) => (
            <View
              style={{ flexDirection: "row", width: width }}
              key={workout.date.toString()}
            >
              <Card style={cardStyles(!!moment().isSame(moment(workout.date, "YYYY-MM-DD").utc(true), 'day')).card}>
                <Card.Content>
                  <View style={{ width: "100%"}}>
                    <View style={styles.row}>
                      <View>
                        <View style={styles.cardTitle}>
                          <Text style={styles.trainingTitle}>
                            {workout.workout.title}
                          </Text>
                          {/* {!!moment().isSame(moment(workout.date, "YYYY-MM-DD").utc(true), 'day')
                          && <Text style={styles.TodaysCard} >
                            Today!
                          </Text>} */}
                          <Text style={cardStyles(!!moment().isSame(moment(workout.date, "YYYY-MM-DD").utc(true), 'day')).dateText}>
                            {`${(!!moment().isSame(moment(workout.date, "YYYY-MM-DD").utc(true), 'day') ? 'Ttoday! - ' : '')}${(workout.date as string)}`}
                          </Text >
                        </View>
                        <Text style={{ fontSize: 12, color: "black", maxWidth:"90%", marginBottom: 8}}>
                          {workout.workout.description}
                        </Text>
                        {!workout.workout.title.toLowerCase().includes('rest') && <Text style={{ fontSize: 12, color: "#5384cf", maxWidth:"90%" }}>
                          {`${workout.workout.distance} miles | ${workout.workout.workoutTime} minutes`}
                        </Text>}
                      </View>
                    </View>
                    {!moment().isBefore(moment(workout.date, "YYYY-MM-DD").utc(true)) && (
                      <View style={{ ...styles.buttonRow }}>
                        {workout.completedDistance &&
                        workout.completedDistance ? (
                          <Text style={{ fontSize: 12, color: "#077a28", marginTop: 5 }}>
                            {workout.completedDistance} miles |{" "}
                            {workout.completedTime} minutes
                          </Text>
                        ) : (
                          <Text></Text>
                        )}
                        {!!workout.difficultyFeedback || !!workout.completedDistance || !!workout.completedTime || !workout.workout.workoutTime 
                        ? <Button
                          textColor={appTheme.colors.darkBlue}
                          style={{borderRadius: 0, marginBottom: 10 }}
                          onPress={() => {
                            setEditedWorkout(workout);
                            setFeedbackModalVisible(true);
                          }}
                          >
                            edit feedback
                        </Button> 
                        : <Button
                          textColor="white"
                          style={{ backgroundColor: "gray", borderRadius: 4 }}
                          onPress={() => {
                            setEditedWorkout(workout);
                            setFeedbackModalVisible(true);
                          }}
                        >
                          feedback
                        </Button>}
                      </View>
                    )}
                    {moment().isBefore(moment(workout.date, "YYYY-MM-DD").utc(true)) && (
                          <View style={styles.editWorkout}>
                            <Pressable
                              onPress={() => {
                                setEditedWorkout(workout);
                                setEditPlanModalVisible(true);
                              }}
                            >
                              <Icon name="edit" />
                            </Pressable>
                          </View>
                        )}
                  </View>
                </Card.Content>
              </Card>
            </View>
          ))}
      </>
    );
  };

  if (isLoading && plan.length === 0) {
    return <ActivityIndicator size="large" color={appTheme.colors.themeColor} style={{marginTop: 30}} />
  }
  else if (plan.length === 0) {
    return <Text>No Plan Created Yet..</Text>;
  }

  return (
    <>
      {cardsList()}
      <EditWorkout
        plan={plan}
        setPlan={setPlan}
        modalVisible={editPlanModalVisible}
        setModalVisible={setEditPlanModalVisible}
        workout={editedWorkout}
      />
      <WorkoutFeedback
        plan={plan}
        setPlan={setPlan}
        modalVisible={feedbackModalVisible}
        setModalVisible={setFeedbackModalVisible}
        workout={editedWorkout}
      />
    </>
  );
};

const cardStyles = (isToday: boolean) => StyleSheet.create({
  card: {
    paddingVertical: 10,
    borderRadius: 3,
    marginVertical: 10,
    marginHorizontal: 20,
    height: 190,
    alignSelf: "center",
    paddingLeft: 15,
    backgroundColor: isToday ? '#E2F0D9' : ''
  },
  dateText: {
    width: '100%',
    maxWidth: width * 0.3,
    color: "gray",
    fontSize: 16,
  },
})

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20

  },
  cardTitle: {
    flexDirection: "row",
    marginBottom: 6
  },
  trainingTitle: {
    flex: 1,     
    justifyContent: "flex-start",
    fontSize: 20,
  },
  editWorkout: {
    marginLeft: 250
  },
  TodaysCard: {
  }
});
