import type { AuditLog, ActionType, SeverityLevel } from './auditLog';

/**
 * Type pour représenter un audit log dans le DataTable
 */
export interface AuditLogTableRow {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    severity: SeverityLevel;
    entityType: string;
    description: string;
    ipAddress: string;
    success: boolean;
}

/**
 * Convertit un AuditLog en AuditLogTableRow pour l'affichage dans le tableau
 */
export function mapAuditLogToTableRow(log: AuditLog): AuditLogTableRow {
    return {
        id: log.id,
        timestamp: new Date(log.timestamp).toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }),
        user: log.user_email || 'Système',
        action: formatAction(log.action),
        severity: log.severity,
        entityType: log.entity_type || '-',
        description: log.description,
        ipAddress: log.ip_address || '-',
        success: log.success,
    };
}

/**
 * Formate le type d'action pour l'affichage
 */
function formatAction(action: ActionType): string {
    const actionLabels: Record<ActionType, string> = {
        login: 'Connexion',
        logout: 'Déconnexion',
        create: 'Création',
        update: 'Modification',
        delete: 'Suppression',
        password_reset: 'Réinitialisation mot de passe',
        role_change: 'Changement de rôle',
        permission_change: 'Changement de permissions',
        config_change: 'Changement de configuration',
        backup_initiated: 'Sauvegarde initiée',
        restore_initiated: 'Restauration initiée',
        security_breach: 'Violation de sécurité',
        failed_login: 'Échec de connexion',
        account_locked: 'Compte verrouillé',
        view: 'Consultation',
    };

    return actionLabels[action] || action;
}
