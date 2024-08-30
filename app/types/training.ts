export interface WeeklyPlan {
    days: Workout[];
    week: number;
}

export interface PlainWorkout {
    title: string;
    distance: string;
    workoutTime: string;
    description: string;
}

export interface Workout {
    date: Date | string;
    workout: PlainWorkout;
    difficultyFeedback?: number;
    completedDistance?: number;
    completedTime?: number;
}

export interface PlanResponse {
    user_id: string;
    plan: WeeklyPlan[];
    _id: string;
    lut: Date;
}

export interface UpdatePlanResponse {
    updatedPlan: PlanResponse;
    rePlanNeeded: IsRePlanNeededValues;
}

export enum IsRePlanNeededValues {
    ToHard = 1,
    NoNeedForRePlan = 0,
    ToEasy = -1
}