/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { registerApi } from '../api'
import type { RegisterData, AuthResponse } from '../types'
import type { ApiError } from '@/types/api'
import { useErrorHandler } from './useErrorHandler'


export function useRegister() {
    const navigate = useNavigate()
    const { handleErrorWithRedirect } = useErrorHandler()

    return useMutation<AuthResponse, ApiError, RegisterData>({
        mutationFn: registerApi,
        onSuccess: (data: any) => {
            // Cas spécial : axios intercepte et unwrappe data, mais _originalResponse contient tout
            navigate({
                to: '/auth/verify-email',
                search: { email: data.data.email, from: '/auth/register' }
            });
        },
        onError: (error: ApiError) => {
            console.error('Register error:', error)

            // Utiliser le gestionnaire d'erreurs centralisé
            // Il gère automatiquement les messages traduits, les erreurs de champs et les redirections
            const errorInfo = handleErrorWithRedirect(error, (redirectAction) => {
                // Callback optionnel avant redirection
                if (import.meta.env.DEV) {
                    console.log('Error Code:', error.errorCode)
                    console.log('Redirect Action:', redirectAction)
                }
            })

            // Log supplémentaire en dev pour le debugging
            if (import.meta.env.DEV) {
                console.log('Error Info:', errorInfo)
                if (errorInfo.fieldErrors && Object.keys(errorInfo.fieldErrors).length > 0) {
                    console.log('Field Errors:', errorInfo.fieldErrors)
                }
            }
        },
    })
}
