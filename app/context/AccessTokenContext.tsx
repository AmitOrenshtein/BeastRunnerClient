import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessTokenContextProps {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

const AccessTokenContext = createContext<AccessTokenContextProps>({
    accessToken: null,
    setAccessToken: () => {},
});

export const AccessTokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);

    useEffect(() => {
        const loadAccessToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            setAccessTokenState(token);
        };
        loadAccessToken();
    }, []);

    const setAccessTokenn = async (token: string | null) => {
        if (token) {
            await AsyncStorage.setItem('accessToken', token);
        } else {
            await AsyncStorage.removeItem('accessToken');
        }
        setAccessTokenState(token);
    };

    return (
        <AccessTokenContext.Provider value={{ accessToken, setAccessToken: setAccessTokenn }}>
            {children}
        </AccessTokenContext.Provider>
    );
};

export const useAccessToken = () => useContext(AccessTokenContext);
