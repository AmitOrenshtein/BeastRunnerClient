import { Text, View, StyleSheet, Pressable, Modal, Dimensions } from "react-native";
import { IsRePlanNeededValues, WeeklyPlan } from "../types/training";
import { PlanAPI } from "@/serverAPI/PlanAPI";
const { width, height } = Dimensions.get("window");
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import appTheme from '../../appTheme';
import {formatMillisToDateTime, SessionData, useGoogleFit} from "@/app/context/GoogleFitContext";

export default function RePlanWorkouts({isRePlanNeeded, setIsRePlanNeeded, setPlan}: {
    isRePlanNeeded: IsRePlanNeededValues, 
    setIsRePlanNeeded: React.Dispatch<React.SetStateAction<IsRePlanNeededValues>>,
    setPlan: React.Dispatch<React.SetStateAction<WeeklyPlan[]>>}) {
    
    const [isLoading, setIsLoadong] = useState(false);
    
    const {
        googleAccessTokenState,
        getCurrentHeight,
        getCurrentWeight
    } = useGoogleFit();

    const [fitnessHeight, setFitnessHeight] = useState<number>(0);
    const [fitnessWeight, setFitnessWeight] = useState<number>(0);

    useEffect(() => {
        const fetchGoogleFitData = async () => {
            const endTime = Date.now();
            const lastNinetyDays = Date.now() - 90 * 24 * 60 * 60 * 1000; // Last 90 days
            // Fetch data from Google Fit API
            const [
                currentHeight,
                currentWeight
            ] = await Promise.all([
                getCurrentHeight(lastNinetyDays, endTime),
                getCurrentWeight(lastNinetyDays, endTime)
            ]);
            // Set fetched data
            setFitnessHeight(currentHeight.height);
            setFitnessWeight(currentWeight.weight);
        };

        fetchGoogleFitData();
    }, []);

    const rePlan = () => {
        setIsLoadong(true);
        PlanAPI.rePlanWorkoutPlan(isRePlanNeeded, {weight: fitnessWeight, height: fitnessHeight}).then((res) => {
            setPlan(res.data.plan);
            setIsLoadong(false);
            setIsRePlanNeeded(IsRePlanNeededValues.NoNeedForRePlan);
        });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isRePlanNeeded != IsRePlanNeededValues.NoNeedForRePlan}
            onRequestClose={() => {
                setIsRePlanNeeded(IsRePlanNeededValues.NoNeedForRePlan);
            }
        }>
            <View style={styles.modalView}>
                <Text style={styles.titleText}>Let me help!</Text>
                <Text style={styles.contentText}>
                    I see the last few trainings were {isRePlanNeeded === IsRePlanNeededValues.ToEasy ? 'easy' : 'difficult'} for you.
                    Would you like us to readujst your training plan?
                </Text>
                <View style={{flexDirection:"row", alignSelf:"center"}}>
                    {isLoading ? 
                        <ActivityIndicator size="large" color={appTheme.colors.themeColor} style={{marginTop: 30}} /> 
                        : 
                        <>
                            <Pressable
                                style={[styles.button, {backgroundColor: "#78CFE4"}]}
                                onPress={() => rePlan()}>
                                <Text>Yes</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, {backgroundColor: "red"}]}
                                onPress={() => setIsRePlanNeeded(IsRePlanNeededValues.NoNeedForRePlan)}>
                                <Text>No</Text>
                            </Pressable>
                        </>
                    }
                </View>
            </View>
        </Modal>
    )
}

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
    titleText: {
        fontWeight: "bold", 
        fontSize: 25,
        color: "#2f93ab",
    },
    contentText: {
        marginVertical: 20,
        fontSize: 18,
        lineHeight:30
    },
    button: {
      borderRadius: 5,
      padding: 8,
      marginHorizontal:30,
      flex: 1,
      alignItems: "center"
    }

});