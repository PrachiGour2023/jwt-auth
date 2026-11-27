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
    },
    deletePost: async (_id: string) => {
        const response = await apiInstance.delete(`/social-media/posts/${_id}`);
        return response;
    },
    togglePostBookmark: async (_id: string) => {
        const response = await apiInstance.post(`/social-media/bookmarks/${_id}`)
        return response
    },
    bookmarkPost: async () => {
        const response = await apiInstance.get(`/social-media/bookmarks`);
        return response?.data;
    },
    likeunlikePost: async (_id: string) => {
        const response = await apiInstance.post(`social-media/like/post/${_id}`)
        return response;
    },
    followunfollowUser: async (_id: string) => {
        const response = await apiInstance.post(`social-media/follow/${_id}`)
        return response;
    }
}