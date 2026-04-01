import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/lib'
import {
    // Setup
    setEmail2FAApi,
    setTOTP2FAApi,
    setStatic2FAApi,
    // Verify
    verifyEmail2FAApi,
    verifyTOTP2FAApi,
    verifyStatic2FAApi,
    // Disable
    disableEmail2FAApi,
    disableTOTP2FAApi,
    disableStatic2FAApi,
    // Login
    email2FALoginApi,
    totp2FALoginApi,
    static2FALoginApi,
    // Types
    type SetEmail2FAResponse,
    type SetTOTP2FAResponse,
    type SetStatic2FAResponse,
    type VerifyEmail2FAData,
    type VerifyEmail2FAResponse,
    type VerifyTOTP2FAData,
    type VerifyTOTP2FAResponse,
    type VerifyStatic2FAData,
    type VerifyStatic2FAResponse,
    type DisableEmail2FAResponse,
    type DisableTOTP2FAResponse,
    type DisableStatic2FAResponse,
    type Email2FALoginData,
    type Email2FALoginResponse,
    type TOTP2FALoginData,
    type TOTP2FALoginResponse,
    type Static2FALoginData,
    type Static2FALoginResponse,
} from '../api/twoFactorAuth'
import type { ApiError } from '@/types/api'
import { useErrorHandler } from './useErrorHandler'
import { useAuthStore } from '../store/authStore'

/**
 * useSetEmail2FA
 * -----------------------------------------
 * Active la méthode 2FA via Email.
 *
 * Comportements :
 *  - Appelle l’API setEmail2FAApi
 *  - Affiche un notify de succès
 *  - handleError → affiche message sans redirection
 *
 * Réponse : SetEmail2FAResponse { message }
 */

