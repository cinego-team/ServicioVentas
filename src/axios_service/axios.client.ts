import axios from 'axios';
import { config } from './env';

export const axiosAPIPromociones = axios.create({
    baseURL: config.APIPromocionesUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAPIPromociones.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (token) {
        config.headers.Authorization = token;
    }
    if (refreshToken) {
        config.headers['refresh-token'] = refreshToken;
    }

    return config;
});

export const axiosAPIFunciones = axios.create({
    baseURL: config.APIFuncionesUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAPIFunciones.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (token) {
        config.headers.Authorization = token;
    }
    if (refreshToken) {
        config.headers['refresh-token'] = refreshToken;
    }

    return config;
});

export const axiosAPIIntegracionMP = axios.create({
    baseURL: config.APIIntegracionMPUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAPIIntegracionMP.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (token) {
        config.headers.Authorization = token;
    }
    if (refreshToken) {
        config.headers['refresh-token'] = refreshToken;
    }

    return config;
});

export const axiosAPIEnviarMails = axios.create({
    baseURL: config.APIEnviarMailsUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

