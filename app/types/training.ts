export interface WeeklyPlan {
    days: Workout[];
    week: number;
}

export interface Workout {
    date: Date | string;
    workout: string;
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