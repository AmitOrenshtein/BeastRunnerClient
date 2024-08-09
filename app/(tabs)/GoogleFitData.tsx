import {StyleSheet, View, Text, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import GoogleFit from 'react-native-google-fit';
import {useGoogleFit} from "@/app/context/GoogleFitContext";
import Theme from "@/appTheme";
import {useAccessTokenAndUserId} from "@/app/context/IdentifiersContext";

export default function GoogleFitData() {
    const {accessTokenState, userIdState, setUserId, setAccessToken} = useAccessTokenAndUserId();
    const [isAuthorizedToGoogleFit, setIsAuthorizedToGoogleFit] = useState(false);
    const [googleFitData, setGoogleFitData] = useState({});
    const {
        getAllDailyRunningSessions,
        getAllDailyWalkingSessions,
        getDailyDistance,
        getDailyMovementMinutes,
        getDailyStepsNumber,
        getCurrentWeight,
        getCurrentHeight, getAverageHeartRate
    } = useGoogleFit();



    useEffect(() => {
        if (GoogleFit.isAuthorized) {
            setIsAuthorizedToGoogleFit(true);
            fetchGoogleFitData();
        } else (
            console.log("GoogleFit.isAuthorized = false")
        )
    }, []);

    // const fetchGoogleFitData = async () => {
    //     try {
    //         const startTime = '2023-01-01T00:00:17.971Z';
    //         const endTime = new Date().toISOString();
    //
    //         const height = await getCurrentHeight(startTime, endTime);
    //         const currentWeight = await getCurrentWeight(startTime, endTime);
    //         const distance = await getDailyDistance(startTime, endTime);
    //         const steps = await getDailyStepsNumber(startTime, endTime);
    //         const movementMinutes = await getDailyMovementMinutes(startTime, endTime);
    //         const runningSessions = await getAllDailyRunningSessions(startTime, endTime);
    //         const walkingSessions = await getAllDailyWalkingSessions(startTime, endTime);
    //         const heartRate = await getAverageHeartRate(startTime, endTime);
    //
    //         setGoogleFitData({
    //             height: height,
    //             currentWeight: currentWeight.reverse().pop()?.value,
    //             weights: currentWeight.map(item => item.value),
    //             distance: distance,
    //             steps: steps,
    //             movementMinutes: movementMinutes,
    //             runningSessions,
    //             walkingSessions,
    //             heartRate: heartRate
    //         });
    //     } catch (error) {
    //         console.log("Google Fit data fetch error: ", error);
    //     }
    // };


    const fetchGoogleFitData = async () => {
        try {
            const startTime = '2023-01-01T00:00:17.971Z';
            const endTime = new Date().toISOString();
            // getCurrentHeight(startTime, endTime).then(res => setGoogleFitData(res.pop()?.value || 0));
            // getCurrentWeight(startTime, endTime).then(res => alert("weight: "+res));
            // getDailyDistance(startTime, endTime).then(res => console.log("distance: ",res));
            // getDailyStepsNumber(startTime, endTime).then(res => console.log("steps: ",res));
            // getDailyMovementMinutes(startTime, endTime).then(res => console.log("movement_minutes: ",res));
            // getAllDailyRunningSessions(startTime, endTime).then(res => console.log("running sessions: ",res));
            // getAllDailyWalkingSessions(startTime, endTime).then(res => console.log("walking sessions: ",res));
            // getAverageHeartRate(startTime, endTime).then(res => console.log("heart_rate: ",res));
            getCurrentHeight(startTime, endTime).then(res => console.log("height: ", res));
            getCurrentWeight(startTime, endTime).then(res => console.log("weight: ", res));
            getDailyDistance(startTime, endTime).then(res => console.log("distance: ", res));
            getDailyStepsNumber(startTime, endTime).then(res => console.log("steps: ", res));
            getDailyMovementMinutes(startTime, endTime).then(res => console.log("movement_minutes: ", res));
            getAllDailyRunningSessions(startTime, endTime).then(res => console.log("running sessions: ", res));
            getAllDailyWalkingSessions(startTime, endTime).then(res => console.log("walking sessions: ", res));
            getAverageHeartRate(startTime, endTime).then(res => console.log("heart_rate: ", res));
        } catch (error) {
            console.log("Google Fit data fetch error: ", error);
        }
    };


    return (
        isAuthorizedToGoogleFit && (
            <Text>{JSON.stringify(googleFitData)}</Text>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Theme.colors.white,
    },
    text: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10,
    },
});
