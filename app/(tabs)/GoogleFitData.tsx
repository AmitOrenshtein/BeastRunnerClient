import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useGoogleFit} from "@/app/context/GoogleFitContext";
import {getAllDataSource} from "@/app/utils/googleAxiosConfig";


const GoogleFitData = () => {
    const {
        googleAccessTokenState,
        getAllRunningSessions,
        getAllWalkingSessions,
        getRunningSummary,
        getCaloriesBurnedSummary,
        getHeartPointSummary,
        getMoveMinutesSummary,
        getStepsCountSummary,
        getHeightSummary,
        getWeightSummary,
        getDurationSummary,
        getSpeedSummary,
    } = useGoogleFit();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!googleAccessTokenState) {
            setError('Google Access Token is missing.');
            //setLoading(false);
            return;
        }

        const fetchGoogleFitData = async () => {
            try {
                await getAllDataSource();//todo:to delete after det all needed data from google fit

                const startTime = Date.now() - 90 * 24 * 60 * 60 * 1000; // Last 90 days
                const endTime = Date.now();

                // Fetch data from Google Fit API
                const [
                    runningSessions,
                    walkingSessions,
                    runningSummary,
                    caloriesBurnedSummary,
                    heartPointSummary,
                    moveMinutesSummary,
                    stepsCountSummary,
                    heightSummary,
                    weightSummary,
                    durationSummary,
                    speedSummary,
                ] = await Promise.all([
                    getAllRunningSessions(startTime, endTime),
                    getAllWalkingSessions(startTime, endTime),
                    getRunningSummary(startTime, endTime),
                    getCaloriesBurnedSummary(startTime, endTime),
                    getHeartPointSummary(startTime, endTime),
                    getMoveMinutesSummary(startTime, endTime),
                    getStepsCountSummary(startTime, endTime),
                    getHeightSummary(startTime, endTime),
                    getWeightSummary(startTime, endTime),
                    getDurationSummary(startTime, endTime),
                    getSpeedSummary(startTime, endTime),
                ]);

                // Set fetched data
                setData({
                    runningSessions,
                    walkingSessions,
                    runningSummary,
                    caloriesBurnedSummary,
                    heartPointSummary,
                    moveMinutesSummary,
                    stepsCountSummary,
                    heightSummary,
                    weightSummary,
                    durationSummary,
                    speedSummary,
                });
            } catch (err) {
                console.error('Error fetching Google Fit data:', err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchGoogleFitData();
    }, []);

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            {data ? (
                <ScrollView>
                    <Text style={styles.title}>Running Sessions:</Text>
                    <Text>{JSON.stringify(data.runningSessions)}</Text>

                    <Text style={styles.title}>Walking Sessions:</Text>
                    <Text>{JSON.stringify(data.walkingSessions)}</Text>

                    <Text style={styles.title}>Running Summary:</Text>
                    <Text>{JSON.stringify(data.runningSummary)}</Text>

                    <Text style={styles.title}>Walking Summary:</Text>
                    <Text>{JSON.stringify("Needs to implement")}</Text>

                    <Text style={styles.title}>Calories Burned Summary:</Text>
                    <Text>{JSON.stringify(data.caloriesBurnedSummary)}</Text>

                    <Text style={styles.title}>Heart Points Summary:</Text>
                    <Text>{JSON.stringify(data.heartPointSummary)}</Text>

                    <Text style={styles.title}>Move Minutes Summary:</Text>
                    <Text>{JSON.stringify(data.moveMinutesSummary)}</Text>

                    <Text style={styles.title}>Steps Count Summary:</Text>
                    <Text>{JSON.stringify(data.stepsCountSummary)}</Text>

                    <Text style={styles.title}>Height Summary:</Text>
                    <Text>{JSON.stringify(data.heightSummary)}</Text>

                    <Text style={styles.title}>Weight Summary:</Text>
                    <Text>{JSON.stringify(data.weightSummary)}</Text>

                    <Text style={styles.title}>Duration Summary:</Text>
                    <Text>{JSON.stringify(data.durationSummary)}</Text>

                    <Text style={styles.title}>Speed Summary:</Text>
                    <Text>{JSON.stringify(data.speedSummary)}</Text>
                </ScrollView>
            ) : (
                <Text>No data available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default GoogleFitData;

const LoadingSpinner = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
    </View>
);