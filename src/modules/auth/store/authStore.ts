import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import type { ApiError } from "@/types/api";
import { canAccess } from "@/lib/permissions";
import { getUserApi, tokenRefreshApi } from "../api";
import { logger, notify } from "@/lib";
import { logoutApi } from "../api/logout";

// Variable globale pour stocker l'intervalle de rafraîchissement
let refreshInterval: ReturnType<typeof setInterval> | null = null;
let initializePromise: Promise<void> | null = null;

type RefreshFailureReason = "no-token" | "auth" | "network" | "unknown";
type AuthStatus = "checking" | "authenticated" | "unauthenticated" | "degraded";
type ReconnectStatus = {
    reconnectSeconds: number;
    isReconnecting: boolean;
    isOnline: boolean;
};

type RefreshResult =
    | { ok: true }
    | { ok: false; reason: RefreshFailureReason };

const getStatusCode = (error: unknown): number | undefined => {
    if (!error || typeof error !== "object") return undefined;
    const maybe = error as { statusCode?: number; response?: { status?: number } };
    return maybe.statusCode ?? maybe.response?.status;
};

const isAuthError = (error: unknown): boolean => {
    const status = getStatusCode(error);
    return status === 401 || status === 403;
};

const isNetworkError = (error: unknown): boolean => {
    if (!error || typeof error !== "object") return false;
    const maybe = error as ApiError;
    return maybe.errorCode === "NetworkError";
};

interface AuthState {
    user: User | null;
    accessToken: string | null; // mémoire seulement
    refreshToken: string | null; // persisté
    isAuthenticated: boolean;
    isLoading: boolean;
    error: ApiError | null;
    authStatus: AuthStatus;
    hasHydrated: boolean;
    hasInitialized: boolean;
    isInitializing: boolean;
    reconnectSeconds: number;
    isReconnecting: boolean;
    isOnline: boolean;

    // Actions
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setAccessToken: (accessToken: string) => void;
    setTokens: (access: string, refresh?: string | null) => void;
    setAuthStatus: (status: AuthStatus) => void;
    setHasHydrated: (hasHydrated: boolean) => void;
    setReconnectState: (state: Partial<ReconnectStatus>) => void;

    loadUser: () => Promise<void>;
    refreshSession: () => Promise<RefreshResult>;
    initialize: () => Promise<void>;
    clearError: () => void;

    hasRole: (role: string | UserRole) => boolean;
    canAccess: (resource: string) => boolean;

