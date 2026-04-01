/* eslint-disable @typescript-eslint/no-explicit-any */
// Types pour le processus d'inscription multi-étapes
import { Colline, Zone } from "./entities";
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  gender: string;
  birth_date: string;
  nationality: string;
  residence: string[];
  marital_status: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
  email_verified: boolean;
  profile_picture?: string;
}

export interface Colline extends Colline {
  zone: string;
}
export interface Zone {
  id: string;
  zone_name: string;
}
export interface Profession {
  id: string;
  profession_name: string;
}

export interface Parent {
  id: string;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  profession: Profession;
  profession_id?: string;
  parent_type: 'F' | 'M' | 'G';
  is_alive: boolean;
  is_contact_person: boolean;
}

export interface Highschool {
  id: string;
  hs_name: string;
  zone: Zone;
  code?: string;
}
export interface Section {
  id: string;
  section_name: string;
}
export interface Certificate {
  id: string;
  certificate_name: string;
  section: Section;
}
export interface Section {
  id: string;
  section_name: string;
}

export interface Training {
  id: string;
  domaine: string;
  certificate: string;
  training_center?: string;
}

export interface TrainingCenter {
  id: string;
  name: string;
  commune: string;
}

export interface Country {
  id: string;
  code?: string;
  country_name: string;
}

export interface University {
  id: string;
  university_name: string;
  university_abrev?: string;
  country: string;
}

export interface Faculty {
  id: string;
  faculty_name: string;
  faculty_abreviation?: string;
  types: FacultyTypes;
  university: string;
}
export interface FacultyTypes {
  code: "F" | "M" | "I";
  description: string;
  id: string;
  name: string;
}

export interface Department {
  id: string;
  department_name: string;
  abreviation: string;
  faculty: Faculty;
}

export interface UniversityDegree {
  id: string;
  degree_name: string;
  description?: string;
}

export interface AcademicYear {
  id: string;
  civil_year: number;
  is_closed: boolean;
}

export interface Class {
  id: string;
  class_name: string;
  department: Department;
}

export interface Student {
  id: string;
  user: string;
  matricule?: string;
  colline: string;
  cam?: number;
  parent: string[];
}

export interface StudentHsInfo {
  id: string;
  student: string;
  highschool: string;
  certificate: string;
  se_mark?: string;
  date_of_obtention: number;
  formation: string[];
}

export interface StudentGraduateInfo {
  id: string;
  student: string;
  department: string;
  option?: string;
  mention: string;
  degree: string;
}

export interface Inscription {
  id: string;
  student: string;
  academic_year: string;
  class_fk: {
    id: string;
    class_name: string;
    department: {
      id: string;
      department_name: string;
      abreviation: string;
      faculty: {
        id: string;
        faculty_name: string;
        faculty_abreviation: string;
        types: {
          id: string;
          name: string;
          code: string;
          description: string;
        };
        university: {
          id: string;
          university_name: string;
          university_abrev: string;
          country: string;
        };
      };
    };
  };
  payment_status: boolean;
  class_fk_id: string;
  date_inscription: string;
  regist_status: 'Active' | 'Completed' | 'Withdrawn' | 'Dropped' | 'Pending' | 'Suspended' | 'Canceled' | 'Replaced';
  withdrawal_date?: string;
  is_year_close: boolean;
  student_first_name: string;
  student_last_name: string;
  student_matricule: string;
  year: string;
}
// student services statistics
/**
 * Interface exhaustive pour les statistiques du Dashboard.
 * Correspond à la réponse JSON du backend.
 */
export interface DashboardStats {
  // Statistiques Générales
  total_students: number;
  pending_documents: number;
  pending_absences: number;
  active_scholarships: number;
  upcoming_sessions: number;
  active_activities: number;
  pending_status_changes: number;

  // Détails des Inscriptions
  inscriptions_active: number;
  inscriptions_pending: number;
  inscriptions_completed: number;
  inscriptions_withdrawn: number;
  inscriptions_dropped: number;
  inscriptions_suspended: number;
  inscriptions_canceled: number;
  inscriptions_replaced: number;
  inscriptions_complement: number;
  inscriptions_total: number;
}

// Types pour les formulaires multi-étapes
export interface InscriptionStep1Data {
  user_id: string;
  colline_id: string;
  cam?: number;
  student_id?: string;
  user_display?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_email?: string;
  country_id?: string;
  country_name?: string;
  province_id?: string;
  province_name?: string;
  commune_id?: string;
  commune_name?: string;
  zone_id?: string;
  zone_name?: string;
  colline_name?: string;
}

export interface InscriptionStep2Data {
  student_id?: string;
  parents: Array<{
    id?: string; // Si parent existant
    parent_name?: string;
    parent_phone?: string;
    parent_email?: string;
    profession_id: string;
    parent_type: 'F' | 'M' | 'G';
    is_alive: boolean;
    is_contact_person: boolean;
  }>;
}

export interface InscriptionStep3Data {
  highschool_id: string;
  certificate_id: string;
  se_mark?: string;
  date_of_obtention: number;
  formation_ids: string[];
}

export interface InscriptionStep4Data {
  country_id: string;
  university_id: string;
  faculty_id: string;
  department_id: string;
  option?: string;
  mention: string;
  degree_id: string;
  year_obtained?: number;
}

export interface InscriptionStep5Data {
  academic_year_id: string;
  class_fk_id: string;
  date_inscription: string;
  inscription_created?: boolean;
  inscription_id?: string;
}

export type StudentFileType =
  | 'birth_certificate'
  | 'highschool_diploma'
  | 'transcript'
  | 'id_copy'
  | 'medical_certificate'
  | 'photo'
  | 'parent_id_copy'
  | 'other';

export interface StudentFileUpload {
  file_type: StudentFileType;
  file_name: string;
  file: File;
  notes?: string;
}

export interface StudentFile {
  id: string;
  file_type: StudentFileType;
  file_name: string;
  file: string; // URL du fichier
  is_verified: boolean;
  verified_at?: string;
  verified_by?: string;
  notes?: string;
}

export interface InscriptionStep6Data {
  inscription_id?: string;
  payment_status?: 'non_paye' | 'en_attente' | 'paye';
  completed?: boolean;
}

export interface InscriptionFormData {
  step1: InscriptionStep1Data;
  step2: InscriptionStep2Data;
  step3: InscriptionStep3Data;
  step4?: InscriptionStep4Data; // Optionnel pour les nouveaux bacheliers
  step5: InscriptionStep5Data;
  step6?: InscriptionStep6Data; // Optionnel - Paiement des frais d'inscription
}

export interface InscriptionStepProps {
  data: Partial<InscriptionFormData>;
  onNext: (stepData: any) => void;
  onPrevious: () => void;
  onAutoSave?: (stepData: any) => void;
  isLoading?: boolean;
  sessionId?: string;
}
