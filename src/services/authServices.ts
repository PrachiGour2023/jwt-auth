import { apiInstance, BASEURL, setAccessToken, refreshAccessToken } from './apiInstance';
import axios from 'axios';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    role: string;
    username: string;
}

export interface User {
    email: string;
    role: string;
    username: string;
    id: string;
    isEmailVerified: boolean;
}

interface AuthResponse {
    accessToken: string;
    user: User;
}

export const authServices = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiInstance.post('/users/login', credentials);
        const { accessToken, user } = response?.data?.data;
        if (!accessToken) {
            throw new Error('Tokens missing from login response');
        }
        setAccessToken(accessToken)
        return { accessToken, user }
    },
    signup: async (credentials: SignupCredentials) => {
        const response = await apiInstance.post('/users/register', credentials);
        return response.data;
    },
     refreshToken: async (): Promise<{ accessToken: string }> => {
        const accessToken = await refreshAccessToken();
        return { accessToken };
    },
    getCurrentUser: async (): Promise<User> => {
        const response = await apiInstance.get('/users/current-user');
        return response.data?.data;
    },
    logout: async () => {
        try {
            await apiInstance.post('/users/logout');
        } finally {
            // Always clear local state, even if the server call fails.
            setAccessToken(null);
        }
    }
}