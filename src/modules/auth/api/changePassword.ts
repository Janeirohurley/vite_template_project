import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios'
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

export interface ChangePasswordData {
    token: string
    newPassword: string
}

export interface ChangePasswordResponse {
    message: string
}

export async function changePasswordApi(data: ChangePasswordData): Promise<ChangePasswordResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<ChangePasswordResponse>>(
            '/auth/change-password',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        // Les données sont déjà unwrapped par l'intercepteur
        return response.data as unknown as ChangePasswordResponse
    } catch (error: unknown) {
        // Gérer les erreurs de validation Django
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}
