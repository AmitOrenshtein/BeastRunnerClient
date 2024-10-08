import api from "./config/axiosConfig";
import { UserFitnessData, UserPreferences } from "../app/types/user";
import { IsRePlanNeededValues, PlanResponse, UpdatePlanResponse, WeeklyPlan, Workout } from "@/app/types/training";
import { AxiosResponse } from "axios";

interface GeneratePlanI {
  userFitnessData?: UserFitnessData,
  userPreferences?: UserPreferences
}

export const PlanAPI = {
  generatePlan: async function ({userFitnessData, userPreferences }: GeneratePlanI) {
    const response = await api.post<GeneratePlanI>(`/generatePlan`, {
      userFitnessData: userFitnessData,
      userPreferences: userPreferences 
    });
    return response.data;
  },

  getPlan: async function ():Promise<AxiosResponse<PlanResponse>> {
    return api.get('/getPlan')
  },

  getWorkout: async function (date: Date):Promise<AxiosResponse<Workout[]>> {
    return api.get('/getWorkout', {params: { date }})
  },

  updatePlan: async function (updatedPlan: WeeklyPlan[]):Promise<AxiosResponse<UpdatePlanResponse>> {
    return api.post('/updatePlan', {
      updatedPlan
    });
  },

  rePlanWorkoutPlan: async function (rePlanValue: IsRePlanNeededValues, userFitnessData: UserFitnessData):Promise<AxiosResponse<PlanResponse>> {
    return api.post('/rePlan', {rePlanValue: rePlanValue, userFitnessData: userFitnessData});
  },

  setUserData:  async function setUserData(userPreferences: UserPreferences):Promise<AxiosResponse<boolean>> {
    return api.post('/setUserData', {
      userPreferences
    })
  },

  getUserData: async function getUserData(): Promise<UserPreferences> {
    return new Promise<UserPreferences>((resolve, reject) => {
      api.get('/getUserData').then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(new Error("Failed to get user data: ", error));
      })
    })
  }
};
