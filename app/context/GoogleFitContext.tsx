import React, {createContext, useContext} from 'react';
import GoogleFit, {
    ActivitySampleResponse,
    AggregatedHeartRateResponse,
    BucketUnit,
    DistanceResponse,
    HeightResponse,
    MoveMinutesResponse, Scopes,
    StepsResponse,
    WeightResponse
} from 'react-native-google-fit';

interface GoogleFitContextProps {
    configureGoogleFit: () => Promise<boolean>;
    getDailyStepsNumber: (startDate: string, endDate: string) => Promise<StepsResponse[]>;
    getDailyDistance: (startDate: string, endDate: string) => Promise<DistanceResponse[]>;
    getAllDailyRunningSessions: (startDate: string, endDate: string) => Promise<RunningSession[]>;
    getAllDailyWalkingSessions: (startDate: string, endDate: string) => Promise<WalkingSession[]>;
    getCurrentWeight: (startDate: string, endDate: string) => Promise<WeightResponse[]>;
    getCurrentHeight: (startDate: string, endDate: string) => Promise<HeightResponse[]>;
    getDailyMovementMinutes: (startDate: string, endDate: string) => Promise<MoveMinutesResponse[]>;
    getAverageHeartRate: (startDate: string, endDate: string) => Promise<AggregatedHeartRateResponse[]>;
}

const GoogleFitContext = createContext<GoogleFitContextProps | undefined>(undefined);

interface RunningSession {
    time: number;
    distance: number;
    calories: number;
    stepsNumber: number;
}

interface WalkingSession {
    time: number;
    distance: number;
    calories: number;
    stepsNumber: number;
}

const GoogleFitProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
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
    const getDailyStepsNumber = async (startDate: string, endDate: string): Promise<StepsResponse[]> => {
        const opt = {
            startDate,
            endDate,
            bucketUnit: BucketUnit.DAY,
            bucketInterval: 1,
        };

        const res = await GoogleFit.getDailyStepCountSamples(opt);
        return res;
    };

    const getDailyDistance = async (startDate: string, endDate: string): Promise<DistanceResponse[]> => {
        const opt = {
            startDate,
            endDate,
            bucketUnit: BucketUnit.DAY,
            bucketInterval: 1,
        };

        const res = await GoogleFit.getDailyDistanceSamples(opt);
        return res;
    };

    const getAverageHeartRate = async (startDate: string, endDate: string): Promise<AggregatedHeartRateResponse[]> => {
        const opt = {
            startDate,
            endDate,
            bucketUnit: BucketUnit.DAY,
            bucketInterval: 1,
        };

        const res = await GoogleFit.getAggregatedHeartRateSamples(opt, false);
        return res;
    };

    const getAllDailyRunningSessions = async (startDate: string, endDate: string): Promise<RunningSession[]> => {
        const opt = {
            startDate,
            endDate,
        };

        const res = await GoogleFit.getActivitySamples(opt);
        res.forEach(value => console.log("session: ", value));
        const runningSessions: RunningSession[] = res.filter((session: ActivitySampleResponse) => session.activityName !== 'running')
            .map((session: ActivitySampleResponse) => ({
                time: (session.end - session.start) / 60000, // convert ms to minutes
                distance: session.distance ? session.distance : 0,
                calories: session.calories ? session.calories : 0,
                stepsNumber: session.steps ? session.steps : 0
            }));

        return runningSessions;
    };

    const getAllDailyWalkingSessions = async (startDate: string, endDate: string): Promise<WalkingSession[]> => {
        const opt = {
            startDate,
            endDate,
        };

        const res = await GoogleFit.getActivitySamples(opt);
        const walkingSessions: WalkingSession[] = res
            .filter((session: ActivitySampleResponse) => session.activityName === 'walking')
            .map((session: ActivitySampleResponse) => ({
                time: (session.end - session.start) / 60000, // convert ms to minutes
                distance: session.distance ? session.distance : 0,
                calories: session.calories ? session.calories : 0,
                stepsNumber: session.steps ? session.steps : 0
            }));

        return walkingSessions;
    };

    const getCurrentWeight = async (startDate: string, endDate: string): Promise<WeightResponse[]> => {
        const opt = {
            startDate,
            endDate,
            unit: 'kg',
        };

        const res = await GoogleFit.getWeightSamples(opt);
        return res;
    };

    const getCurrentHeight = async (startDate: string, endDate: string): Promise<HeightResponse[]> => {
        const opt = {
            startDate,
            endDate,
        };

        const res = await GoogleFit.getHeightSamples(opt);
        return res;
    };

    const getDailyMovementMinutes = async (startDate: string, endDate: string): Promise<MoveMinutesResponse[]> => {
        const opt = {
            startDate,
            endDate,
        };

        const res = await GoogleFit.getMoveMinutes(opt);
        return res;
    };

    return (
        <GoogleFitContext.Provider
            value={{
                configureGoogleFit,
                getDailyStepsNumber,
                getDailyDistance,
                getAllDailyRunningSessions,
                getAllDailyWalkingSessions,
                getCurrentWeight,
                getCurrentHeight,
                getDailyMovementMinutes,
                getAverageHeartRate
            }}
        >
            {children}
        </GoogleFitContext.Provider>
    );
};

const useGoogleFit = (): GoogleFitContextProps => {
    const context = useContext(GoogleFitContext);
    if (context === undefined) {
        throw new Error('useGoogleFit must be used within a GoogleFitProvider');
    }
    return context;
};

export {GoogleFitProvider, useGoogleFit};
