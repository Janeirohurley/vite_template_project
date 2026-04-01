/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance } from "axios";
import mainAxios from "./axios";

export const createModuleAxios = (modulePath: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: `${mainAxios.defaults.baseURL}/${modulePath}`,
        timeout: mainAxios.defaults.timeout,
        headers: mainAxios.defaults.headers,
    });

    // Copier tous les intercepteurs de l'instance principale
    (mainAxios.interceptors.request as any).handlers?.forEach((handler: any) => {
        if (handler) instance.interceptors.request.use(handler.fulfilled, handler.rejected);
    });

    (mainAxios.interceptors.response as any).handlers?.forEach((handler: any) => {
        if (handler) instance.interceptors.response.use(handler.fulfilled, handler.rejected);
    });

    return instance;
};
