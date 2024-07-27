export interface Plan {
    plan: WeeklyPlan[];
}

export interface WeeklyPlan {
    days: Workout[];
    week: number;
}

export interface Workout {
    date: Date | string;
    workout: string;
}