import { apiInstance } from "./apiInstance";

export const postServices = {
    getAllPost: async () => {
        const response = await apiInstance.get('/social-media/posts');
        return response;
    },
    createPost: async (formData: FormData) => {
        const response = await apiInstance.post('/social-media/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    }
}