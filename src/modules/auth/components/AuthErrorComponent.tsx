import { type ErrorComponentProps } from '@tanstack/react-router'
import { ErrorDisplay } from '@/components/ErrorDisplay'

/**
 * Composant d'erreur générique pour les routes d'authentification
 * Détecte et affiche des messages appropriés selon le type d'erreur HTTP ou réseau
 */
export function AuthErrorComponent({ error }: ErrorComponentProps) {
    // Valeurs par défaut
    let title = 'Erreur d\'authentification'
    let message = 'Une erreur est survenue lors de l\'authentification.'
    let backUrl = '/auth/login'
    let backButtonText = 'Retour à la connexion'

    // Analyser l'erreur pour personnaliser le message
    if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()

        // 401 - Non autorisé (pas connecté)
        if (errorMsg.includes('401') || errorMsg.includes('unauthorized')) {
            title = 'Authentification requise'
            message = 'Vous devez vous connecter pour accéder à cette page. Votre session a peut-être expiré.'
            backUrl = '/auth/login'
            backButtonText = 'Se connecter'
        }
        // 403 - Interdit (connecté mais pas de permissions)
        else if (errorMsg.includes('403') || errorMsg.includes('forbidden')) {
            title = 'Accès refusé'
            message = 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource. Contactez un administrateur si vous pensez qu\'il s\'agit d\'une erreur.'
            backUrl = '/'
            backButtonText = 'Retour à l\'accueil'
        }
        // 404 - Page non trouvée
        else if (errorMsg.includes('404') || errorMsg.includes('not found')) {
            title = 'Page introuvable'
            message = 'La page que vous recherchez n\'existe pas ou a été déplacée.'
            backUrl = '/'
            backButtonText = 'Retour à l\'accueil'
        }
        // 400 - Mauvaise requête
        else if (errorMsg.includes('400') || errorMsg.includes('bad request')) {
            title = 'Requête invalide'
            message = 'Les données envoyées sont incorrectes. Veuillez réessayer.'
        }
        // 422 - Erreur de validation
        else if (errorMsg.includes('422') || errorMsg.includes('validation')) {
            title = 'Données invalides'
            message = 'Les informations fournies ne sont pas valides. Vérifiez vos données et réessayez.'
        }
        // 429 - Trop de requêtes
        else if (errorMsg.includes('429') || errorMsg.includes('too many')) {
            title = 'Trop de tentatives'
            message = 'Vous avez effectué trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.'
        }
        // 500 - Erreur serveur
        else if (errorMsg.includes('500') || errorMsg.includes('internal server') || errorMsg.includes('server error')) {
            title = 'Erreur serveur'
            message = 'Le serveur rencontre un problème technique. Nos équipes ont été informées. Veuillez réessayer dans quelques instants.'
            backUrl = '/'
            backButtonText = 'Retour à l\'accueil'
        }
        // 502/503/504 - Erreurs de service
        else if (errorMsg.includes('502') || errorMsg.includes('503') || errorMsg.includes('504') || errorMsg.includes('unavailable') || errorMsg.includes('gateway')) {
            title = 'Service temporairement indisponible'
            message = 'Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.'
            backUrl = '/'
            backButtonText = 'Retour à l\'accueil'
        }
        // Erreur réseau
        else if (errorMsg.includes('network') || errorMsg.includes('réseau') || errorMsg.includes('fetch') || errorMsg.includes('timeout')) {
            title = 'Problème de connexion'
            message = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.'
            backUrl = '/auth/login'
            backButtonText = 'Réessayer'
        }
        // Session expirée
        else if (errorMsg.includes('session') || errorMsg.includes('expired') || errorMsg.includes('expiré')) {
            title = 'Session expirée'
            message = 'Votre session a expiré pour des raisons de sécurité. Veuillez vous reconnecter.'
            backUrl = '/auth/login'
            backButtonText = 'Se reconnecter'
        }
        // Identifiants incorrects
        else if (errorMsg.includes('invalid credentials') || errorMsg.includes('incorrect') || errorMsg.includes('identifiants')) {
            title = 'Identifiants incorrects'
            message = 'L\'email ou le mot de passe est incorrect. Veuillez réessayer.'
            backUrl = '/auth/login'
            backButtonText = 'Réessayer'
        }
        // Compte bloqué
        else if (errorMsg.includes('locked') || errorMsg.includes('blocked') || errorMsg.includes('bloqué')) {
            title = 'Compte bloqué'
            message = 'Votre compte a été temporairement bloqué. Contactez le support pour plus d\'informations.'
            backUrl = '/auth/login'
            backButtonText = 'Contactez le support'
        }
        // Email non vérifié
        else if (errorMsg.includes('verify') || errorMsg.includes('verification') || errorMsg.includes('vérifier')) {
            title = 'Email non vérifié'
            message = 'Veuillez vérifier votre adresse email avant de vous connecter. Consultez votre boîte de réception.'
            backUrl = '/auth/login'
            backButtonText = 'Retour à la connexion'
        }
        // Message d'erreur générique
        else {
            message = error.message || 'Une erreur inattendue est survenue.'
        }
    }
    // Si l'erreur est une chaîne de caractères
    else if (typeof error === 'string') {
        message = error
    }

    return (
        <ErrorDisplay
            title={title}
            message={message}
            backUrl={backUrl}
            backButtonText={backButtonText}
        />
    )
}
