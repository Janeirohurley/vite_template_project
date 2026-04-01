import { type ErrorComponentProps } from '@tanstack/react-router'
import { ErrorDisplay } from '@/components/ErrorDisplay'

/**
 * Composant d'erreur pour la page de changement de mot de passe
 * Gère différents types d'erreurs liées au token de réinitialisation
 */
export function ChangePasswordErrorComponent({ error }: ErrorComponentProps) {
    // Valeurs par défaut
    let title = 'Erreur de réinitialisation'
    let message = 'Une erreur est survenue lors de la réinitialisation de votre mot de passe.'
    let backUrl = '/auth/forgot-password'
    let backButtonText = 'Demander un nouveau lien'

    // Analyser l'erreur pour personnaliser le message
    if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()

        // Token manquant dans l'URL
        if (errorMsg.includes('token manquant') || errorMsg.includes('missing')) {
            title = 'Lien incomplet'
            message = 'Le lien de réinitialisation est incomplet. Veuillez utiliser le lien complet envoyé par email.'
        }
        // Token invalide ou expiré
        else if (errorMsg.includes('invalide') || errorMsg.includes('expiré') || errorMsg.includes('invalid') || errorMsg.includes('expired')) {
            title = 'Lien expiré ou invalide'
            message = 'Ce lien n\'est plus valide. Les liens de réinitialisation expirent après 24 heures pour votre sécurité.'
        }
        // Token déjà utilisé
        else if (errorMsg.includes('utilisé') || errorMsg.includes('used')) {
            title = 'Lien déjà utilisé'
            message = 'Ce lien a déjà été utilisé. Pour changer votre mot de passe à nouveau, demandez un nouveau lien.'
        }
        // Erreur réseau
        else if (errorMsg.includes('network') || errorMsg.includes('réseau') || errorMsg.includes('fetch')) {
            title = 'Problème de connexion'
            message = 'Impossible de vérifier le lien. Vérifiez votre connexion internet et réessayez.'
            backUrl = '/auth/login'
            backButtonText = 'Retour à la connexion'
        }
        // Erreur serveur (500)
        else if (errorMsg.includes('500') || errorMsg.includes('server')) {
            title = 'Erreur serveur'
            message = 'Le serveur rencontre un problème. Réessayez dans quelques instants.'
        }
        // Erreur 404
        else if (errorMsg.includes('404') || errorMsg.includes('not found')) {
            title = 'Lien introuvable'
            message = 'Ce lien de réinitialisation n\'existe pas ou a été supprimé.'
        }
        // Erreur 429 (trop de requêtes)
        else if (errorMsg.includes('429') || errorMsg.includes('too many')) {
            title = 'Trop de tentatives'
            message = 'Trop de tentatives de réinitialisation. Veuillez patienter quelques minutes avant de réessayer.'
        }
        // Utiliser le message d'erreur brut
        else {
            message = error.message
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
