
import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios'
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

export interface ForgotPasswordData {
    email: string
}

export interface ForgotPasswordResponse {
    message: string
}

export async function forgotPasswordApi(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<ForgotPasswordResponse>>(
            '/send-email-otp/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        );

        // Les données sont déjà unwrapped par l'intercepteur
       
        return response.data as unknown as ForgotPasswordResponse;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}
