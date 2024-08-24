import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {formatMillisToDateTime, SessionData, useGoogleFit} from "@/app/context/GoogleFitContext";


const GoogleFitData = () => {
    const {
        googleAccessTokenState,
        getHeightSummary,
        getCurrentHeight,
        getWeightSummary,
        getCurrentWeight,
        fetchSessionsDataFromGoogleFit
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
                const startTime = Date.now() - 60 * 24 * 60 * 60 * 1000; // Last 60 days
                const endTime = Date.now();
                const lastNinetyDays = Date.now() - 90 * 24 * 60 * 60 * 1000; // Last 90 days

                // Fetch data from Google Fit API
                const [
                    heightSummary,
                    currentHeight,
                    weightSummary,
                    currentWeight,
                    fetchedSessions
                ] = await Promise.all([
                    getHeightSummary(lastNinetyDays, endTime),
                    getCurrentHeight(lastNinetyDays, endTime),
                    getWeightSummary(lastNinetyDays, endTime),
                    getCurrentWeight(lastNinetyDays, endTime),
                    fetchSessionsDataFromGoogleFit(startTime, endTime)
                ]);

                // Set fetched data
                setData({
                    heightSummary,
                    currentHeight,
                    weightSummary,
                    currentWeight,
                    fetchedSessions,
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
                    <Text style={styles.title}>Height Summary:</Text>
                    <Text>{JSON.stringify(data.heightSummary)}</Text>

                    <Text style={styles.title}>Current Height :</Text>
                    <Text>{JSON.stringify(data.currentHeight)}</Text>

                    <Text style={styles.title}>Weight Summary:</Text>
                    <Text>{JSON.stringify(data.weightSummary)}</Text>

                    <Text style={styles.title}>Current Weight :</Text>
                    <Text>{JSON.stringify(data.currentWeight)}</Text>

                    <Text style={styles.title}>Fetched Sessions:</Text>
                    {data.fetchedSessions.map((session: SessionData, index: React.Key | null | undefined) => (
                        <View key={index}>
                            <Text>***************************************</Text>
                            <Text>Activity Type: {session.activityType}</Text>
                            <Text>Duration: {session.duration} minutes</Text>
                            <Text>Start Time: {formatMillisToDateTime(session.startTime.toString())}</Text>
                            <Text>End Time: {formatMillisToDateTime(session.endTime.toString())}</Text>
                            <Text>Distance: {session.distance} meter</Text>
                            <Text>Heart Points: {session.heartPoints}</Text>
                            <Text>Calories: {session.calories} kcal</Text>
                            <Text>Steps Count: {session.stepsCount} steps</Text>
                            <Text>Speed: {session.speed}</Text>
                        </View>
                    ))}
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
