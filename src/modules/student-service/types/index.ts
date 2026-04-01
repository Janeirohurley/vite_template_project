import type { Colline, QueryParams, Zone } from '@/types';
import type { Inscription } from '@/types/inscription';
import type { User } from '@/types/user';

// ==================== STUDENT ====================
export interface Student {
  id: string;
  user_obj: User;
  user:string;
  matricule: string;
  colline: Colline;
  cam: number | null;
  parent: [];
  parent_obj:Parent[],
  files: StudentFile[];
  hs_infos: StudentHsInfo[];
  graduate_infos: StudentGraduateInfo[];
}

export interface CreateStudentData {
  colline: string;
  cam?: number | null;
  parent_ids?: string[];
  new_parents?: CreateParentData[];
  file_ids?: string[];
  new_files?: CreateStudentFileData[];
  highschool_id: string;
  certificate_id: string;
  se_mark?: string;
  date_of_obtention: number;
  training_ids?: string[];
  faculty_id?: string;
  option?: string;
  mention?: string;
  degree_id?: string;
  academic_year_id: string;
  class_id?: string;
  date_inscription: string;
}

// ==================== PARENT ====================
export interface Parent {
  id: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  profession: Profession;
  parent_type: 'F' | 'M' | 'T';
  is_alive: boolean;
  is_contact_person: boolean;
}

export interface CreateParentData {
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  profession_id: string;
  parent_type: 'F' | 'M' | 'T';
  is_alive?: boolean;
  is_contact_person?: boolean;
}

// ==================== PROFESSION ====================
export interface Profession {
  id: string;
  profession_name: string;
}

// ==================== STUDENT FILE ====================
export interface StudentFile {
  id: string;
  file_type: string;
  file_name: string;
  file: string;
  is_verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  notes: string;
}

export interface CreateStudentFileData {
  file_type: string;
  file_name: string;
  file: File;
  notes?: string;
}

// ==================== INSCRIPTION ====================
// export interface Inscription {
//   id: string;
//   student: string;
//   student_name: string;
//   student_matricule: string;
//   academic_year: string;
//   class_fk: string;
//   date_inscription: string;
//   regist_status: 'Active' | 'Inactive' | 'Suspended';
//   withdrawal_date: string | null;
//   is_year_close: boolean;
// }

export interface CreateInscriptionData {
  student: string;
  academic_year: string;
  class_fk_id: string;
  date_inscription: string;
  regist_status?: 'Active' | 'Inactive' | 'Suspended';
}

export interface UpdateInscriptionData extends Partial<CreateInscriptionData> {
  withdrawal_date?: string | null;
  is_year_close?: boolean;
}

// ==================== HIGHSCHOOLS CATALOG ====================
export interface HighSchool {
  id: string;
  hs_name: string;
  zone: Zone;
  code?: string | null;
}

export interface CreateHighSchoolData {
  hs_name: string;
  zone_id: string;
  code?: string | null;
}

export interface UpdateHighSchoolData extends Partial<CreateHighSchoolData> {}

// ==================== HIGHSCHOOL INFO ====================
export interface StudentHsInfo {
  id: string;
  student: string;
  highschool: string;
  certificate: string;
  se_mark: string | null;
  date_of_obtention: number;
  formation: Training[];
}

export interface CreateStudentHsInfoData {
  student: string;
  highschool: string;
  certificate: string;
  se_mark?: string;
  date_of_obtention: number;
  formation_ids?: string[];
}

// ==================== GRADUATE INFO ====================
export interface StudentGraduateInfo {
  id: string;
  student: string;
  department: string;
  option: string | null;
  mention: string | null;
  degree: string;
}

export interface CreateStudentGraduateInfoData {
  student: string;
  department: string;
  option?: string;
  mention?: string;
  degree: string;
}

// ==================== TRAINING ====================
export interface Training {
  id: string;
  domaine: string;
  certificate: string;
  training_center: string;
}

// ==================== PARAMS ====================
export interface StudentsParams extends QueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  colline?: string;
  academic_year?: string;
}

export interface InscriptionsParams extends QueryParams {
  page?: number;
  page_size?: number;
  academic_year_id?: string;
  regist_status?: 'Active' | 'Inactive' | 'Suspended';
}

// ==================== RESPONSES ====================
export interface StudentsResponse {
  results: Student[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface InscriptionsResponse {
  results: Inscription[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ==================== POPULATION ====================
export interface PopulationData {
  id: number;
  faculty_abreviation: string;
  departement_name: string;
  class_name: string;
  sexe: 'M' | 'F'|"-";
  less_than_nineteen: number;
  nineteen: number;
  twenty: number;
  twenty_one: number;
  twenty_two: number;
  twenty_three: number;
  twenty_four: number;
  twenty_five: number;
  twenty_six: number;
  twenty_seven: number;
  twenty_eight: number;
  twenty_nine: number;
  thirty: number;
  thirty_one: number;
  greater_than_thirty_one: number;
  total_female: number;
  total_male: number;
  student_count: number;
}

export interface PopulationParams extends QueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  faculty?: string;
  department?: string;
  class_name?: string;
  sexe?: 'M' | 'F' | '';
  age_range?: 'less_than_nineteen' | 'nineteen_to_twenty_two' | 'twenty_three_to_twenty_six' | 'twenty_seven_to_thirty' | 'greater_than_thirty' | '';
  academic_year?: string;
}

