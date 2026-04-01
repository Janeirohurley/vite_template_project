// Types pour le module Guest

// Tous les rôles disponibles dans le système
export type UserRole =
  | 'guest'
  | 'student'
  | 'teacher'
  | 'supervisor'
  | 'delegate'
  | 'dean'
  | 'director_academic'
  | 'director_quality_assurance'
  | 'academic_affairs'
  | 'student_service'
  | 'finance_service'
  | 'general_service'
  | 'rector'
  | 'rector_office'
  | 'alumni'
  | 'admin'
  | 'super_admin';

// Statuts possibles du compte
export type GuestAccountStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

// Statuts des documents
export type DocumentStatus = 'pending' | 'verified' | 'rejected';

// Types de documents
export type DocumentType =
  | 'identity'           // Pièce d'identité (tous)
  | 'photo'              // Photo de profil (tous)
  | 'diploma'            // Diplôme
  | 'transcript'         // Relevé de notes
  | 'cv'                 // CV
  | 'cover_letter'       // Lettre de motivation
  | 'teaching_cert'      // Certificat d'enseignement
  | 'work_contract'      // Contrat de travail
  | 'recommendation'     // Lettre de recommandation
  | 'research_proposal'  // Projet de recherche
  | 'admin_appointment'  // Lettre de nomination
  | 'other';

// Document téléchargé par l'utilisateur
export interface GuestDocument {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  uploaded_at: Date;
  url: string;
  file_size: number;
  mime_type: string;
  rejection_reason?: string;
  verified_at?: Date;
  verified_by?: string;
}

// Exigence de document pour un rôle
export interface DocumentRequirement {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  max_size: number; // en Mo
  accepted_formats: string[];
}

// Notification avec détails de l'action
export interface GuestNotification {
  action_url: string;
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'action_required';
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  // Détails spécifiques selon le type
  details?: {
    document_id?: string;
    document_name?: string;
    rejection_reason?: string;
    approved_by?: string;
    next_steps?: string[];
  };
}


// Étape de progression
export interface ProgressStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  completed_at?: Date;
}

// Profil utilisateur guest
export interface GuestUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at?: Date;
  status: GuestAccountStatus;
  requested_role: UserRole;
  documents: GuestDocument[];
  notifications: GuestNotification[];
  progress_steps: ProgressStep[];
  profile_submitted: boolean;
  profile_submitted_at?: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
  rejection_reason?: string;
}


// Formulaire de profil
export interface GuestProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date?: string;
  address?: string;
  requested_role: UserRole | string; // Peut être un UserRole local ou un ID de rôle dynamique
}

// Statistiques du dashboard
export interface GuestDashboardStats {
  profile_completion: number;
  documents_uploaded: number;
  documents_required: number;
  documents_verified: number;
  documents_rejected: number;
  estimated_wait_days?: number;
  position_in_queue?: number;
}


// Réponse API pour le profil
export interface GuestProfileResponse {
  user: GuestUser;
  stats: GuestDashboardStats;
  document_requirements: DocumentRequirement[];
}

// Payload pour upload d'image
export interface ProfileImageUploadPayload {
  file: File;
}

// Payload pour upload de document
export interface DocumentUploadPayload {
  file: File;
  type: DocumentType;
}
