import { useMutation } from '@tanstack/react-query'
import {
    sendEmailOTPApi,
    verifyEmailOTPApi,
    type SendEmailOTPData,
    type SendEmailOTPResponse,
    type VerifyEmailOTPData,
    type VerifyEmailOTPResponse
} from '../api/emailVerification'
import type { ApiError } from '@/types/api'
import { useErrorHandler } from './useErrorHandler'
import { notify } from '@/lib'

/**
 * Hook pour envoyer un OTP par email
 * Utilisé pour la vérification d'email lors de l'inscription
 */
export function useSendEmailOTP() {
    const { handleError } = useErrorHandler()

    return useMutation<SendEmailOTPResponse, ApiError, SendEmailOTPData>({
        mutationFn: sendEmailOTPApi,
        onSuccess: (data) => {
            notify.success(
                data.message || 'Un code de vérification a été envoyé à votre email.',
                { duration: 5000 }
            )

            if (import.meta.env.DEV) {
                console.log('Email OTP sent successfully:', data)
            }
        },
        onError: (error: ApiError) => {
            console.error('Send email OTP error:', error)

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

/**
 * Hook pour vérifier l'OTP email
 * Utilisé pour confirmer l'email de l'utilisateur
 */
export function useVerifyEmailOTP() {
    const { handleError } = useErrorHandler()

    return useMutation<VerifyEmailOTPResponse, ApiError, VerifyEmailOTPData>({
        mutationFn: verifyEmailOTPApi,
        onSuccess: (data) => {
            notify.success(
                data.message || 'Email vérifié avec succès !',
                { duration: 5000 }
            )

            if (import.meta.env.DEV) {
                console.log('Email verified successfully:', data)
            }
        },
        onError: (error: ApiError) => {
            console.error('Verify email OTP error:', error)

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
