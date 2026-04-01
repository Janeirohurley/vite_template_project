import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios'
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

/**
 * ========================================
 * Password Reset with OTP
 * ========================================
 */

export interface ResetPasswordWithOTPData {
    email: string
    otp: string
    new_password: string
}

export interface ResetPasswordWithOTPResponse {
    message: string
}

export async function resetPasswordWithOTPApi(
    data: ResetPasswordWithOTPData
): Promise<ResetPasswordWithOTPResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<ResetPasswordWithOTPResponse>>(
            '/password/reset/verify/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        return response.data as unknown as ResetPasswordWithOTPResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}
