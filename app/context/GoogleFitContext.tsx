import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import {getGoogleAccessTokenFromAsyncStorage} from "@/app/utils/AsyncStorageUtil";
import googleApi from "@/app/utils/googleAxiosConfig";

interface GoogleFitContextProps {
    googleAccessTokenState: string | null;
    setGoogleAccessToken: (token: string | null) => void;
    configureGoogleFit: () => Promise<boolean>;
    getAllRunningSessions: (startTime: number, endTime: number) => Promise<any>;
    getAllWalkingSessions: (startTime: number, endTime: number) => Promise<any>;
    getRunningSummary: (startTime: number, endTime: number) => Promise<any>;
    getCaloriesBurnedSummary: (startTime: number, endTime: number) => Promise<any>;
    getHeartPointSummary: (startTime: number, endTime: number) => Promise<any>;
    getMoveMinutesSummary: (startTime: number, endTime: number) => Promise<any>;
    getStepsCountSummary: (startTime: number, endTime: number) => Promise<any>;
    getHeightSummary: (startTime: number, endTime: number) => Promise<any>;
    getWeightSummary: (startTime: number, endTime: number) => Promise<any>;
    getDurationSummary: (startTime: number, endTime: number) => Promise<any>;
    getSpeedSummary: (startTime: number, endTime: number) => Promise<any>;
}

const GoogleFitContext = createContext<GoogleFitContextProps | undefined>({
    googleAccessTokenState: null,
    setGoogleAccessToken: () => {
    },
    configureGoogleFit: async () => false,
    getAllRunningSessions: async () => [],
    getAllWalkingSessions: async () => [],
    getRunningSummary: async () => [],
    getCaloriesBurnedSummary: async () => [],
    getHeartPointSummary: async () => [],
    getMoveMinutesSummary: async () => [],
    getStepsCountSummary: async () => [],
    getHeightSummary: async () => [],
    getWeightSummary: async () => [],
    getDurationSummary: async () => [],
    getSpeedSummary: async () => [],
});

const GoogleFitProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [googleAccessTokenState, setGoogleAccessTokenState] = useState<string | null>(null);


    useEffect(() => {
        const loadGoogleAccessToken = async () => {
            try {
                console.log("Loading google access token from AsyncStorage...");
                const googleAccessToken = await getGoogleAccessTokenFromAsyncStorage();
                console.log("GoogleAccess token loaded:", googleAccessToken);
                setGoogleAccessTokenState(googleAccessToken);
            } catch (error) {
                console.error("Failed to load google access token:", error);
            } finally {
                console.log("Loading in Google Fit Context has been finished");
            }
        };

        loadGoogleAccessToken();
    }, []);

    const fetchData = useCallback(async (dataType: string, dataSourceId: string, startTime: number, endTime: number) => {
        console.log("about to fetch " + dataType + " from google fit.");
        try {
            const response = await googleApi.post(
                `https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
                {
                    aggregateBy: [
                        {
                            dataTypeName: dataType,
                            dataSourceId: dataSourceId,
                        }
                    ],
                    bucketByTime: {durationMillis: endTime - startTime},
                    startTimeMillis: startTime,
                    endTimeMillis: endTime,
                },
            );
            console.log("finished to fetch " + dataType + " for google fit: ", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching data for ${dataType}:`, error);
            throw error;
        }
    }, [googleAccessTokenState]);


    const setGoogleAccessToken = (token: string | null) => {
        setGoogleAccessTokenState(token);
    };

    const configureGoogleFit = async () => {
        const options = {
            scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_BODY_READ,
                Scopes.FITNESS_LOCATION_READ,
                Scopes.FITNESS_HEART_RATE_READ,
                Scopes.FITNESS_REPRODUCTIVE_HEALTH_READ
            ],
        };

        const result = await GoogleFit.authorize(options);
        if (result.success) {
            console.log("authorized successfully to google-fit");
            return true;
        } else {
            console.log('Google Fit authorization failed');
            return false;
        }
    };

    // Function to get all running sessions
    const getAllRunningSessions = async (startTime: number, endTime: number): Promise<any> => {
        const runningDataSourceId = 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments';
        return fetchData('com.google.running', runningDataSourceId, startTime, endTime);
    };

    // Function to get all walking sessions
    const getAllWalkingSessions = async (startTime: number, endTime: number): Promise<any> => {
        const walkingDataSourceId = 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments';
        return fetchData('com.google.walking', walkingDataSourceId, startTime, endTime);
    };

    // Function to get running summary
    const getRunningSummary = async (startTime: number, endTime: number): Promise<any> => {
        const runningSummaryDataSourceId = 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments';
        return fetchData('com.google.activity.summary', runningSummaryDataSourceId, startTime, endTime);
    };


    // Function to get walking summary
    const getWalkingSummary = async (startTime: number, endTime: number): Promise<any> => {
        const walkingSummaryDataSourceId = 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments';
        const data = await fetchData('com.google.activity.summary', walkingSummaryDataSourceId, startTime, endTime);

        // Filter the data for walking activity type (Google Fit activity type for walking is 7)
        const walkingData = data.bucket.filter((item: any) => item.value[0].intVal === 7);

        return data;
    };

    // Function to get calories burned summary
    const getCaloriesBurnedSummary = async (startTime: number, endTime: number): Promise<any> => {
        const caloriesBurnedDataSourceId = 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended';
        return fetchData('com.google.calories.expended', caloriesBurnedDataSourceId, startTime, endTime);
    };

    // Function to get heart points summary
    const getHeartPointSummary = async (startTime: number, endTime: number): Promise<any> => {
        const heartPointsDataSourceId = 'derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes';
        return fetchData('com.google.heart_minutes.summary', heartPointsDataSourceId, startTime, endTime);
    };

    // Function to get move minutes summary
    const getMoveMinutesSummary = async (startTime: number, endTime: number): Promise<any> => {
        const moveMinutesDataSourceId = 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes';
        return fetchData('com.google.active_minutes', moveMinutesDataSourceId, startTime, endTime);
    };

    // Function to get steps count summary
    const getStepsCountSummary = async (startTime: number, endTime: number): Promise<any> => {
        const stepsCountDataSourceId = 'derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas';
        return fetchData('com.google.step_count.delta', stepsCountDataSourceId, startTime, endTime);
    };


    // Function to get height summary
    const getHeightSummary = async (startTime: number, endTime: number): Promise<any> => {
        const heightDataSourceId = 'derived:com.google.height:com.google.android.gms:merge_height';
        return fetchData('com.google.height.summary', heightDataSourceId, startTime, endTime);
    };

    // Function to get weight summary
    const getWeightSummary = async (startTime: number, endTime: number): Promise<any> => {
        const weightDataSourceId = 'derived:com.google.weight:com.google.android.gms:merge_weight';
        return fetchData('com.google.weight.summary',weightDataSourceId, startTime, endTime);
    };

    // Function to get duration summary
    const getDurationSummary = async (startTime: number, endTime: number): Promise<any> => {
        const durationDataSourceId = 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes';
        return fetchData('com.google.duration', durationDataSourceId, startTime, endTime);
    };

    // Function to get speed summary
    const getSpeedSummary = async (startTime: number, endTime: number): Promise<any> => {
        const speedDataSourceId = 'derived:com.google.speed:com.google.android.gms:merge_speed';
        return fetchData('com.google.speed.summary', speedDataSourceId, startTime, endTime);
    };

    return (
        <GoogleFitContext.Provider
            value={{
                googleAccessTokenState,
                setGoogleAccessToken,
                configureGoogleFit,
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
            }}
        >
            {children}
        </GoogleFitContext.Provider>
    );
};

const useGoogleFit = (): GoogleFitContextProps => {
    const context = useContext(GoogleFitContext);
    if (!context) {
        throw new Error('useGoogleFit must be used within a GoogleFitProvider');
    }
    return context;
};



export {GoogleFitProvider, useGoogleFit};
