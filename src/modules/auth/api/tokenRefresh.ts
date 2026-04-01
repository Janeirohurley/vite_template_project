import axios, { type AxiosRequestConfigWithSkip } from '@/lib/axios'
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

/**
 * ========================================
 * Token Refresh
 * ========================================
 */

export interface TokenRefreshData {
    refresh: string
}

export interface TokenRefreshResponse {
    access: string
    refresh?: string
}

export async function tokenRefreshApi(data: TokenRefreshData): Promise<TokenRefreshResponse> {
    try {
        const response = await axios.post<DjangoSuccessResponse<TokenRefreshResponse>>(
            '/token/refresh/',
            data,
            { skipAuth: true } as AxiosRequestConfigWithSkip
        )

        return response.data.data as unknown as TokenRefreshResponse
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}
