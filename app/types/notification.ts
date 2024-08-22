import { PlainWorkout } from "./training";

export interface Notification {
    is_seen: boolean;
    user_id: string;
    workout: PlainWorkout;
    _id: string;
    date: string;
}