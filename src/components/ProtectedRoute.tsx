import { type ReactNode } from 'react'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { Navigate } from '@tanstack/react-router'
import type { UserRole } from '@/types'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AuthNetworkError } from '@/components/AuthNetworkError'

type Role = string | UserRole | '*'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRole?: Role
    allowedRoles?: Role[]
    fallbackPath?: string
}

export function ProtectedRoute({
    children,
    requiredRole,
    allowedRoles,
    fallbackPath = '/auth/login',
}: ProtectedRouteProps) {
    const { isAuthenticated, user, hasRole, authStatus } = useAuthStore()

    if (authStatus === "checking") {
        return <LoadingSpinner />
    }
    if (authStatus === "degraded") {
        return <AuthNetworkError />
    }

    // Not authenticated
    if (authStatus === "unauthenticated" || !isAuthenticated || !user) {
        return <Navigate to={fallbackPath} />
    }

    // requiredRole = "*": allow all authenticated users
    if (requiredRole && requiredRole !== '*' && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" />
    }

    // allowedRoles contains "*": allow all authenticated users
    if (
        allowedRoles &&
        !allowedRoles.includes('*') &&
        !allowedRoles.some(role => role !== '*' && hasRole(role))
    ) {
        return <Navigate to="/unauthorized" />
    }

    return <>{children}</>
}
