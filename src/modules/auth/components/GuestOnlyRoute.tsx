/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import { Navigate, useSearch } from '@tanstack/react-router'
import { useAuthStore } from '../store/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AuthNetworkError } from '@/components/AuthNetworkError'

export interface GuestOnlyRouteProps {
    children: ReactNode
    redirectTo?: string
}

/**
 * Composant pour les routes accessibles uniquement aux visiteurs non authentifiés
 * Redirige les utilisateurs connectés vers leur dashboard ou une page spécifiée
 *
 * @example
 * <GuestOnlyRoute>
 *   <LoginPage />
 * </GuestOnlyRoute>
 *
 * @example
 * <GuestOnlyRoute redirectTo="/profile">
 *   <RegisterPage />
 * </GuestOnlyRoute>
 */
export function GuestOnlyRoute({
    children,
    redirectTo,
}: GuestOnlyRouteProps) {
    const search = useSearch({ strict: false }) as { redirect?: string }
    const { user, isAuthenticated, authStatus } = useAuthStore()

    if (authStatus === "checking") {
        return <LoadingSpinner />
    }
    if (authStatus === "degraded") {
        return <AuthNetworkError />
    }

    // Si l'utilisateur est authentifié, le rediriger
    if (isAuthenticated && user) {
        // Utiliser la redirection depuis les paramètres de recherche si disponible
        if (search.redirect) {
            return <Navigate to={search.redirect as any} />
        }

        // Sinon, utiliser la redirection personnalisée ou le dashboard par défaut
        if (redirectTo) {
            return <Navigate to={redirectTo as any} />
        }

        // Redirection par défaut basée sur le rôle
        switch (user.role.name) {
            case 'admin':
                return <Navigate to="/admin/dashboard" />
            case 'teacher':
                return <Navigate to="/teacher/dashboard" />
            case 'student':
                return <Navigate to="/student/dashboard" />
            default:
                return <Navigate to="/" />
        }
    }

    // L'utilisateur n'est pas connecté, afficher la page
    return <>{children}</>
}
