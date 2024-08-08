import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {getAccessTokenFromAsyncStorage} from "@/app/utils/AsyncStorageUtil";
import {useRefreshToken} from "@/serverAPI/AuthAPI";

const headers = {
    'Content-Type': 'application/json'
};

const api = axios.create({
    // baseURL: process.env.RAECT_APP_SERVER_URL || "http://localhost:8000/",//TODO:!!!
    baseURL: process.env.RAECT_APP_SERVER_URL || 'http://YOUR_COMPUTER_IP:8000/',// YOUR_COMPUTER_IP when running on physical device,
    headers: {...headers}
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (!authBypass(config)) {
        const token = await getAccessTokenFromAsyncStorage();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

function authBypass(config: InternalAxiosRequestConfig) {
    return config.url!.startsWith('/auth/refresh') || config.url!.startsWith('/auth/logout');
}

let isRefreshing = false;
let failedQueue: ((token: string) => void)[] = [];

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if ((error.response?.status === 401 || error.response?.status === 403) && originalRequest?.url !== "/auth/login") {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await useRefreshToken();
                    const newAccessToken = await getAccessTokenFromAsyncStorage();
                    retryFailedRequests(newAccessToken!);
                    originalRequest!.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest!);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
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

// defining a custom error handler for all APIs
const errorHandler = (error: { response: { status: any }; code: string }) => {
    const statusCode = error.response?.status;

    if (error.code === "ERR_CANCELED") {
        alert("api canceled");
        return Promise.resolve();
    }

    // logging only errors that are not 401
    if (statusCode && statusCode !== 401) {
        console.error(error);
    }

    return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
    return errorHandler(error);
});

export default api;
