import { useMutation } from '@tanstack/react-query';
import { notify } from '@/lib';
import { tokenRefreshApi, type TokenRefreshData, type TokenRefreshResponse } from '../api/tokenRefresh';
import type { ApiError } from '@/types/api';
import { useErrorHandler } from './useErrorHandler';
import { useAuthStore } from '../store/authStore';

/**
 * Hook pour rafraîchir le token d'accès
 * Utilisé lorsque le token d'accès expire
 */
export function useTokenRefresh() {
    const { handleError } = useErrorHandler();

    return useMutation<TokenRefreshResponse, ApiError, TokenRefreshData>({
        mutationFn: tokenRefreshApi,
        onSuccess: (data) => {
            // Mettre à jour le store (accessToken en mémoire, refreshToken persisté)
            const store = useAuthStore.getState();
            store.setAccessToken(data.access);

            if (data.refresh) {
                store.setTokens?.(data.access, data.refresh); // si la méthode est exposée dans le store
            }

            if (import.meta.env.DEV) {
                console.log('Token refreshed successfully');
            }
        },
        onError: (error: ApiError) => {
            console.error('Token refresh error:', error);

            const errorInfo = handleError(error, {
                showToast: false, // éviter le spam
                autoRedirect: true,
            });

            if (errorInfo.errorCode === 'Unauthorized' || errorInfo.errorCode === 'InvalidToken') {
                notify.error('Votre session a expiré. Veuillez vous reconnecter.');
            }

            if (import.meta.env.DEV) {
                console.log('Error Info:', errorInfo);
            }

            // Déconnecter l'utilisateur
            useAuthStore.getState().logout();
        },
    });
}

/**
 * Fonction utilitaire pour rafraîchir automatiquement le token
 * Peut être utilisée dans un intercepteur axios
 */
export async function refreshToken(): Promise<string | null> {
    const store = useAuthStore.getState();
    const refreshToken = store.refreshToken;

    if (!refreshToken) {
        console.warn('No refresh token available');
        return null;
    }

    try {
        const response = await tokenRefreshApi({ refresh: refreshToken });

        // Mettre à jour le store
        store.setAccessToken(response.access);

        if (response.refresh) {
            store.setTokens?.(response.access, response.refresh);
        }

        return response.access;
    } catch (error) {
        console.error('Failed to refresh token:', error);

        // Déconnecter l'utilisateur
        store.logout();

        return null;
    }
}
