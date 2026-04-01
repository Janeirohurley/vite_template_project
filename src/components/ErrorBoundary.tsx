import { Component, type ReactNode, type ErrorInfo } from "react";
import { ErrorDisplay } from "./ErrorDisplay";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Composant pour capturer les erreurs React
 *
 * Utilisation:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Mettre à jour l'état pour afficher l'UI de fallback au prochain rendu
        console.error('ErrorBoundary caught an error:', error);
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Logger l'erreur dans la console
        console.error('ErrorBoundary - Error details:', {
            error,
            errorInfo,
            componentStack: errorInfo.componentStack
        });

        // Mettre à jour l'état avec les informations d'erreur
        this.setState({
            errorInfo
        });

        // Appeler le callback onError si fourni
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Optionnel: Envoyer l'erreur à un service de monitoring
        // Exemples: Sentry, LogRocket, etc.
        // logErrorToService(error, errorInfo);
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Si un fallback personnalisé est fourni, l'utiliser
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Sinon, utiliser le composant ErrorDisplay par défaut
            return (
                <ErrorDisplay
                    title="Une erreur inattendue s'est produite"
                    message={
                        this.state.error?.message ||
                        "L'application a rencontré une erreur. Veuillez réessayer."
                    }
                    backUrl="/"
                    backButtonText="Retour à l'accueil"
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
