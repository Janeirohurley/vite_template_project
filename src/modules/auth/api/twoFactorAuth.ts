import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios'
import type { User } from '@/types'
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

/**
 * ========================================
 * 2FA Login Endpoints
 * ========================================
 */

export interface Email2FALoginData {
    email: string
    otp: string
}

export interface Email2FALoginResponse {
    access: string
    refresh: string
    user: User
}

export async function email2FALoginApi(data: Email2FALoginData): Promise<Email2FALoginResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<Email2FALoginResponse>>(
            '/login/email/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        return response.data.data as unknown as Email2FALoginResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface TOTP2FALoginData {
    email: string
    otp: string
}

export interface TOTP2FALoginResponse {
    access: string
    refresh: string
    user: User
}

export async function totp2FALoginApi(data: TOTP2FALoginData): Promise<TOTP2FALoginResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<TOTP2FALoginResponse>>(
            '/login/totp/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        return response.data as unknown as TOTP2FALoginResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface Static2FALoginData {
    email: string
    otp: string
}

export interface Static2FALoginResponse {
    access: string
    refresh: string
    user: User 
}

export async function static2FALoginApi(data: Static2FALoginData): Promise<Static2FALoginResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<Static2FALoginResponse>>(
            '/login/static/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        return response.data as unknown as Static2FALoginResponse
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
 * 2FA Setup Endpoints
 * ========================================
 */

export interface SetEmail2FAResponse {
    message: string
    email_2fa_enabled?: boolean
}

export async function setEmail2FAApi(): Promise<SetEmail2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<SetEmail2FAResponse>>(
            '/2fa/set/email/'
        )

        return response.data as unknown as SetEmail2FAResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface SetTOTP2FAResponse {
    message: string
    qr_code?: string
    secret_key?: string
}

export async function setTOTP2FAApi(): Promise<SetTOTP2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<SetTOTP2FAResponse>>(
            '/2fa/set/totp/'
        )

        return response.data as unknown as SetTOTP2FAResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface SetStatic2FAResponse {
    message: string
    static_codes?: string[]
}

export async function setStatic2FAApi(): Promise<SetStatic2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<SetStatic2FAResponse>>(
            '/2fa/set/static/'
        )

        return response.data as unknown as SetStatic2FAResponse
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
 * 2FA Verification Endpoints
 * ========================================
 */

export interface VerifyEmail2FAData {
    email: string
    otp: string
}

export interface VerifyEmail2FAResponse {
    message: string
    verified?: boolean
}

export async function verifyEmail2FAApi(data: VerifyEmail2FAData): Promise<VerifyEmail2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<VerifyEmail2FAResponse>>(
            '/2fa/verify/email/',
            data
        )

        return response.data as unknown as VerifyEmail2FAResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface VerifyTOTP2FAData {
    email: string
    otp: string
}

export interface VerifyTOTP2FAResponse {
    message: string
    verified?: boolean
}

export async function verifyTOTP2FAApi(data: VerifyTOTP2FAData): Promise<VerifyTOTP2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<VerifyTOTP2FAResponse>>(
            '/2fa/verify/totp/',
            data
        )

        return response.data as unknown as VerifyTOTP2FAResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface VerifyStatic2FAData {
    email: string
    code: string
}

export interface VerifyStatic2FAResponse {
    message: string
    verified?: boolean
}

export async function verifyStatic2FAApi(data: VerifyStatic2FAData): Promise<VerifyStatic2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<VerifyStatic2FAResponse>>(
            '/2fa/verify/static/',
            data
        )

        return response.data as unknown as VerifyStatic2FAResponse
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
 * 2FA Disable Endpoints
 * ========================================
 */

export interface DisableEmail2FAResponse {
    message: string
}

export async function disableEmail2FAApi(): Promise<DisableEmail2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<DisableEmail2FAResponse>>(
            '/2fa/disable/email/'
        )

        return response.data as unknown as DisableEmail2FAResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface DisableTOTP2FAResponse {
    message: string
}

export async function disableTOTP2FAApi(): Promise<DisableTOTP2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<DisableTOTP2FAResponse>>(
            '/2fa/disable/totp/'
        )

        return response.data as unknown as DisableTOTP2FAResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}

export interface DisableStatic2FAResponse {
    message: string
}

export async function disableStatic2FAApi(): Promise<DisableStatic2FAResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<DisableStatic2FAResponse>>(
            '/2fa/disable/static/'
        )

        return response.data as unknown as DisableStatic2FAResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}
