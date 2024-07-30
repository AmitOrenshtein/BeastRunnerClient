import axios, { AxiosResponse } from "axios";
import { PlanResponse, WeeklyPlan } from "../types/training";

export const getPlan = async ():Promise<AxiosResponse<PlanResponse>> => {
    return axios.get('http://localhost:8000/getPlan');
}

export const updatePlan = async (updatedPlan: WeeklyPlan[]):Promise<AxiosResponse<PlanResponse>> => {
    return axios.post('http://localhost:8000/updatePlan', {
        updatedPlan
      });
}