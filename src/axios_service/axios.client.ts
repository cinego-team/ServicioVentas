import axios from 'axios';
import { config } from './env';

export const axiosAPIPromociones = axios.create({
    baseURL: config.APIPromocionesUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosAPIFunciones = axios.create({
    baseURL: config.APIFuncionesUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosAPIIntegracionMP = axios.create({
    baseURL: config.APIIntegracionMPUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosAPIEnviarMails = axios.create({
    baseURL: config.APIEnviarMailsUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosAPIUsuarios = axios.create({
    baseURL: config.APIUsuariosUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});