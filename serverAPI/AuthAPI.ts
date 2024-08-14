import api from "@/serverAPI/config/axiosConfig";
import {Tokens} from "@/app/types/tokens";
import {IUser} from "@/app/types/user";
import {
    getRefreshTokenFromAsyncStorage,
    saveAccessTokenInAsyncStorage,
    saveRefreshTokenInAsyncStorage
} from "@/app/utils/AsyncStorageUtil";

export const googleSignin = (idToken: string) => {
    console.log("In googleSignin server func...")
    return new Promise<IUser>((resolve, reject) => {
        api.post("/auth/google", {idToken: idToken})
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });
}

export function useRefreshToken(): Promise<Tokens> {
    return new Promise<Tokens>(async (resolve, reject) => {
        const refreshToken = await getRefreshTokenFromAsyncStorage();
        api.get('/auth/refresh', {
            headers: {'Authorization': `Bearer ${refreshToken}`}
        })
            .then(async response => {
                //Todo: use multiset instead...
                await saveRefreshTokenInAsyncStorage(response.data.refreshToken);
                await saveAccessTokenInAsyncStorage(response.data.accessToken);
                resolve(response.data);
            })
            .catch((error) => reject(error));
    });
}

export function logoutFromServer(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        const refreshToken = await getRefreshTokenFromAsyncStorage();
        api.get('/auth/logout', {
            headers: {'Authorization': `Bearer ${refreshToken}`}
        })
            .then(response => {
                console.log("Successes to logout from server..")
                resolve(response.data);
            })
            .catch((error) => {
                reject(error)
            });
    });
}