    // Nouvelles actions pour le rafraîchissement automatique
    startAutoRefresh: () => void;
    stopAutoRefresh: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            authStatus: "checking",
            hasHydrated: false,
            hasInitialized: false,
            isInitializing: false,
            reconnectSeconds: 15,
            isReconnecting: false,
            isOnline: true,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: true, error: null, authStatus: "authenticated" }),
            setTokens: (access, refresh) =>
                set({
                    accessToken: access,
                    refreshToken: refresh ?? get().refreshToken,
                    isAuthenticated: true,
                    error: null,
                    authStatus: "authenticated",
                }),
            setAuthStatus: (status) => set({ authStatus: status }),
            setHasHydrated: (hasHydrated) => set({ hasHydrated }),
            setReconnectState: (state) => set(state),

            loadUser: async () => {
                set({ isLoading: true });
                try {
                    const user = await getUserApi();
                    set({ user, isAuthenticated: true, authStatus: "authenticated", error: null });
                } catch (error) {
                    if (isAuthError(error)) {
                        set({ user: null, isAuthenticated: false, error: error as ApiError, authStatus: "unauthenticated" });
                        return;
                    }
                    // Erreur réseau / 5xx : garder la session, juste remonter l'erreur
                    set({ error: error as ApiError, authStatus: "degraded" });
                } finally {
                    set({ isLoading: false });
                }
            },

            refreshSession: async () => {
                try {
                    const { refreshToken } = get();
                    if (!refreshToken) return { ok: false, reason: "no-token" };

                    const data = await tokenRefreshApi({ refresh: refreshToken });
                    if (!data.access) return { ok: false, reason: "unknown" };

                    get().setTokens(data.access, data.refresh);
                    set({ authStatus: "authenticated", error: null });
                    return { ok: true };
                } catch (error) {
                    logger.error(error);
                    if (isAuthError(error)) {
                        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false, error: error as ApiError, authStatus: "unauthenticated" });
                        return { ok: false, reason: "auth" };
                    }
                    // Erreur réseau / 5xx : ne pas déconnecter
                    set({ error: error as ApiError, authStatus: "degraded" });
                    return { ok: false, reason: isNetworkError(error) ? "network" : "unknown" };
                }
            },
            logout: async () => {
                try {
                    // Appel à l’API Django
                    await logoutApi();
                    localStorage.clear();
                    // Arrêter ton auto-refresh
                    get().stopAutoRefresh();

                    // Reset du store
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        error: null,
                        authStatus: "unauthenticated",
                        hasInitialized: true,
                        isInitializing: false,
                    });

                } catch (error) {
                    // Si erreur API, tu la stockes ou tu la lances
                    console.error("Erreur lors du logout:", error);

                    // OPTION 1 — laisser le user connecté mais remonter l’erreur :
                    set({ error: error as ApiError });

                    // OPTION 2 — forcer le logout même si l’API a échoué :
                    // (tu me dis si tu veux cette version)
                }
            },

            initialize: async () => {
                if (get().hasInitialized) return;
                if (initializePromise) return initializePromise;

                initializePromise = (async () => {
                    notify.info('Initialisation du store auth');
                    set({ isInitializing: true, authStatus: "checking" });

                    const { refreshToken } = get();
                    if (!refreshToken) {
                        set({
                            user: null,
                            accessToken: null,
                            isAuthenticated: false,
                            authStatus: "unauthenticated",
                            hasInitialized: true,
                            isInitializing: false,
                        });
                        return;
                    }

                    const result = await get().refreshSession();

                    if (!result.ok) {
                        notify.info('Refresh échoué, réinitialisation');
                        if (result.reason === "auth" || result.reason === "no-token") {
                            set({
                                user: null,
                                accessToken: null,
                                isAuthenticated: false,
                                authStatus: "unauthenticated",
                                hasInitialized: true,
                                isInitializing: false,
                            });
                            return;
                        }
                        // Erreur réseau / 5xx : on conserve la session si possible
                        set({ authStatus: "degraded" });
                        get().startAutoRefresh();
                        set({ hasInitialized: true, isInitializing: false });
                        return;
                    }

                    await get().loadUser();

                    // Démarrer le rafraîchissement automatique après l'initialisation
                    get().startAutoRefresh();

                    set({ hasInitialized: true, isInitializing: false });
                })();

                try {
                    await initializePromise;
                } finally {
                    initializePromise = null;
                }
            },

            clearError: () => set({ error: null }),

            hasRole: (role) => {
                const user = get().user;
                if (!user?.role) return false;
                return typeof role === "string" ? user.role.name === role : user.role.name === role.name;
            },

            canAccess: (resource) => {
                const user = get().user;
                if (!user) return false;
                return canAccess(user.role, resource);
            },

            // Démarrer le rafraîchissement automatique du token toutes les 3 minutes
            startAutoRefresh: () => {
                // Si un intervalle existe déjà, ne rien faire
                if (refreshInterval !== null) {
                    logger.info('Auto-refresh déjà actif');
                    return;
                }

                logger.info('Démarrage du rafraîchissement automatique du token (toutes les 3 minutes)');

                // Rafraîchir le token toutes les 3 minutes (180000 ms)
                refreshInterval = setInterval(async () => {
                    const { refreshToken, authStatus } = get();

                    if (!refreshToken || authStatus === "unauthenticated") {
                        logger.warn('Utilisateur non authentifié, arrêt du rafraîchissement automatique');
                        get().stopAutoRefresh();
                        return;
                    }

                    logger.info('Rafraîchissement automatique du token...');
                    const result = await get().refreshSession();

                    if (result.ok) {
                        logger.info('Token rafraîchi avec succès');
                        // Rafraîchir aussi les informations utilisateur
                        await get().loadUser();
                    } else {
                        if (result.reason === "auth" || result.reason === "no-token") {
                            logger.error('Échec du rafraîchissement du token');
                            get().stopAutoRefresh();
                        } else {
                            logger.warn('Rafraîchissement temporairement indisponible, nouvel essai au prochain intervalle');
                        }
                    }
                }, 180000); // 3 minutes = 180000 ms
            },

            // Arrêter le rafraîchissement automatique
            stopAutoRefresh: () => {
                if (refreshInterval !== null) {
                    logger.info('Arrêt du rafraîchissement automatique du token');
                    clearInterval(refreshInterval);
                    refreshInterval = null;
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ refreshToken: state.refreshToken }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
