export const getToken = () => localStorage.getItem("access_token");

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Project Template";
export const API_URL = import.meta.env.VITE_API_URL || "https://api.example.com";
export const REQUEST_TIMEOUT = Number(import.meta.env.VITE_APP_TIMEOUT) || 60000;

export const isDev = import.meta.env.DEV;
