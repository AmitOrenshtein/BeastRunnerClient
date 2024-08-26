export enum Gender {
    female = 'Female',
    male = 'Male',
  }
  
  export interface UserFitnessData {
    height: number;
    weight: number;
    moveMinuets?: number;
    heartPoints?: number;
  }

  export interface UserPreferences {
    gender: Gender;
    age: string;
    userRunningLevel?: string;
    userRunningGoal?: string;
    startDate?: string;
    endDate?: string;
  }

export interface IUser {
  email: string,
  _id?: string,
  accessToken?: string,
  refreshToken?: string,
  userPreferences?: UserPreferences
}
