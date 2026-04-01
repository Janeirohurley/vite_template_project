/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { QueryParams } from "@/types";

// ==================== SCHEDULE / TIMETABLE ====================
export interface Schedule {
  id: string;
  academic_year: string;
  class_fk: string;
  class_name: string;
  week_number: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  sessions: ScheduleSession[];
}

export interface ScheduleSession {
  id: string;
  schedule: string;
  course: string;
  course_name: string;
  teacher: string;
  teacher_name: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  start_time: string;
  end_time: string;
  room: string;
  room_name: string;
  session_type: 'Cours' | 'TD' | 'TP' | 'Examen';
}

export interface CreateScheduleData {
  academic_year: string;
  class_fk: string;
  week_number: number;
  sessions: CreateScheduleSessionData[];
}

export interface CreateScheduleSessionData {
  course: string;
  teacher: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  start_time: string;
  end_time: string;
  room: string;
  session_type: 'Cours' | 'TD' | 'TP' | 'Examen';
}

export interface UpdateScheduleData extends Partial<CreateScheduleData> {
  is_published?: boolean;
}

// ==================== COURSE ====================
export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  credits: number;
  hours_per_week: number;
  module: string;
  module_name: string;
  teacher: string | null;
  teacher_name: string | null;
  description: string;
  semester: 1 | 2;
  attribution_count:string
}

export interface CreateCourseData {
  course_code: string;
  course_name: string;
  credits: number;
  hours_per_week: number;
  module: string;
  teacher?: string | null;
  description?: string;
  semester: 1 | 2;
}

export interface UpdateCourseData extends Partial<CreateCourseData> { }

// ==================== TEACHER ====================
export interface Teacher {
  id: string;
  user: string;
  user_obj: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  teacher_type: 'Permanent' | 'Visiteur';
  speciality: string;
  hire_date: string;
  total_hours_assigned: number;
  courses: Course[];
}

