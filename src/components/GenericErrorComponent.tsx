import { type ErrorComponentProps } from '@tanstack/react-router'
import { ErrorDisplay } from './ErrorDisplay'

export function GenericErrorComponent({ error }: ErrorComponentProps) {
    let title = 'Une erreur est survenue'
    let message = 'Quelque chose s\'est mal passé. Veuillez réessayer.'

    if (error instanceof Error) {
        title = error.name || 'Erreur'
        message = error.message
    } else if (typeof error === 'string') {
        message = error
    }

    return (
        <ErrorDisplay
            title={title}
            message={message}
            backUrl="/"
            backButtonText="Retour à l'accueil"
        />
    )
}
