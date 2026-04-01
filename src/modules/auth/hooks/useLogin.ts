import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../api'
import type { LoginCredentials, AuthResponse } from '../types'
import type { ApiError } from '@/types/api'
import { useErrorHandler } from './useErrorHandler'
import { useAuthStore } from '../store/authStore'
import { notify } from '@/lib'
import { useNavigate } from '@tanstack/react-router'

interface LoginResponse extends AuthResponse {
    _requiresAction?: boolean
    typeError?: string
    message?: string
    email?: string
}

export function useLogin() {
    const { handleError } = useErrorHandler()
    const navigate = useNavigate()

    const setUser = useAuthStore((state) => state.setUser)
    const setTokens = useAuthStore((state) => state.setTokens)

    return useMutation<LoginResponse, ApiError, LoginCredentials>({
        mutationFn: loginApi,

        onSuccess: (data) => {
            console.log("Login success:", data)

            // 1️⃣ Mettre les tokens à jour (refresh token persiste)
            setTokens(data.access, data.refresh)

            // 2️⃣ Mettre le user dans le store
            setUser(data.user)

            navigate({ to: '/' })
            // 3️⃣ Toast utilisateur
            notify.success("Connexion réussie !")
        },

        onError: (error: ApiError, variables) => {
            console.error("Login error:", error)

            handleError(error, {
                showToast: true,
                autoRedirect: true,
                userEmail: variables?.email,
                onRedirect: (redirectAction) => {
                    if (import.meta.env.DEV) {
                        console.log("Error Code:", error.errorCode)
                        console.log("Redirect Action:", redirectAction)
                    }
                },
            })
        },
    })
}

