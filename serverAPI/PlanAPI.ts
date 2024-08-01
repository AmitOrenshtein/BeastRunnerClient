import { api } from "./config/axiosConfig";
import { UserFitnessData, UserPreferences } from "../app/types/user";
import { PlanResponse, WeeklyPlan, Workout } from "@/app/types/training";
import axios, { AxiosResponse } from "axios";

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

  updatePlan: async function (updatedPlan: WeeklyPlan[]):Promise<AxiosResponse<PlanResponse>> {
    return api.post('/updatePlan', {
      updatedPlan
    });
  }
};
