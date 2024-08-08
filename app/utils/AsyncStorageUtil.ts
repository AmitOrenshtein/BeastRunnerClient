import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessTokenFromAsyncStorage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        console.error('Error getting access token from AsyncStorage', error);
        return null;
    }
};

export const getRefreshTokenFromAsyncStorage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
        console.error('Error getting refresh token from AsyncStorage', error);
        return null;
    }
};

export const getIdTokenFromAsyncStorage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('idToken');
    } catch (error) {
        console.error('Error getting id token from AsyncStorage', error);
        return null;
    }
};

export const getUserIdFromAsyncStorage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('userId');
    } catch (error) {
        console.error('Error getting user id from AsyncStorage', error);
        return null;
    }
};

export const saveAccessTokenInAsyncStorage = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
        console.error('Error saving access token in AsyncStorage', error);
    }
};

export const saveRefreshTokenInAsyncStorage = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('refreshToken', token);
    } catch (error) {
        console.error('Error saving refresh token in AsyncStorage', error);
    }
};

export const saveIdTokenInAsyncStorage = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('idToken', token);
    } catch (error) {
        console.error('Error saving id token in AsyncStorage', error);
    }
};

export const saveUserIdInAsyncStorage = async (userId: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('userId', userId);
    } catch (error) {
        console.error('Error saving user id in AsyncStorage', error);
    }
};

export const clearAccessTokenFromAsyncStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('accessToken');
    } catch (error) {
        console.error('Error removing access token from AsyncStorage', error);
    }
};

export const clearUserIdFromAsyncStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('userId');
    } catch (error) {
        console.error('Error removing user id from AsyncStorage', error);
    }
};



export const clearAllDataFromAsyncStorage = async (): Promise<void> => {
    try {
       await AsyncStorage.clear();
        // await AsyncStorage.multiRemove(['accessToken','refreshToken','idToken', 'userId']);
    } catch (error) {
        console.error('Error removing all data from AsyncStorage', error);
    }
};
