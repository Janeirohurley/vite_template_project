// src/lib/env.ts
export const getToken = () => localStorage.getItem("access_token");

export const API_URL =
    import.meta.env.VITE_API_URL || "https://api.example.com";

export const isDev = import.meta.env.DEV;
