import { apiInstance } from "./apiInstance"

export const userServices = {
    userProfile: async () => {
        const response = await apiInstance.get('/social-media/profile');
        return response?.data;
    },
    updateProfile: async (payload: any) => {
        const response = await apiInstance.patch('/social-media/profile', payload);
        return response?.data;
    },
    updateCoverImage: async (payload: any) => {
        const response = await apiInstance.patch('/social-media/profile/cover-image', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }

        });
        return response?.data;
    },
    updateAvatar: async (payload: any) => {
        const response = await apiInstance.patch('/users/avatar', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response?.data
    }
}
