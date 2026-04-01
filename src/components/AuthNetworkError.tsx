import { RefreshCw, WifiOff } from 'lucide-react'
import { useAuthReconnectState } from '@/modules/auth/hooks/useAuthReconnect'

export function AuthNetworkError() {
    const {
        reconnectSeconds,
        isReconnecting,
        isOnline,
        description,
        attemptReconnect,
    } = useAuthReconnectState()

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-lg dark:border-amber-900/50 dark:bg-gray-900">
                <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        <WifiOff className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Problème de connexion
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                    {isOnline ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Reconnexion automatique dans {reconnectSeconds}s
                        </span>
                    ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            En attente du réseau...
                        </span>
                    )}
                    <button
                        onClick={attemptReconnect}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
                        disabled={isReconnecting || !isOnline}
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
                        {isReconnecting ? 'Reconnexion...' : 'Reconnecter'}
                    </button>
                </div>
            </div>
        </div>
    )
}
