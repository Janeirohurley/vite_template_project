/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/axios.ts
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { API_URL } from './env'
import {
    extractErrorCode,
    getErrorRedirectAction,
    ERROR_CODES_REQUIRING_LOGIN,
} from './errorMessages'
import { notify } from './toast'
import { useAuthStore } from '@/modules/auth'


// Création de l'instance Axios
const instance = axios.create({
    baseURL: API_URL,
    timeout: Number(import.meta.env.VITE_APP_TIMEOUT) || 60000,
    headers: { 'Content-Type': 'application/json' },
})

export interface AxiosRequestConfigWithSkip extends InternalAxiosRequestConfig {
    skipAuth?: boolean
    requestToastId?: string | number
}

instance.interceptors.request.use((config: AxiosRequestConfigWithSkip) => {
    const token = useAuthStore.getState().accessToken
    if (!config.skipAuth && token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    if (config.method === "get") {
        const academicYear = JSON.parse(
            localStorage.getItem("selectedAcademicYear") || "null"
        );
        config.params = {
            ...(config.params || {}),
            // 👇 paramètre global
            academic_year_id: academicYear?.id,
        };
    }

    const method = (config.method || '').toLowerCase()
    if (['delete', 'put', 'patch'].includes(method)) {
        config.requestToastId = notify.loading('Traitement en cours...')
    }

    return config
})

/**
 * SUCCESS interceptor
 * - unwrap classique: status === 'success' && data !== undefined => on renvoie res.data (avec _originalResponse)
 * - si status === 'success' && typeError => on attache formattedError (mais laisse le composant gérer)
 */
instance.interceptors.response.use(
    (res) => {
        const requestConfig = res.config as AxiosRequestConfigWithSkip
        if (requestConfig?.requestToastId !== undefined) {
            notify.dismiss(requestConfig.requestToastId)
        }

        const data = res.data

        if (!data) return res

        // CAS: succès normal et payload (data) présent
        if (data.status === 'success' && data.data !== undefined && !data.typeError) {
            // on retourne la structure entière pour plus de flexibilité (tu peux consumer res.data.data si nécessaire)
            return {
                ...res,
                data: data,
                _originalResponse: data,
            }
        }

        // CAS: success mais qui demande une action (typeError)
        if (data.status === 'success' && data.typeError) {
            // Attacher un formattedError sur la réponse pour que useErrorHandler / composants puissent l'utiliser
            // Ne pas supprimer le retour : on renvoie la response complète afin que le caller puisse lire data.data (extra)
            (res as any).formattedError = {
                message: data.message || 'Action required',
                originalMessage: data.message,
                errorCode: data.typeError,
                statusCode: res.status,
                typeError: data.typeError,
                extra: data.data ?? null,
            }
            return res
        }

        // fallback: renvoyer la réponse brute
        return res
    },

    // ERROR handler
    (err) => {
        console.error('API Error:', err)

        const requestToastId = (err.config as AxiosRequestConfigWithSkip | undefined)?.requestToastId
        if (requestToastId !== undefined) {
            notify.dismiss(requestToastId)
        }

        const errorData = err.response?.data
        if (errorData) {
            const errorCode = extractErrorCode(errorData)
           
            const formattedError = {
                message: errorData.message,
                originalMessage: errorData.message,
                errorCode,
                statusCode: err.response.status,
                errors: errorData.errors || {},
                typeError: errorData.typeError || null,
                extra: errorData.data ?? null,
            }
            const redirectAction = getErrorRedirectAction(errorCode, formattedError.extra)

            err.formattedError = formattedError

            console.log(err.response.status)
            // Nettoyage des tokens si nécessaire (session expirée, token invalide, etc.)
            if (err.response.status === 401) {
                // Éviter la boucle infinie : ne pas déclencher logout si on est déjà en train de se déconnecter
                const isLogoutRequest = err.config?.url?.includes('logout')
                const authState = useAuthStore.getState()
                const shouldForceLogout =
                    authState.hasHydrated &&
                    (authState.authStatus === "authenticated" || !authState.refreshToken)
                
                if (isLogoutRequest) {
                    // Si c'est une erreur sur logout, nettoyer directement le store
                    authState.stopAutoRefresh()
                    useAuthStore.setState({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        authStatus: "unauthenticated",
                    })
                } else if (shouldForceLogout) {
                    // Pour les autres requêtes 401, faire un logout normal
                    useAuthStore.getState().logout()
                }
            }
            if (redirectAction.type === 'login' || ERROR_CODES_REQUIRING_LOGIN.includes(errorCode) || err.response.status === 401) {
                const authState = useAuthStore.getState()
                const shouldForceLogout =
                    authState.hasHydrated &&
                    (authState.authStatus === "authenticated" || !authState.refreshToken)

                if (shouldForceLogout) {
                    localStorage.removeItem('auth-storage')
                }

                console.warn('Tokens cleared due to auth error')
            }
        }else{
            if(!err.response){
                err.formattedError = {
                    message: 'Network Error. Please check your connection.',
                    originalMessage: 'Network Error. Please check your connection.',
                    errorCode: 'NetworkError',
                    statusCode: null,
                    errors: {},
                    typeError: null,
                    extra: null,
                }
            }
        }

        // Rethrow pour que les hooks/mutations gèrent l'affichage et la redirection via useErrorHandler
        throw err
    }
)

export default instance
