import { useQuery } from '@tanstack/react-query';
import { getAuditLogsApi } from '../api/auditLogs';
import type { AuditLogsParams, AuditLogsResponse } from '../types/auditLog';
import type { ApiError } from '@/types/api';

/**
 * Hook pour récupérer les logs d'audit
 * Utilise React Query pour la gestion du cache et des états
 */
export function useAuditLogs(params?: AuditLogsParams) {
    return useQuery<AuditLogsResponse, ApiError>({
        queryKey: ['auditLogs', params],
        queryFn: () => getAuditLogsApi(params),
        staleTime: 30000, // Les données sont considérées fraîches pendant 30 secondes
        refetchInterval: 120000, // Rafraîchir automatiquement toutes les 2 minutes (120 secondes)
        retry: 2, // Réessayer 2 fois en cas d'échec
    });
}

/**
 * Hook pour récupérer les logs récents (pour le dashboard)
 * Récupère les 10 derniers logs par défaut
 */
export function useRecentAuditLogs(limit = 10) {
    return useQuery<AuditLogsResponse, ApiError>({
        queryKey: ['auditLogs', 'recent', limit],
        queryFn: () => getAuditLogsApi({ page_size: limit, page: 1 }),
        staleTime: 30000,
        refetchInterval: 120000, // Rafraîchir automatiquement toutes les 2 minutes (120 secondes)
        retry: 2,
    });
}
