// http.ts

import axios, { AxiosHeaders, AxiosInstance, AxiosRequestHeaders } from 'axios';

export function client(customHeaders: Partial<AxiosRequestHeaders> = {}): AxiosInstance {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (!token) {
        console.warn('CSRF token not found. Make sure a <meta name="csrf-token"> tag is present in your HTML.');
    }

    const defaultHeaders: Partial<AxiosRequestHeaders> = {
        //'X-CSRF-TOKEN': token || '',
        Accept: 'application/json',
    };

    return axios.create({
        headers: {
            ...defaultHeaders,
            ...customHeaders,
        },
        withCredentials: true,
    });
}

let httpInstance: AxiosInstance | undefined;

export const apiClient = (): AxiosInstance => {
    if (httpInstance) {
        return httpInstance;
    }

    const headers = AxiosHeaders.from({
        Accept: 'application/json',
    });

    const instance = axios.create({
        headers,
        withCredentials: true,
        baseURL: '/api/',
    });

    instance.interceptors.response.use(
        (res) => {
            return res;
        },
        (error) => {
            throw error;
        },
    );

    httpInstance = instance;

    return instance;
};

export const getHttpClient = client;
