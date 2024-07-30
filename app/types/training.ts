export interface WeeklyPlan {
    days: Workout[];
    week: number;
}

export interface Workout {
    date: Date | string;
    workout: string;
}

export interface PlanResponse {
    user_id: string;
    plan: WeeklyPlan[];
    _id: string;
    lut: Date;
}