import { useAuthReconnectController, useAuthReconnectState } from '@/modules/auth/hooks/useAuthReconnect'
import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, WifiOff } from 'lucide-react'

export function AuthReconnectPopover() {
    useAuthReconnectController()
    const {
        shouldShow,
        reconnectSeconds,
        isReconnecting,
        isOnline,
        description,
        attemptReconnect,
    } = useAuthReconnectState()

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-6 right-6 z-[60] w-[360px] rounded-2xl border border-amber-200 bg-white shadow-xl dark:border-amber-900/50 dark:bg-gray-900"
                >
                    <div className="flex items-start gap-3 p-4">
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            <WifiOff className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Connexion instable
                            </h3>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
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
                                    className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
                                    disabled={isReconnecting || !isOnline}
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
                                    {isReconnecting ? 'Reconnexion...' : 'Reconnecter'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
