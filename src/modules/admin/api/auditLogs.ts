import axios from '@/lib/axios';
import type { AuditLog, AuditLogsResponse, AuditLogsParams } from '../types/auditLog';
import type { DjangoSuccessResponse, ApiError } from '@/types/api';

/**
 * Récupère les logs d'audit depuis le backend
 * Endpoint: /dashboard/admin/audit-logs
 */
export async function getAuditLogsApi(params?: AuditLogsParams): Promise<AuditLogsResponse> {
    console.log('🔍 Axios baseURL:', axios.defaults.baseURL);
    console.log('🔍 Full URL:', axios.defaults.baseURL + '/dashboard/admin/audit-logs');
    try {
        const response = await axios.get<DjangoSuccessResponse<AuditLogsResponse | AuditLog[]>>(
            '/dashboard/admin/audit-logs',
            { params }
        );

        // Les données sont déjà unwrapped par l'intercepteur
        const data = response.data.data as unknown as AuditLogsResponse | AuditLog[];

        // Si le backend renvoie directement un tableau, on le transforme en format paginé
        if (Array.isArray(data)) {
            return {
                results: data,
                count: data.length,
                next: null,
                previous: null,
            };
        }

        // Sinon, on retourne les données telles quelles (format paginé)
        return data;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Récupère un log d'audit spécifique par son ID
 */
export async function getAuditLogByIdApi(id: string): Promise<AuditLog> {
    try {
        const response = await axios.get<DjangoSuccessResponse<AuditLog>>(
            `/dashboard/admin/audit-logs/${id}`
        );

        return response.data.data as unknown as AuditLog;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}
