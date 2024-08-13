import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getAccessTokenFromAsyncStorage, getUserIdFromAsyncStorage} from "@/app/utils/AsyncStorageUtil";
import {Text, View} from "react-native";

interface AccessTokenAndUserIdContextProps {
    accessTokenState: string | null;
    setAccessToken: (token: string | null) => void;
    userIdState: string | null;
    setUserId: (userId: string | null) => void;
    loading: boolean;
}

const AccessTokenAndUserIdContext = createContext<AccessTokenAndUserIdContextProps>({
    accessTokenState: null,
    setAccessToken: () => {
    },
    userIdState: null,
    setUserId: () => {
    },
    loading: true,
});

export const AccessTokenAndUserIdProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
    const [userIdState, setUserIdState] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        const loadAccessTokenAndUserId = async () => {
            try {
                console.log("Loading access token and user ID from AsyncStorage...");
                const token = await getAccessTokenFromAsyncStorage();
                const userId = await getUserIdFromAsyncStorage();

                console.log("Access token loaded:", token);
                console.log("User ID loaded:", userId);

                setAccessTokenState(token);
                setUserIdState(userId);
            } catch (error) {
                console.error("Failed to load access token and user ID:", error);
            } finally {
                console.log("Loading in Context has been finished");
                setLoading(false); // Set loading to false when done
            }
        };

        loadAccessTokenAndUserId();
    }, []);

    const setAccessToken = (token: string | null) => {
        setAccessTokenState(token);
    };

    const setUserId = (userId: string | null) => {
        setUserIdState(userId);
    };

    if (loading) {
        // Render a loading spinner while loading
        return <LoadingSpinner/>; // Replace with your loading component
    }

    return (
        <AccessTokenAndUserIdContext.Provider
            value={{accessTokenState, setAccessToken, userIdState, setUserId, loading}}>
            {children}
        </AccessTokenAndUserIdContext.Provider>
    );
};

export const useAccessTokenAndUserId = () => useContext(AccessTokenAndUserIdContext);

const LoadingSpinner = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
    </View>
);
