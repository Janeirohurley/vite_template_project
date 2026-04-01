import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import type { ApiError } from '@/types/api'
import {
    getErrorRedirectAction,
    formatDjangoErrors,
    type ErrorRedirectAction
} from '@/lib/errorMessages'
import { useAuthStore } from '../store/authStore'
import { notify } from '@/lib'

/**
 * Hook personnalisé pour gérer les erreurs API de manière centralisée
 * Gère l'affichage des messages d'erreur et les redirections automatiques
 */
export function useErrorHandler() {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    /**
     * Effectue la redirection basée sur l'action déterminée
     */
    const performRedirect = useCallback((action: ErrorRedirectAction) => {
        switch (action.type) {
            case 'login':
                // Déconnecter l'utilisateur et rediriger vers login
                logout()

                navigate({ to: '/auth/login' })
                break

            case 'verify-email':
                // Rediriger vers la page de vérification email

                navigate({
                    to: '/auth/verify-email',
                    search: {
                        email: action.email,
                        from: action.from || '/auth/login' // Paramètre obligatoire pour la protection
                    }
                })
                break

            case '2fa-setup':
                // Rediriger vers la configuration 2FA

                navigate({
                    to: '/auth/2fa/setup',
                    search: action.method ? { method: action.method } : undefined
                })
                break
            case "2fa-login":
                navigate({
                    to: '/auth/2fa/login',
                    search: {
                        email: action.extra.email,
                        method: action.method
                    }
                })
                break;

            case 'none':
            default:
                // Aucune redirection nécessaire
                break
        }
    }, [navigate, logout])

    /**
     * Gère une erreur API et retourne les informations formatées
     * @param error - Erreur API à traiter
     * @param options - Options pour personnaliser le comportement
     * @returns Informations sur l'erreur traitée
     */
    const handleError = useCallback((
        error: ApiError,
        options?: {
            showToast?: boolean // Afficher automatiquement un notify (défaut: true)
            autoRedirect?: boolean // Rediriger automatiquement si nécessaire (défaut: true)
            customMessage?: string // Message personnalisé à afficher
            onRedirect?: (action: ErrorRedirectAction) => void // Callback avant redirection
            userEmail?: string // Email saisi par l'utilisateur (toujours prioritaire)
        }
    ) => {
        const {
            showToast = true,
            autoRedirect = true,
            customMessage,
            onRedirect,
            userEmail
        } = options || {}

        // Extraire le code d'erreur
        const errorCode = error.errorCode || 'UnknownError'

        // Utiliser le message original du backend
        const originalMessage = customMessage || error.message
        console.log(originalMessage, error)
        // Afficher le notify si demandé
        if (showToast) {
            // Déterminer le type de notify basé sur le code d'erreur
            if (errorCode === 'EmailNotVerified' || errorCode.includes('NotSet')) {
              
                notify.info(originalMessage)
            } else if (errorCode === 'NetworkError' || errorCode === 'ServerError') {
               
                notify.error(originalMessage, { duration: 5000 })
            } else {
                notify.error(originalMessage)
                
            }

          
           
        }

        // Déterminer l'action de redirection
        let redirectAction = getErrorRedirectAction(errorCode, error.extra)
        // Si besoin, enrichir l'action avec l'email utilisateur fourni
        if (redirectAction.type === 'verify-email') {
            redirectAction = {
                ...redirectAction,
                email: userEmail,
                from: '/auth/login',
            }
        }
        // Effectuer la redirection si nécessaire
        if (autoRedirect && redirectAction.type !== 'none') {
            if (onRedirect) {
                onRedirect(redirectAction)
            }
            performRedirect(redirectAction)
        }

        // Retourner les informations sur l'erreur pour un traitement supplémentaire si nécessaire
        return {
            errorCode,
            message: originalMessage,
            redirectAction,
            fieldErrors: error.errors ? formatDjangoErrors(error.errors) : {}
        }
    }, [performRedirect])

    /**
     * Variante simplifiée pour les cas où on veut juste afficher un message
     */
    const showError = useCallback((error: ApiError, customMessage?: string) => {
        return handleError(error, {
            showToast: true,
            autoRedirect: false,
            customMessage
        })
    }, [handleError])

    /**
     * Variante pour gérer les erreurs avec redirection automatique
     */
    const handleErrorWithRedirect = useCallback((error: ApiError, onRedirect?: (action: ErrorRedirectAction) => void) => {
        return handleError(error, {
            showToast: true,
            autoRedirect: true,
            onRedirect
        })
    }, [handleError])

    return {
        handleError,
        showError,
        handleErrorWithRedirect,
        performRedirect
    }
}
