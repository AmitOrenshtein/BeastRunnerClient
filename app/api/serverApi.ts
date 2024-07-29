import axios, { AxiosResponse } from "axios";
import { PlanResponse } from "../types/training";

export const getPlan = async ():Promise<AxiosResponse<PlanResponse>> => {
    return axios({
        method: 'get',
        url: 'http://localhost:8080/getPlan'
      });
}