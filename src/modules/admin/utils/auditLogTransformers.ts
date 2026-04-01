import type { AuditLog } from '../types/auditLog';
import type { ActivityLogItem, ActivityTimelineItem } from '../components';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Mappe les types d'actions Django vers les types d'activité du frontend
 */
const actionTypeMap: Record<string, string> = {
    'login': 'login',
    'logout': 'logout',
    'create': 'user_created',
    'delete': 'user_deleted',
    'update': 'user_created', // On utilise user_created comme fallback
    'password_reset': 'security_alert',
    'role_change': 'permission_change',
    'permission_change': 'permission_change',
    'config_change': 'settings_change',
    'backup_initiated': 'backup',
    'restore_initiated': 'backup',
    'security_breach': 'security_alert',
    'failed_login': 'security_alert',
    'account_locked': 'security_alert',
    'view': 'login', // Pour l'exemple fourni
};

/**
 * Formate la date en format relatif (il y a X minutes/heures)
 */
function formatRelativeTime(timestamp: string): string {
    try {
        return formatDistanceToNow(new Date(timestamp), {
            addSuffix: true,
            locale: fr,
        });
    } catch {
        return timestamp;
    }
}

/**
 * Transforme un AuditLog en ActivityLogItem (pour le tableau)
 */
export function transformToActivityLogItem(log: AuditLog): ActivityLogItem {
    const activityType = actionTypeMap[log.action] || 'login';

    return {
        id: log.id,
        type: activityType as any,
        user: log.user_email || 'Système',
        action: log.description,
        timestamp: formatRelativeTime(log.timestamp),
        ip: log.ip_address || undefined,
        status: log.success ? 'success' : 'failed',
    };
}

/**
 * Transforme un AuditLog en ActivityTimelineItem (pour la timeline)
 */
export function transformToActivityTimelineItem(log: AuditLog): ActivityTimelineItem {
    const activityType = actionTypeMap[log.action] || 'login';

    // Construire les détails supplémentaires
    let details = '';
    if (log.entity_type && log.entity_id) {
        details = `${log.entity_type}: ${log.entity_id}`;
    }
    if (log.error_message) {
        details = log.error_message;
    }
    if (log.ip_address) {
        details = details ? `${details} (IP: ${log.ip_address})` : `IP: ${log.ip_address}`;
    }

    return {
        id: log.id,
        type: activityType as any,
        user: log.user_email || 'Système',
        action: log.description,
        timestamp: formatRelativeTime(log.timestamp),
        details: details || undefined,
    };
}

/**
 * Transforme un tableau d'AuditLog en ActivityLogItem[]
 */
export function transformToActivityLogItems(logs: AuditLog[]): ActivityLogItem[] {
    return logs.map(transformToActivityLogItem);
}

/**
 * Transforme un tableau d'AuditLog en ActivityTimelineItem[]
 */
export function transformToActivityTimelineItems(logs: AuditLog[]): ActivityTimelineItem[] {
    return logs.map(transformToActivityTimelineItem);
}
