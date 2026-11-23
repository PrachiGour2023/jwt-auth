import { apiInstance } from "./apiInstance"

export const userServices = {
    userProfile: async () => {
       const response = await apiInstance.get('/social-media/profile');
       return response?.data;
    }
}