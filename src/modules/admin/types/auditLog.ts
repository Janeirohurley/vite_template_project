// Types pour les Audit Logs basés sur le modèle Django AuditLog

export type SeverityLevel = 'info' | 'warning' | 'error' | 'critical';

export type ActionType =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'password_reset'
  | 'role_change'
  | 'permission_change'
  | 'config_change'
  | 'backup_initiated'
  | 'restore_initiated'
  | 'security_breach'
  | 'failed_login'
  | 'account_locked'
  | 'view'; // Ajouté pour l'exemple fourni

export interface AuditLog {
  id: string;
  user_email: string | null; // peut être null si l'utilisateur a été supprimé
  university_id?: string | null;
  action: ActionType;
  severity: SeverityLevel;
  entity_type: string | null;
  entity_id: string | null;
  description: string;
  changes: Record<string, any>; // JSON field
  ip_address: string | null;
  user_agent: string | null;
  location?: string | null;
  success: boolean;
  error_message: string | null;
  timestamp: string; // ISO date string
}

export interface AuditLogsResponse {
  results: AuditLog[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface AuditLogsParams {
  page?: number;
  page_size?: number;
  action?: ActionType;
  severity?: SeverityLevel;
  user_email?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}


export interface UniversityStatistics {
  id: string;
  university: string; // UUID
  university_name: string;

  total_students: number;
  total_teachers: number;
  total_faculties: number;
  total_departments: number;
  total_courses: number;

  active_enrollments: number;
  active_users: number;

  pending_payments: string; // "0.00" → string côté backend
  completed_exams: number;

  pending_document_requests: number;
  pending_notifications: number;

  recent_activities: number;

  calculated_at: string; // ISO date string
}
