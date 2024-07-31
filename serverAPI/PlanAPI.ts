import { api } from "./config/axiosConfig";
import { UserFitnessData, UserPreferences } from "../app/types/user";

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

  // Another example 
  getPlans: async function (userId: string) {
    const response = await api.get(`/plan/${userId}`);
    return response.data;
  },
};



