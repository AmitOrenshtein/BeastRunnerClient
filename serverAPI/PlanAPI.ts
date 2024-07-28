import { api } from "./config/axiosConfig";
import { UserFitnessData } from "../app/types/userFitness";

export const PlanAPI = {
  generatePlan: async function (userFitness: UserFitnessData) {
    const response = await api.post(`/plan`, userFitness);
    return response.data;
  },

  // Another example 
  getPlans: async function (userId: string) {
    const response = await api.get(`/plan/${userId}`);
    return response.data;
  },
};



