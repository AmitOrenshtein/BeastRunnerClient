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

googleApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if ((error.response?.status === 401 || error.response?.status === 403)) {
            if (!isRefreshing) {
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
        // setGoogleAccessTokenState(newGoogleTokens.accessToken);
        return newGoogleTokens.accessToken;
    } catch (error) {
        console.error('Failed to refresh Google access token:', error);
        throw error;
    }
};

export default googleApi
