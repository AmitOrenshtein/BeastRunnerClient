import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getAccessTokenFromAsyncStorage, getUserIdFromAsyncStorage} from "@/app/utils/AsyncStorageUtil";

interface AccessTokenAndUserIdContextProps {
    accessTokenState: string | null;
    setAccessToken: (token: string | null) => void;
    userIdState: string | null;
    setUserId: (userId: string | null) => void;
}

const AccessTokenAndUserIdContext = createContext<AccessTokenAndUserIdContextProps>({
    accessTokenState: null,
    setAccessToken: () => {
    },
    userIdState: null,
    setUserId: () => {
    }
});

export const AccessTokenAndUserIdProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
    const [userIdState, setUserIdState] = useState<string | null>(null);


    useEffect(() => {
        const loadAccessTokenAndUserId = async () => {
            const token = await getAccessTokenFromAsyncStorage();
            setAccessTokenState(token);
            const userId = await getUserIdFromAsyncStorage();
            setUserIdState(userId);
        };
        loadAccessTokenAndUserId();
    }, []);


    const setAccessToken = async (token: string | null) => {
        // (token !== null && token !== undefined && token !== "") ?
        //     await saveAccessTokenInAsyncStorage(token) :
        //     await clearAccessTokenFromAsyncStorage();
        setAccessTokenState(token);
    };

    const setUserId = async (userId: string | null) => {
        // (userId !== null && userId !== undefined && userId !== "") ?
        //     await saveUserIdInAsyncStorage(userId) :
        //     await clearUserIdFromAsyncStorage();
        setUserIdState(userId);
    };

    return (
        <AccessTokenAndUserIdContext.Provider
            value={{accessTokenState, setAccessToken: setAccessToken, userIdState: userIdState, setUserId: setUserId}}>
            {children}
        </AccessTokenAndUserIdContext.Provider>
    );
};

export const useAccessTokenAndUserId = () => useContext(AccessTokenAndUserIdContext);
