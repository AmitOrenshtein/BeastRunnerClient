import { api } from "./config/axiosConfig";
import { AxiosResponse } from "axios";

export const NotificationAPI = {
    getNotifications: async function ():Promise<AxiosResponse<Notification[]>> {
        return api.get('/getNotifications')
    },
    
    deleteNotification: async function (id: string):Promise<AxiosResponse<boolean>> {
    return api.get('/deleteNotification', {params: { id }})
    },

    getNotificationsNumber: async function ():Promise<AxiosResponse<number>> {
        return api.get('/getNotificationsNumber')
    },
}