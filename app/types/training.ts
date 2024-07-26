export interface Plan {
    plan: WeeklyPlan[];
}

interface WeeklyPlan {
    days: Training[];
    week: number;
}

interface Training {
    date: Date | string;
    workout: string;
}