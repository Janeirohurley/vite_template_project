import { useCallback, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'

const DEFAULT_RETRY_SECONDS = 15

const useAttemptReconnect = (retrySeconds: number) => {
    const refreshSession = useAuthStore((state) => state.refreshSession)
    const loadUser = useAuthStore((state) => state.loadUser)
    const setAuthStatus = useAuthStore((state) => state.setAuthStatus)
    const isReconnecting = useAuthStore((state) => state.isReconnecting)
    const setReconnectState = useAuthStore((state) => state.setReconnectState)

    return useCallback(async () => {
        if (isReconnecting) return

        setReconnectState({ isReconnecting: true, reconnectSeconds: retrySeconds })

        const result = await refreshSession()

        if (result.ok) {
            await loadUser()
            setReconnectState({ isReconnecting: false })
            return
        }

        if (result.reason === 'auth' || result.reason === 'no-token') {
            setAuthStatus('unauthenticated')
            setReconnectState({ isReconnecting: false })
            return
        }

        setReconnectState({ isReconnecting: false })
    }, [isReconnecting, loadUser, refreshSession, retrySeconds, setAuthStatus, setReconnectState])
}

export function useAuthReconnectState(retrySeconds: number = DEFAULT_RETRY_SECONDS) {
    const authStatus = useAuthStore((state) => state.authStatus)
    const reconnectSeconds = useAuthStore((state) => state.reconnectSeconds)
    const isReconnecting = useAuthStore((state) => state.isReconnecting)
    const isOnline = useAuthStore((state) => state.isOnline)
    const error = useAuthStore((state) => state.error)
    const attemptReconnect = useAttemptReconnect(retrySeconds)

    const shouldShow = authStatus === 'degraded' || isReconnecting

    const description = useMemo(() => {
        if (!isOnline) return 'Connexion internet perdue. En attente du réseau.'
        return error?.message || 'Erreur réseau détectée. Vérifiez votre connexion.'
    }, [error, isOnline])

    return {
        shouldShow,
        reconnectSeconds,
        isReconnecting,
        isOnline,
        description,
        attemptReconnect,
    }
}

export function useAuthReconnectController(retrySeconds: number = DEFAULT_RETRY_SECONDS) {
    const authStatus = useAuthStore((state) => state.authStatus)
    const reconnectSeconds = useAuthStore((state) => state.reconnectSeconds)
    const isReconnecting = useAuthStore((state) => state.isReconnecting)
    const isOnline = useAuthStore((state) => state.isOnline)
    const setReconnectState = useAuthStore((state) => state.setReconnectState)
    const attemptReconnect = useAttemptReconnect(retrySeconds)

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            setReconnectState({ isOnline: navigator.onLine })
        }
    }, [setReconnectState])

    useEffect(() => {
        if (authStatus === 'degraded') {
            setReconnectState({ reconnectSeconds: retrySeconds })
        }
    }, [authStatus, retrySeconds, setReconnectState])

    useEffect(() => {
        const handleOnline = () => {
            setReconnectState({ isOnline: true })
            if (authStatus === 'degraded') {
                void attemptReconnect()
            }
        }
        const handleOffline = () => setReconnectState({ isOnline: false })

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [authStatus, attemptReconnect, setReconnectState])

    useEffect(() => {
        const shouldShow = authStatus === 'degraded' || isReconnecting
        if (!shouldShow || !isOnline) return

        if (reconnectSeconds <= 0) {
            void attemptReconnect()
            return
        }

        const id = window.setTimeout(() => {
            setReconnectState({ reconnectSeconds: reconnectSeconds - 1 })
        }, 1000)

        return () => window.clearTimeout(id)
    }, [authStatus, isOnline, isReconnecting, reconnectSeconds, attemptReconnect, setReconnectState])
}