export interface CreateTeacherData {
  user: string;
  teacher_type: 'Permanent' | 'Visiteur';
  speciality: string;
  hire_date: string;
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> { }

// ==================== TEACHING ASSIGNMENT ====================
export interface TeachingAssignment {
  id: string;
  teacher: string;
  teacher_name: string;
  course: string;
  course_name: string;
  academic_year: string;
  class_fk: string;
  class_name: string;
  hours_assigned: number;
  assigned_date: string;
}

export interface CreateTeachingAssignmentData {
  teacher: string;
  course: string;
  academic_year: string;
  class_fk: string;
  hours_assigned: number;
  assigned_date?: string;
}

// ==================== ACADEMIC RESULTS ====================
export interface AcademicResult {
  id: string;
  student: string;
  student_name: string;
  student_matricule: string;
  course: string;
  course_name: string;
  academic_year: string;
  semester: 1 | 2;
  midterm_score: number | null;
  final_score: number | null;
  total_score: number | null;
  grade: string | null;
  is_passed: boolean;
  remarks: string;
  session_name: string
  mark: number
}

export interface CreateAcademicResultData {
  student: string;
  course: string;
  academic_year: string;
  semester: 1 | 2;
  midterm_score?: number | null;
  final_score?: number | null;
  remarks?: string;
}

export interface UpdateAcademicResultData extends Partial<CreateAcademicResultData> {
  total_score?: number | null;
  grade?: string | null;
  is_passed?: boolean;
}

// ==================== JURY SESSION ====================
export interface JurySession {
  id: string;
  session_name: string;
  session_date: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  minutes_document: string | null;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  jury_members: JuryMember[];
  decisions: JuryDecision[];
  class_group?: string;
  class_group_name?: string;
}

export interface JuryMember {
  id: string;
  user: string;
  user_name: string;
  email?: string;
}

export interface JuryDecision {
  id: string;
  jury_session: string;
  jury_session_name?: string;
  student: string;
  student_name: string;
  student_matricule: string;
  decision: 'admitted' | 'deferred' | 'repeat' | 'excluded';
  notes: string | null;
  validated_by: string;
  validated_by_name?: string;
  validated_at: string;
}

export interface CreateJurySessionData {
  session_name: string;
  session_date: string;
  jury_member_ids: string[];
  class_group?: string;
  minutes_document?: string;
}

export interface UpdateJurySessionData extends Partial<CreateJurySessionData> {
  status?: 'scheduled' | 'in_progress' | 'completed';
}

export interface CreateJuryDecisionData {
  jury_session: string;
  student: string;
  decision: 'admitted' | 'deferred' | 'repeat' | 'excluded';
  notes?: string;
}

export interface UpdateJuryDecisionData extends Partial<CreateJuryDecisionData> {}

// ==================== GRADE COMPLAINT ====================
export interface GradeComplaint {
  id: string;
  student: string;
  student_name: string;
  student_matricule: string;
  course: string;
  course_name: string;
  original_grade: number;
  complaint_reason: string;
  status: 'submitted' | 'assigned' | 'in_review' | 'resolved' | 'rejected';
  assigned_to: string | null;
  assigned_to_name?: string | null;
  new_grade: number | null;
  resolution_notes: string | null;
  submitted_at: string;
  resolved_at: string | null;
}

export interface CreateGradeComplaintData {
  student: string;
  course: string;
  original_grade: number;
  complaint_reason: string;
}

export interface UpdateGradeComplaintData {
  status?: 'submitted' | 'assigned' | 'in_review' | 'resolved' | 'rejected';
  assigned_to?: string | null;
  new_grade?: number | null;
  resolution_notes?: string;
}

// ==================== OLD DELIBERATION (DEPRECATED - Keep for backward compatibility) ====================
export interface Deliberation {
  id: string;
  academic_year: string;
  class_fk: string;
  class_name: string;
  semester: 1 | 2;
  deliberation_date: string;
  status: 'Planifiée' | 'En cours' | 'Terminée';
  members: DeliberationMember[];
  decisions: DeliberationDecision[];
}

export interface DeliberationMember {
  id: string;
  teacher: string;
  teacher_name: string;
  role: 'Président' | 'Membre' | 'Secrétaire';
}

export interface DeliberationDecision {
  id: string;
  deliberation: string;
  student: string;
  student_name: string;
  student_matricule: string;
  decision: 'Admis' | 'Ajourné' | 'Redoublement';
  average_score: number;
  total_credits_obtained: number;
  remarks: string;
}

export interface CreateDeliberationData {
  academic_year: string;
  class_fk: string;
  semester: 1 | 2;
  deliberation_date: string;
  members: CreateDeliberationMemberData[];
}

export interface CreateDeliberationMemberData {
  teacher: string;
  role: 'Président' | 'Membre' | 'Secrétaire';
}

export interface CreateDeliberationDecisionData {
  deliberation: string;
  student: string;
  decision: 'Admis' | 'Ajourné' | 'Redoublement';
  average_score: number;
  total_credits_obtained: number;
  remarks?: string;
}

// ==================== CURRICULUM / PROGRAM ====================
export interface Curriculum {
  id: string;
  program_name: string;
  degree_level: 'Licence' | 'Master' | 'Doctorat';
  faculty: string;
  faculty_name: string;
  duration_years: number;
  total_credits_required: number;
  description: string;
  is_active: boolean;
  modules: CurriculumModule[];
}

export interface CurriculumModule {
  id: string;
  module_code: string;
  module_name: string;
  semester: 1 | 2;
  credits: number;
  is_mandatory: boolean;
  courses: Course[];
}

export interface CreateCurriculumData {
  program_name: string;
  degree_level: 'Licence' | 'Master' | 'Doctorat';
  faculty: string;
  duration_years: number;
  total_credits_required: number;
  description?: string;
  is_active?: boolean;
}

export interface CreateCurriculumModuleData {
  curriculum: string;
  module_code: string;
  module_name: string;
  semester: 1 | 2;
  credits: number;
  is_mandatory?: boolean;
}

export interface UpdateCurriculumData extends Partial<CreateCurriculumData> { }

// ==================== VALIDATION RULES ====================
export interface ValidationRule {
  id: string;
  curriculum: string;
  curriculum_name: string;
  rule_type: 'Compensation' | 'Capitalisation' | 'Passage';
  min_average_required: number;
  min_credits_required: number;
  description: string;
  is_active: boolean;
}

export interface CreateValidationRuleData {
  curriculum: string;
  rule_type: 'Compensation' | 'Capitalisation' | 'Passage';
  min_average_required: number;
  min_credits_required: number;
  description?: string;
  is_active?: boolean;
}

// ==================== ROOM ====================
export interface Room {
  id: string;
  room_name: string;
  room_code: string;
  capacity: number;
  building: string;
  floor: number;
  equipment: string[];
  is_available: boolean;
}

export interface CreateRoomData {
  room_name: string;
  room_code: string;
  capacity: number;
  building: string;
  floor: number;
  equipment?: string[];
  is_available?: boolean;
}

// ==================== COURSE PROGRESS ====================
export interface CourseProgress {
  id: string;
  course: string;
  course_name: string;
  teacher: string;
  teacher_name: string;
  academic_year: string;
  class_fk: string;
  last_updated:string;
  progress_percentage:number;
  submitted_by:string;
  class_name: string;
  total_planned_hours: number;
  hours_completed: number;
  completion_percentage: number;
  last_session_date: string | null;
  status: 'En retard' | 'Dans les délais' | 'Avance';
  remarks: string;
}

export interface CreateCourseProgressData {
  course: string;
  teacher: string;
  academic_year: string;
  class_fk: string;
  total_planned_hours: number;
  hours_completed?: number;
  remarks?: string;
}

export interface UpdateCourseProgressData extends Partial<CreateCourseProgressData> {
  last_session_date?: string | null;
}

// ==================== CLASS GROUP ====================
export interface ClassGroup {
  id: string;
  group_name: string;
  class_fk: string;
  class_name: string;
  group_type: 'TD' | 'TP' | 'Cours';
  max_capacity: number;
  current_capacity: number;
  students: string[];
}

export interface CreateClassGroupData {
  group_name: string;
  class_fk: string;
  group_type: 'TD' | 'TP' | 'Cours';
  max_capacity: number;
  student_ids?: string[];
}

export interface UpdateClassGroupData extends Partial<CreateClassGroupData> { }

// ==================== PARAMS ====================
export interface SchedulesParams {
  page?: number;
  page_size?: number;
  academic_year?: string;
  class_fk?: string;
  is_published?: boolean;
  week_number?: number;
}



export interface AcademicResultsParams extends QueryParams {
  page?: number;
  page_size?: number;
  academic_year?: string;
  student?: string;
  course?: string;
  semester?: 1 | 2;
  is_passed?: boolean;
}

export interface DeliberationsParams extends QueryParams {
  page?: number;
  page_size?: number;
  academic_year?: string;
  class_fk?: string;
  semester?: 1 | 2;
  status?: 'Planifiée' | 'En cours' | 'Terminée';
}

export interface JurySessionsParams extends QueryParams {
  page?: number;
  page_size?: number;
  status?: 'scheduled' | 'in_progress' | 'completed';
  class_group?: string;
  search?: string;
}

export interface JuryDecisionsParams extends QueryParams {
  page?: number;
  page_size?: number;
  jury_session?: string;
  student?: string;
  decision?: 'admitted' | 'deferred' | 'repeat' | 'excluded';
}

export interface GradeComplaintsParams extends QueryParams {
  page?: number;
  page_size?: number;
  status?: 'submitted' | 'assigned' | 'in_review' | 'resolved' | 'rejected';
  student?: string;
  course?: string;
  assigned_to?: string;
}

export interface CourseProgressParams extends QueryParams {
  page?: number;
  page_size?: number;
  academic_year?: string;
  class_fk?: string;
  teacher?: string;
  status?: 'En retard' | 'Dans les délais' | 'Avance';
}

// ==================== RESPONSES ====================
export interface SchedulesResponse {
  results: Schedule[];
  count: number;
  next: string | null;
  previous: string | null;
}


export interface AcademicResultsResponse {
  results: AcademicResult[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface DeliberationsResponse {
  results: Deliberation[];
  count: number;
  next: string | null;
  previous: string | null;
}


// ==================doyen state==========================


export interface DeanState {
  total_timetables: string;
  published_timetables: string;
  pending_timetables: number;
  teaching_progress_avg: string;
  total_teachers: string;
  permanent_teachers: string;
  visiting_teachers: string;
  total_attributions: string;
  pending_attributions: string;
  accepted_attributions: string;
  total_workload_hours: string;
  assigned_workload_hours: string;
  pending_secretary_notes: string;
  total_students: string;
  active_courses: string;
}

// ==================== STUDENTS FOR DEAN ====================
export interface DeanStudent {
  id: string;
  user_obj: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: string;
    profile_picture: string | null;
    marital_status: string;
  };
  matricule: string;
  colline?: [{
    id: string;
    colline_name: string;
  }];
  cam: number | null;
  current_class:{
    class_name: string,
    academic_year: string,
    date_inscription: string
  };
  inscription_status: 'Active' | 'Inactive' | 'Suspended';
  student_group?:{
    id:string;
    name: string;
  };
}


export interface DeanStudentsResponse {
  results: DeanStudent[];
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  total_pages: number;
}

// ==================== STUDENT GROUPS FOR DEAN ====================
export interface StudentGroup {
  id: string;
  group_name: string;
  class_fk: string;
  class_name: string;
  department_name:string;
  academic_year: string;
  academic_year_name: string;
  student_count: number;
  created_date: string;
  students?: string[]; // Array of student IDs
}

export interface CreateStudentGroupData {
  group_name: string;
  class_fk: string;
  academic_year: string;
  student_ids?: string[];
}

export interface UpdateStudentGroupData extends Partial<CreateStudentGroupData> {}

export interface AssignStudentsToGroupData {
  group_id: string;
  student_ids: string[];
}

export interface RemoveStudentsFromGroupData {
  group_id: string;
  student_ids: string[];
}

// ==================== DEPARTMENTS & CLASSES ====================
export interface DeanDepartment {
  id: string;
  department_name: string;
  abreviation: string;
  faculty: string;
  class_count?: number;
  student_count?: number;
}

export interface DeanClass {
  id: string;
  class_name: string;
  department: string;
  department_name: string;
  student_count?: number;
}

// Export jury types
export * from './juryTypes';
