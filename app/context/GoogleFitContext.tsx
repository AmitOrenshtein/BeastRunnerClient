import React, {createContext, useContext, useEffect, useState} from 'react';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import {getGoogleAccessTokenFromAsyncStorage} from "@/app/utils/AsyncStorageUtil";
import googleApi from "@/app/utils/googleAxiosConfig";


// Define types for session data
export interface SessionData {
    activityType: string;
    duration: number; // In minutes
    startTime: number; //In milliseconds
    endTime: number; //In milliseconds
    distance: number; // In meters
    heartPoints: number;
    calories: number;
    stepsCount: number;
    speed: string;
}

// Map of Google Fit activity types
const activityTypes: { [key: number]: string } = {
    8: "Running",
    57: "Running on sand",
    58: "Running (treadmill)",
    7: "Walking",
    93: "Walking (fitness)",
    95: "Walking (treadmill)",

};

export interface WeightData {
    date: string;
    weight: number;
}

export interface HeightData {
    date: string;
    height: number;
}


export const formatMillisToDateTime = (millisSeconds: string): string => {
    const date = new Date(parseInt(millisSeconds));

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} (${hours}:${minutes})`;
};

interface GoogleFitContextProps {
    googleAccessTokenState: string | null;
    setGoogleAccessToken: (token: string | null) => void;
    configureGoogleFit: () => Promise<boolean>;
    getHeightSummary: (startTime: number, endTime: number) => Promise<any>;
    getCurrentHeight: (startTime: number, endTime: number) => Promise<any>;
    getWeightSummary: (startTime: number, endTime: number) => Promise<any>;
    getCurrentWeight:(startTime: number, endTime: number) => Promise<any>;
    fetchSessionsDataFromGoogleFit: (startTime: number, endTime: number) => Promise<SessionData[]>;
}

const GoogleFitContext = createContext<GoogleFitContextProps | undefined>({
    googleAccessTokenState: null,
    setGoogleAccessToken: () => {
    },
    configureGoogleFit: async () => false,
    getHeightSummary: async () => [],
    getCurrentHeight: async () => [],
    getWeightSummary: async () => [],
    getCurrentWeight: async () => [],
    fetchSessionsDataFromGoogleFit: async () => []
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

    async function fetchData(dataType: string, dataSourceId: string, startTime: number, endTime: number) {
        console.log("about to fetch " + dataType + " from google fit.");
        return new Promise((resolve, reject) => {
            googleApi.post(
                `https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
                {
                    aggregateBy: [
                        {
                            dataTypeName: dataType,
                        }
                    ],
                    bucketByTime: {durationMillis: 86400000},//bucket by day
                    startTimeMillis: startTime,
                    endTimeMillis: endTime,
                },
            ).then((response) => {
                console.log("finished to fetch " + dataType + " for google fit: ", response.data);
                resolve(response.data);
            }).catch(error => {
                console.error(`Error fetching data for ${dataType}:`, error);
                reject(error);
            })
        })
    }

    async function fetchSessionsDataFromGoogleFit(startTimeMillis: number, endTimeMillis: number): Promise<SessionData[]> {
        console.log("about to fetch google fit sessions data from google fit.");
        return new Promise<SessionData[]>((resolve, reject) => {
            googleApi.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                {
                    aggregateBy: [
                        {
                            dataTypeName: "com.google.distance.delta"
                        },
                        {
                            dataTypeName: "com.google.active_minutes"
                        },
                        {
                            dataTypeName: "com.google.heart_minutes"
                        },
                        {
                            dataTypeName: "com.google.calories.expended"
                        },
                        {
                            dataTypeName: "com.google.step_count.delta"
                        },
                        {
                            dataTypeName: "com.google.speed"
                        }
                    ],
                    bucketBySession: {"minDurationMillis": 1},
                    startTimeMillis: startTimeMillis.toString(),
                    endTimeMillis: endTimeMillis.toString()
                }).then((response) => {
                console.log("aaaaa: ", response)
                const sessionData: SessionData[] = mapResponseToSessionData(response.data);
                resolve(sessionData);
            }).catch(error => {
                console.error('Error retrieving Google Fit sessions data:', error);
                reject(error);
            })
        });
    }

    function mapResponseToSessionData(response: any): SessionData[] {
        return response.bucket.map((bucket: any) => {
            const session = bucket.session;
            const activityType = activityTypes[session.activityType] || "Unknown";
            const startTime = session.startTimeMillis;
            const endTime = session.endTimeMillis;

            let distance = 0;
            let heartPoints = 0;
            let calories = 0;
            let stepsCount = 0;
            let duration = 0;
            let speed = '';

            bucket.dataset.forEach((dataset: any) => {
                dataset.point.forEach((point: any) => {
                    switch (point.dataTypeName) {
                        case "com.google.distance.delta":
                            distance = point.value[0].fpVal;
                            break;
                        case "com.google.heart_minutes.summary":
                            duration = point.value[1]?.intVal || 0; // Use the integer value for duration
                            heartPoints = point.value[0]?.fpVal || 0;
                            break;
                        case "com.google.calories.expended":
                            calories = point.value[0].fpVal;
                            break;
                        case "com.google.step_count.delta":
                            stepsCount = point.value[0].intVal;
                            break;
                        case "com.google.speed.summary":
                            speed = `${point.value[0].fpVal} m/s`;
                            break;
                    }
                });
            });

            console.log([activityType, duration, startTime, endTime, distance, heartPoints, calories, stepsCount, speed]);

            return {
                activityType,
                duration,
                startTime,
                endTime,
                distance,
                heartPoints,
                calories,
                stepsCount,
                speed,
            } as SessionData;
        });
    }


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

    const transformWeightData = (data: any): WeightData[] => {
        return data.bucket.flatMap((bucket: any) =>
            bucket.dataset.flatMap((dataset: any) =>
                dataset.point.flatMap((point: any) =>
                    point.value.map((val: any) => ({
                        date: formatNanoToDateTime(point.startTimeNanos as string),
                        weight: val.fpVal || 0,
                    }))
                )
            )
        );
    };

    const transformHeightData = (data: any): HeightData[] => {
        return data.bucket.flatMap((bucket: any) =>
            bucket.dataset.flatMap((dataset: any) =>
                dataset.point.flatMap((point: any) =>
                    point.value.map((val: any) => ({
                        date: formatNanoToDateTime(point.startTimeNanos as string),
                        height: point.value[0]?.fpVal || 0,
                    }))
                )
            )
        );
    };

    // Function to convert nanoseconds to date with time (dd/mm/yyyy) (hh:mm)
    const formatNanoToDateTime = (nanoSeconds: string): string => {
        const millis = parseInt(nanoSeconds) / 1e6; // Convert nanoseconds to milliseconds
        return formatMillisToDateTime(millis.toString());
    };


    // Function to get weight summary
    const getWeightSummary = async (startTime: number, endTime: number): Promise<WeightData[]> => {
        return new Promise<WeightData[]>((resolve, reject) => {
            fetchData('com.google.weight', 'derived:com.google.weight:com.google.android.gms:merge_weight', startTime, endTime)
                .then((response) => {
                    resolve(transformWeightData(response));
                }).catch(error => reject(error));
        });
    };

    //The last weight from last 3 months, if the user didn't enter any weight in the last 3 months, so reject...
    const getCurrentWeight = async (startTime: number, endTime: number): Promise<WeightData> => {
        return new Promise<WeightData>((resolve, reject) => {
            getWeightSummary(startTime, endTime).then(response => {
                if(response.length > 0){
                    resolve(response.reverse()[0]);
                } else {
                    alert("We see you don't have an updated weight... Please enter your current weight in Google-Fit app");
                    reject(new Error("The user don't have any updated weight from the last 90 days in Google-Fit..."))
                }
            }).catch(error => reject(error))
        })
    }

    // Function to get height summary
    const getHeightSummary = async (startTime: number, endTime: number): Promise<HeightData[]> => {
        return new Promise<HeightData[]>((resolve, reject) => {
            fetchData('com.google.height', 'derived:com.google.height:com.google.android.gms:merge_height', startTime, endTime)
                .then(response => {
                    resolve(transformHeightData(response));
                }).catch(error => reject(error))
        });
    };

    //The last height from last 3 months, if the user didn't enter any height in the last 3 months, so reject...
    const getCurrentHeight = async (startTime: number, endTime: number): Promise<HeightData> => {
        return new Promise<HeightData>((resolve, reject) => {
            getHeightSummary(startTime, endTime).then(response => {
                if(response.length > 0){
                    resolve(response.reverse()[0]);
                } else {
                    alert("We see you don't have an updated height... Please enter your current height in Google-Fit app");
                    reject(new Error("The user don't have any updated height from the last 90 days in Google-Fit..."))
                }
            }).catch(error => reject(error))
        })
    }


    return (
        <GoogleFitContext.Provider
            value={{
                googleAccessTokenState,
                setGoogleAccessToken,
                configureGoogleFit,
                getHeightSummary,
                getCurrentHeight,
                getWeightSummary,
                getCurrentWeight,
                fetchSessionsDataFromGoogleFit
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
