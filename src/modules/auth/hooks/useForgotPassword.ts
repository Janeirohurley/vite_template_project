import { useMutation } from '@tanstack/react-query'
import { forgotPasswordApi, type ForgotPasswordData, type ForgotPasswordResponse } from '../api/forgotPassword'
import type { ApiError } from '@/types/api'
import { useErrorHandler } from './useErrorHandler'
import { notify } from '@/lib'

/**
 * Hook pour la fonctionnalité de mot de passe oublié
 * Gère l'envoi de l'email de réinitialisation avec gestion d'erreurs centralisée
 */
export function useForgotPassword() {
    const { handleError } = useErrorHandler()

    return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordData>({
        mutationFn: forgotPasswordApi,
        onSuccess: (data) => {
            // Afficher un message de succès
            notify.success(
                data?.message || 'Un email de réinitialisation a été envoyé à votre adresse email.',
                { duration: 5000 }
            )
            if (data === null) return

            if (import.meta.env.DEV) {
                console.log('Password reset email sent successfully')
            }
        },
        onError: (error: ApiError) => {
            console.error('Forgot password error:', error)

            // Utiliser le gestionnaire d'erreurs centralisé
            // Pour forgot password, on n'a généralement pas besoin de redirection automatique
            const errorInfo = handleError(error, {
                showToast: true,
                autoRedirect: false, // Pas de redirection automatique pour cette fonctionnalité
            })

            // Log en dev
            if (import.meta.env.DEV) {
                console.log('Error Info:', errorInfo)
            }
        },
    })
}
