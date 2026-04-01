import { useQuery } from '@tanstack/react-query'
import { verifyTokenApi, type VerifyTokenResponse } from '../api/verifyToken'
import type { ApiError } from '@/types/api'

/**
 * Hook pour vérifier la validité d'un token (reset password, email verification, etc.)
 * Utilise React Query pour la gestion du cache et des états de chargement
 */
export function useVerifyToken(token: string | undefined, enabled: boolean = true) {
    return useQuery<VerifyTokenResponse, ApiError>({
        queryKey: ['verify-token', token],
        queryFn: () => {
            if (!token) {
                throw {
                    message: 'Token manquant',
                    errorCode: 'InvalidToken'
                } as ApiError
            }
            return verifyTokenApi(token)
        },
        enabled: enabled && !!token,
        retry: false,
        staleTime: 0, // Ne pas mettre en cache pour toujours vérifier la validité
        gcTime: 0, // Ne pas garder en cache après unmount
    })
}
