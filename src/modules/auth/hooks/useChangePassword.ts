import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { changePasswordApi, type ChangePasswordData, type ChangePasswordResponse } from '../api/changePassword'
import type { ApiError } from '@/types/api'
import { useErrorHandler } from './useErrorHandler'
import { notify } from '@/lib'

/**
 * Hook pour la fonctionnalité de changement de mot de passe
 * Gère le changement de mot de passe avec redirection vers login après succès
 */
export function useChangePassword() {
    const navigate = useNavigate()
    const { handleError } = useErrorHandler()

    return useMutation<ChangePasswordResponse, ApiError, ChangePasswordData>({
        mutationFn: changePasswordApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Mot de passe changé avec succès !', {
                duration: 5000
            })

            // Rediriger vers login après un court délai
            setTimeout(() => {
                navigate({ to: '/auth/login' })
            }, 1500)

            if (import.meta.env.DEV) {
                console.log('Password changed successfully')
            }
        },
        onError: (error: ApiError) => {
            console.error('Change password error:', error)

            // Utiliser le gestionnaire d'erreurs centralisé
            // Pas de redirection automatique pour cette fonctionnalité
            const errorInfo = handleError(error, {
                showToast: true,
                autoRedirect: false,
                customMessage: error.message || 'Erreur lors du changement de mot de passe'
            })

            // Log en dev
            if (import.meta.env.DEV) {
                console.log('Error Info:', errorInfo)
            }
        },
    })
}
