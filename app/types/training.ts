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