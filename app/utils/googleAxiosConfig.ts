import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {getGoogleAccessTokenFromAsyncStorage, saveGoogleAccessTokenInAsyncStorage} from "@/app/utils/AsyncStorageUtil";
import {GoogleSignin} from "@react-native-google-signin/google-signin";

let isRefreshing = false;
let failedQueue: ((token: string) => void)[] = [];

const headers = {
    'Content-Type': 'application/json'
};

const googleApi = axios.create({
    headers: {...headers}
});

googleApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await getGoogleAccessTokenFromAsyncStorage();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    return config;
});

export const getAllDataSource = async () => {//todo:to delete after det all needed data from google fit
    googleApi.get('https://www.googleapis.com/fitness/v1/users/me/dataSources')
        .then(value => console.log("All Data Source: ", value))
        .catch(reason => console.log("failed to get all Data Source: ", reason));
}

// export async function getRunningSessionsPerDay() {//todo:to delete after det all needed data from google fit
//     const startTime = Date.now() - 90 * 24 * 60 * 60 * 1000; // Last 90 days
//     const endTime = Date.now();
//     const response = await googleApi.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
//         body: JSON.stringify({
//             aggregateBy: [
//                 { dataTypeName: 'com.google.activity.segment' },
//                 { dataSourceId: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments' },
//                 { dataSourceId: 'raw:com.google.activity.segment:com.google.android.apps.fitness:user_input' }
//             ],
//             bucketByTime: { durationMillis: 86400000 }, // One day in milliseconds
//             startTimeMillis: startTime,
//             endTimeMillis: endTime,
//         }),
//     });
//
//     const data = await response.data;
//     const runningSessions: {
//         startTime: any; endTime: any; duration: number; // Convert to milliseconds
//         dataSourceId: any;
//     }[] = [];
//
//     data.bucket.forEach((bucket: { dataset: any[]; }) => {
//         bucket.dataset.forEach(dataset => {
//             dataset.points.forEach((point: { dataTypeName: string; value: { intVal: number; }[]; startTimeNanos: number; endTimeNanos: number; }) => {
//                 if (point.dataTypeName === 'com.google.activity.segment' && point.value[0].intVal === 8) { // Running activity
//                     const session = {
//                         startTime: point.startTimeNanos,
//                         endTime: point.endTimeNanos,
//                         duration: (point.endTimeNanos - point.startTimeNanos) / 1e6, // Convert to milliseconds
//                         dataSourceId: dataset.dataSourceId,
//                     };
//                     runningSessions.push(session);
//                 }
//             });
//         });
//     });
//
//     console.log("runningSessions: ===>>>>> ", runningSessions);
//
//     return runningSessions;
// }

googleApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if ((error.response?.status === 401 || error.response?.status === 403)) {
            if (!isRefreshing) {
                console.log("Google Access token expired... About to refresh the google access token")
                isRefreshing = true;
                try {
                    const newAccessToken = await onGoogleAccessTokenExpired();
                    retryFailedRequests(newAccessToken!);
                    originalRequest!.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest!);
                } catch (refreshError) {
                    console.error('Error refreshing google access token:', refreshError);
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            } else {
                return new Promise((resolve, reject) => {
                    failedQueue.push((token: string) => {
                        originalRequest!.headers.Authorization = `Bearer ${token}`;
                        resolve(axios(originalRequest!));
                    });
                });
            }
        }
        return Promise.reject(error);
    }
);

const retryFailedRequests = (newAccessToken: string) => {
    failedQueue.forEach(callback => callback(newAccessToken));
    failedQueue = [];
};

const onGoogleAccessTokenExpired = async (): Promise<string> => {
    try {
        // Try to silently sign in and get the new access token
        const userInfo = await GoogleSignin.signInSilently();

        const newGoogleTokens = await GoogleSignin.getTokens();
        await saveGoogleAccessTokenInAsyncStorage(newGoogleTokens.accessToken);
        console.log("Finished to refresh the google access token... the new token is: ", newGoogleTokens.accessToken)
        // setGoogleAccessTokenState(newGoogleTokens.accessToken);
        return newGoogleTokens.accessToken;
    } catch (error) {
        console.error('Failed to refresh Google access token:', error);
        throw error;
    }
};

export default googleApi
