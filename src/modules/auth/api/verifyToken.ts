import axios from "@/lib/axios"
import type { DjangoSuccessResponse, ApiError } from '@/types/api'

export interface VerifyTokenResponse {
    valid: boolean
    message: string
    data?: unknown
    status:number
}

export async function verifyTokenApi(token: string): Promise<VerifyTokenResponse> {
    try {
        const response = await axios.get<DjangoSuccessResponse<VerifyTokenResponse>>(
            '/auth/verify-token',
            { params: { token } }
        )

        // Les données sont déjà unwrapped par l'intercepteur
        return response.data as unknown as VerifyTokenResponse
    } catch (error: unknown) {
        // Gérer les erreurs de validation Django
        const axiosError = error as { formattedError?: ApiError }
        if (axiosError.formattedError) {
            throw axiosError.formattedError
        }
        throw error
    }
}
