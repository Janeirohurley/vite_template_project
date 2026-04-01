import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios'
import type { RegisterData, AuthResponse } from '../types'
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

export async function registerApi(data: RegisterData): Promise<AuthResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<AuthResponse>>(
            '/register/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        );

        // Les données sont déjà unwrapped par l'intercepteur
        // response.data est maintenant directement AuthResponse grâce à l'intercepteur
        return response.data as unknown as AuthResponse;
    } catch (error: unknown) {
        // Gérer les erreurs de validation Django
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}