import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios'
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

/**
 * ========================================
 * Email Verification - Send OTP
 * ========================================
 */

export interface SendEmailOTPData {
    email: string
}

export interface SendEmailOTPResponse {
    message: string
}

export async function sendEmailOTPApi(data: SendEmailOTPData): Promise<SendEmailOTPResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<SendEmailOTPResponse>>(
            '/send-email-otp/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        return response.data as unknown as SendEmailOTPResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

/**
 * ========================================
 * Email Verification - Verify OTP
 * ========================================
 */

export interface VerifyEmailOTPData {
    email: string
    otp: string
}

export interface VerifyEmailOTPResponse {
    message: string
    email_verified?: boolean
}

export async function verifyEmailOTPApi(data: VerifyEmailOTPData): Promise<VerifyEmailOTPResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<VerifyEmailOTPResponse>>(
            '/verify-email/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        return response.data as unknown as VerifyEmailOTPResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}
