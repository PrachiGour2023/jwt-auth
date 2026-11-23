import { apiInstance } from "./apiInstance";

export const postServices = {
    getAllPost: async () => {
       const response = await apiInstance.get('/social-media/posts');
       return response;
    }
}