import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios';
import type { LoginCredentials, AuthResponse } from '../types';
import type { DjangoSuccessResponse, ApiError } from '@/types/api';

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<AuthResponse>>(
            '/login/',
            credentials,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        );

        // Les données sont déjà unwrapped par l'intercepteur
        return response.data.data as unknown as AuthResponse;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}
