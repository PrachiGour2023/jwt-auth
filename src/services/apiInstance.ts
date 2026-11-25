import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Keep the trailing slash OFF so `${BASEURL}/x` never produces `//x`.
export const BASEURL: string = (
    import.meta.env.VITE_API_URL ??
    'http://localhost:8080/api/v1'
).replace(/\/+$/, '');

/* ---------------------------------- token --------------------------------- */

// In-memory only: safe from XSS persistence; restored on reload via refresh cookie.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

/* --------------------------- auth-failure callback ------------------------- */

// AuthProvider registers this so a failed refresh clears React state
// (instead of a hard `window.location.href` reload).
let onAuthFailure: (() => void) | null = null;

export const setAuthFailureHandler = (handler: (() => void) | null) => {
    onAuthFailure = handler;
};

/* ------------------------------ axios clients ------------------------------ */

// Used for the refresh call only. NO interceptors, so a 401 here can't recurse.
const refreshClient = axios.create({
    baseURL: BASEURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

export const apiInstance = axios.create({
    baseURL: BASEURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

const onServerError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const message = error?.response?.data?.message || `Request failed with status ${error?.response?.status}`
            throw new Error(message)
        }

        if (error.request) {
            throw new Error('Network error. Please check your internet connection.');
        }
    }
    throw new Error(
        error instanceof Error ? error.message : 'An unexpected error occurred.'
    );
}

/* --------------------------- single-flight refresh ------------------------- */

// One refresh at a time. Concurrent callers (StrictMode double effect,
// several parallel 401s) all await the same promise, so a rotating
// refresh token is only used once.
let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post('/users/refresh-token', {})
            .then((res) => {
                const token: string | undefined = res?.data?.data?.accessToken;
                if (!token) throw new Error('Invalid token response');
                setAccessToken(token);
                return token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

/* -------------------------------- interceptors ----------------------------- */

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Endpoints where a 401 means "bad credentials / no session", not "token expired".
const AUTH_ENDPOINTS = ['/login', '/register', '/refresh-token', '/logout'];

const isAuthEndpoint = (url?: string) =>
    !!url && AUTH_ENDPOINTS.some((path) => url.includes(path));

apiInstance.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

apiInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        onServerError(error)
        const originalRequest = error.config as RetryableConfig | undefined;

        // Network error / cancelled request: no response or config to work with.
        if (!originalRequest || !error.response) {
            return Promise.reject(error);
        }

        const shouldRefresh =
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint(originalRequest.url);

        if (!shouldRefresh) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            await refreshAccessToken();
            // Request interceptor re-attaches the new token on this retry.
            return apiInstance(originalRequest);
        } catch (refreshError) {
            setAccessToken(null);
            onAuthFailure?.();
            return Promise.reject(refreshError);
        }
    }
);