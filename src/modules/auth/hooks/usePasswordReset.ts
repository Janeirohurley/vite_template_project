import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/lib'
import {
    resetPasswordWithOTPApi,
    type ResetPasswordWithOTPData,
    type ResetPasswordWithOTPResponse
} from '../api/passwordReset'
import type { ApiError } from '@/types/api'
import { useErrorHandler } from './useErrorHandler'

/**
 * Hook pour réinitialiser le mot de passe avec OTP
 * Utilisé après avoir reçu l'OTP par email
 */
export function useResetPasswordWithOTP() {
    const navigate = useNavigate()
    const { handleError } = useErrorHandler()

    return useMutation<ResetPasswordWithOTPResponse, ApiError, ResetPasswordWithOTPData>({
        mutationFn: resetPasswordWithOTPApi,
        onSuccess: (data) => {
            notify.success(
                data.message || 'Mot de passe réinitialisé avec succès !',
                { duration: 5000 }
            )

            // Rediriger vers login après un court délai
            setTimeout(() => {
                navigate({ to: '/auth/login' })
            }, 1500)

            if (import.meta.env.DEV) {
                console.log('Password reset successfully')
            }
        },
        onError: (error: ApiError) => {
            console.error('Reset password error:', error)

            const errorInfo = handleError(error, {
                showToast: true,
                autoRedirect: false,
            })

            if (import.meta.env.DEV) {
                console.log('Error Info:', errorInfo)
            }
        },
    })
}
