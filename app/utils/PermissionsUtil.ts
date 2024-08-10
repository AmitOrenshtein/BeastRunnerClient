import {PermissionsAndroid, Platform} from 'react-native';

export const requestActivityRecognitionPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        if (Platform.Version >= 29) { // Android 10+ (API level 29)
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
                    {
                        title: "Activity Recognition Permission",
                        message: "This app needs access to your physical activity to track your fitness.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            // For Android 9 (API level 28) and below, no need to request manually
            console.log('For Android 9 (API level 28) and below, No need to request activity recognition permission');
            return true;
        }
    } else {
        // Non-Android platforms (iOS, web) don't need this permission
        console.log('Non-Android platforms (iOS, web), No need to request activity recognition permission');
        return true;
    }
};