export function useSetEmail2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<SetEmail2FAResponse, ApiError, void>({
        mutationFn: setEmail2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Authentification à deux facteurs par email activée !', {
                duration: 5000
            })

            if (import.meta.env.DEV) {
                console.log('Email 2FA enabled:', data)
            }
        },
        onError: (error: ApiError) => {
            console.error('Set email 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}
/**
 * useSetTOTP2FA
 * -----------------------------------------
 * Active le 2FA via TOTP (Google Authenticator, Authy, etc.)
 *
 * Comportements :
 *  - Appelle setTOTP2FAApi
 *  - Retourne un QR code (data.qr_code)
 *  - handleError → sans redirection
 *
 * Réponse : SetTOTP2FAResponse { qr_code, message }
 */

export function useSetTOTP2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<SetTOTP2FAResponse, ApiError, void>({
        mutationFn: setTOTP2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'TOTP configuré avec succès !', {
                duration: 5000
            })

            if (import.meta.env.DEV) {
                console.log('TOTP 2FA setup:', data)
                if (data.qr_code) {
                    console.log('QR Code available for scanning')
                }
            }
        },
        onError: (error: ApiError) => {
            console.error('Set TOTP 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}
/**
 * useSetStatic2FA
 * -----------------------------------------
 * Génère une liste de codes de secours.
 *
 * Comportements :
 *  - Appelle setStatic2FAApi
 *  - Affiche les codes de secours
 *  - handleError → sans redirection
 *
 * Réponse : SetStatic2FAResponse { static_codes[] }
 */

export function useSetStatic2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<SetStatic2FAResponse, ApiError, void>({
        mutationFn: setStatic2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Codes de secours générés !', {
                duration: 5000
            })

            if (import.meta.env.DEV) {
                console.log('Static 2FA codes:', data.static_codes)
            }
        },
        onError: (error: ApiError) => {
            console.error('Set static 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}

/**
 * ========================================
 * 2FA Verification Hooks
 * ========================================
 */

/**
 * useVerifyEmail2FA
 * -----------------------------------------
 * Vérifie le code de confirmation reçu par email
 * après activation du 2FA par email.
 *
 * Données envoyées : VerifyEmail2FAData { code }
 * Réponse : VerifyEmail2FAResponse { message }
 */


export function useVerifyEmail2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<VerifyEmail2FAResponse, ApiError, VerifyEmail2FAData>({
        mutationFn: verifyEmail2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Vérification réussie !', {
                duration: 3000
            })

            if (import.meta.env.DEV) {
                console.log('Email 2FA verified:', data)
            }
        },
        onError: (error: ApiError) => {
            console.error('Verify email 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}
/**
 * useVerifyTOTP2FA
 * -----------------------------------------
 * Vérifie le code TOTP après la configuration
 * (Google Authenticator, Authy…).
 *
 * Données : VerifyTOTP2FAData { code }
 * Réponse : VerifyTOTP2FAResponse { message }
 */

export function useVerifyTOTP2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<VerifyTOTP2FAResponse, ApiError, VerifyTOTP2FAData>({
        mutationFn: verifyTOTP2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Code TOTP vérifié !', {
                duration: 3000
            })

            if (import.meta.env.DEV) {
                console.log('TOTP 2FA verified:', data)
            }
        },
        onError: (error: ApiError) => {
            console.error('Verify TOTP 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}
/**
 * useVerifyStatic2FA
 * -----------------------------------------
 * Vérifie que les codes statiques ont bien été générés.
 *
 * Données : VerifyStatic2FAData { confirmation: boolean }
 * Réponse : VerifyStatic2FAResponse { message }
 */

export function useVerifyStatic2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<VerifyStatic2FAResponse, ApiError, VerifyStatic2FAData>({
        mutationFn: verifyStatic2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Code de secours vérifié !', {
                duration: 3000
            })

            if (import.meta.env.DEV) {
                console.log('Static 2FA verified:', data)
            }
        },
        onError: (error: ApiError) => {
            console.error('Verify static 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}

/**
 * ========================================
 * 2FA Disable Hooks
 * ========================================
 */
/**
 * useDisableEmail2FA
 * -----------------------------------------
 * Désactive la méthode Email 2FA.
 *
 * Réponse : DisableEmail2FAResponse { message }
 */

export function useDisableEmail2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<DisableEmail2FAResponse, ApiError, void>({
        mutationFn: disableEmail2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Authentification à deux facteurs par email désactivée.', {
                duration: 5000
            })

            if (import.meta.env.DEV) {
                console.log('Email 2FA disabled')
            }
        },
        onError: (error: ApiError) => {
            console.error('Disable email 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}
/**
 * useDisableTOTP2FA
 * -----------------------------------------
 * Désactive la méthode TOTP 2FA.
 *
 * Réponse : DisableTOTP2FAResponse { message }
 */

export function useDisableTOTP2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<DisableTOTP2FAResponse, ApiError, void>({
        mutationFn: disableTOTP2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'TOTP désactivé.', {
                duration: 5000
            })

            if (import.meta.env.DEV) {
                console.log('TOTP 2FA disabled')
            }
        },
        onError: (error: ApiError) => {
            console.error('Disable TOTP 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}
/**
 * useDisableStatic2FA
 * -----------------------------------------
 * Désactive les codes de secours.
 *
 * Réponse : DisableStatic2FAResponse { message }
 */

export function useDisableStatic2FA() {
    const { handleError } = useErrorHandler()

    return useMutation<DisableStatic2FAResponse, ApiError, void>({
        mutationFn: disableStatic2FAApi,
        onSuccess: (data) => {
            notify.success(data.message || 'Codes de secours désactivés.', {
                duration: 5000
            })

            if (import.meta.env.DEV) {
                console.log('Static 2FA disabled')
            }
        },
        onError: (error: ApiError) => {
            console.error('Disable static 2FA error:', error)
            handleError(error, { showToast: true, autoRedirect: false })
        },
    })
}

/**
 * ========================================
 * 2FA Login Hooks
 * ========================================
 */
/**
 * useEmail2FALogin
 * -----------------------------------------
 * Déclenche l’envoi d’un code 2FA par email lors
 * d’une tentative de connexion.
 *
 * Ne connecte PAS l’utilisateur — cela se fait après
 * vérification du code.
 *
 * Données : Email2FALoginData { email }
 * Réponse : Email2FALoginResponse { message }
 */

export function useEmail2FALogin() {
    const navigate = useNavigate()
    const { handleError } = useErrorHandler()

    const setUser = useAuthStore((state) => state.setUser)
    const setTokens = useAuthStore((state) => state.setTokens)

    return useMutation<Email2FALoginResponse, ApiError, Email2FALoginData>({
        mutationFn: email2FALoginApi,

        onSuccess: (data) => {
            console.log("Email 2FA login", data)

            // 1️⃣ Mise à jour des tokens (access en mémoire, refresh persistant)
            setTokens(data.access, data.refresh)

            // 2️⃣ Mise à jour du user
            setUser(data.user)

            // 3️⃣ Feedback
            notify.success("Connexion réussie avec Email 2FA !", { duration: 3000 })

            // 4️⃣ Redirection
            navigate({ to: "/" })
        },

        onError: (error: ApiError) => {
            console.error("Email 2FA login error:", error)
            handleError(error, { showToast: true, autoRedirect: true })
        },
    })
}

/**
 * useTOTP2FALogin
 * -----------------------------------------
 * Connexion via un code TOTP (Google Authenticator, etc.)
 *
 * Comportements :
 *  - setAuth + stockage tokens
 *  - stockage localStorage
 *  - redirection selon rôle
 *  - handleErrorWithRedirect gère :
 *      * session expirée
 *      * besoin de verify-email
 *      * besoin de reconfigurer 2FA
 *
 * Données : TOTP2FALoginData { code }
 * Réponse : TOTP2FALoginResponse { user, accessToken, refreshToken }
 */

export function useTOTP2FALogin() {
    const navigate = useNavigate()
    const { handleErrorWithRedirect } = useErrorHandler()

    const setUser = useAuthStore((state) => state.setUser)
    const setTokens = useAuthStore((state) => state.setTokens)

    return useMutation<TOTP2FALoginResponse, ApiError, TOTP2FALoginData>({
        mutationFn: totp2FALoginApi,

        onSuccess: (data) => {
            // ------------------------------
            // 🔥 Mise à jour sécurisée des tokens
            // ------------------------------
            setTokens(data.access, data.refresh)

            // ------------------------------
            // 🔥 Mise à jour du user dans le store
            // ------------------------------
            setUser(data.user)

            // ------------------------------
            // ❌ PAS de localStorage
            //    refreshToken est déjà persisté via zustand
            //    accessToken reste en mémoire
            // ------------------------------

            notify.success("Connexion réussie avec TOTP !", { duration: 3000 })

            // Redirection (role-based si tu veux)
            navigate({ to: "/" })
        },

        onError: (error: ApiError) => {
            console.error("TOTP 2FA login error:", error)
            handleErrorWithRedirect(error)
        },
    })
}


/**
 * useStatic2FALogin
 * -----------------------------------------
 * Connexion via un **code de secours (backup code)**.
 *
 * Ce hook :
 *  - appelle l’API static2FALoginApi
 *  - gère l’erreur via handleErrorWithRedirect
 *  - stocke les tokens + infos utilisateur dans le store Zustand
 *  - stocke les tokens dans localStorage
 *  - redirige automatiquement selon le rôle
 *
 * Données envoyées :
 *    Static2FALoginData { code }
 *
 * Réponse :
 *    Static2FALoginResponse {
 *       user,
 *       accessToken,
 *       refreshToken?
 *    }
 *
 * Notes :
 *  - Les codes sont à usage unique
 *  - Penser à informer l’utilisateur si le code est consommé
 *  - Idéal pour ajouter des logs de tentatives (sécurité)
 */

export function useStatic2FALogin() {
    const navigate = useNavigate()
    const { handleErrorWithRedirect } = useErrorHandler()

    const setUser = useAuthStore((state) => state.setUser)
    const setTokens = useAuthStore((state) => state.setTokens)

    return useMutation<Static2FALoginResponse, ApiError, Static2FALoginData>({
        mutationFn: static2FALoginApi,

        onSuccess: (data) => {
            // ------------------------------
            // 🔥 Mettre à jour les tokens proprement
            // ------------------------------
            setTokens(data.access, data.refresh)

            // ------------------------------
            // 🔥 Mettre à jour l'utilisateur
            // ------------------------------
            setUser(data.user)

            // ------------------------------
            // ❌ PAS de localStorage : store persist gère refreshToken
            //    accessToken reste en mémoire (plus sécurisé)
            // ------------------------------

            notify.success('Connexion réussie avec code de secours !', {
                duration: 3000,
            })

            navigate({ to: "/" })
        },

        onError: (error: ApiError) => {
            console.error("Static 2FA login error:", error)
            handleErrorWithRedirect(error)
        },
    })
}

