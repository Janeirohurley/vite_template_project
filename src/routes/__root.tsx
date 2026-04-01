import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useSettings } from '@/store/settings'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { GenericErrorComponent } from '@/components/GenericErrorComponent'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AuthReconnectPopover } from '@/components/AuthReconnectPopover'

const queryClient = new QueryClient()

function RootComponent() {
    const [isReady, setIsReady] = useState(false)
    const initializeAuth = useAuthStore((state) => state.initialize)
    const hasHydrated = useAuthStore((state) => state.hasHydrated)
    const showRouterDevtools =
        import.meta.env.VITE_SHOW_ROUTER_DEVTOOLS === 'true';




    // Initialiser les stores au démarrage
    useEffect(() => {
        if (!hasHydrated) return;

        const init = async () => {
            useSettings.getState().loadFromStorage()
            await initializeAuth()
            setIsReady(true)
        }

        init()
    }, [hasHydrated, initializeAuth])

    if (!isReady) {
        return <LoadingSpinner /> // spinner tant que l'auth n'est pas chargée
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
                <Outlet />
                <AuthReconnectPopover />
                <Toaster position="top-right" />
                {showRouterDevtools && <TanStackRouterDevtools />}
            </div>
        </QueryClientProvider>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
    errorComponent: GenericErrorComponent,
    notFoundComponent: () => {
        window.location.href = '/not-found'
        return null
    },
})
