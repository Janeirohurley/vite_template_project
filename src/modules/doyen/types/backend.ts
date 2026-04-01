/**
 * Types TypeScript alignés avec les modèles Django backend
 * Reflète exactement la structure de l'API dashboard_doyen_app
 */

import type { QueryParams } from "@/types";

// ==================== SCHEDULING MODULE ====================

export interface ScheduleSlot {
  id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  schedule_name?: string;
}

export interface CreateScheduleSlotData {
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  schedule_name?: string;
}

export interface Timetable {
  id: string;
  class_group?: string;
  class_group_name?: string;
  class_name?: string;
  class_id: string;
  attribution: string;
  course_name?: string;
  teacher_name?: string;
  room: string;
  room_name: string;
  slots: string[]; // IDs des ScheduleSlots utilisés par ce cours
  slot_details?: ScheduleSlot[]; // Tous les créneaux disponibles (coordonnées temporelles)
  start_date: string;
  end_date: string;
  status: 'Planned' | 'Completed' | 'Cancelled';
  created_by: string;
  created_by_name?: string;
  created_date: string;
  published_date?: string;
}

export interface TimetableDetail {
  id: string;
  class_group?: {
    id: string;
    group_name: string;
    class_name: string;
  };
  attribution: {
    id: string;
    course: {
      id: string;
      course_code: string;
      course_name: string;
    };
    principal_teacher: {
      id: string;
      user: {
        first_name: string;
        last_name: string;
        email: string;
      };
    };
    academic_year: string;
  };
  room: {
    id: string;
    room_name: string;
    room_code: string;
    capacity: number;
  };
  slots: ScheduleSlot[];
  start_date: string;
  end_date: string;
  status: 'Planned' | 'Completed' | 'Cancelled';
  created_by: string;
  created_date: string;
  published_date?: string;
}

export interface CreateTimetableData {
  class_group?: string;
  attribution: string;
  room: string;
  slots: string[]; // IDs des ScheduleSlots
  start_date: string;
  end_date: string;
  status?: 'Planned' | 'Completed' | 'Cancelled';
}

export interface UpdateTimetableData {
  class_group?: string;
  attribution?: string;
  room?: string;
  slots?: string[];
  start_date?: string;
  end_date?: string;
  status?: 'Planned' | 'Completed' | 'Cancelled';
}

// ==================== TIMETABLE MERGE ====================

export interface TimetableMerge {
  id: string;
  name: string;
  timetable_ids: string[];
  created_at: string;
  created_by?: string;
}

export interface CreateTimetableMergeData {
  name: string;
  timetable_ids: string[];
}



export interface UpdateTimetableMergeData {
  name?: string;
  timetable_ids?: string[];
}

export interface Attendance {
  id: string;
  timetable: string;
  student: string;
  status: 'Present' | 'Absent' | 'Excused';
  remarks?: string;
}

export interface CreateAttendanceData {
  timetable: string;
  student: string;
  status: 'Present' | 'Absent' | 'Excused';
  remarks?: string;
}

export interface BulkAttendanceData {
  timetable_id: string;
  attendances: Array<{
    student_id: string;
    status: 'Present' | 'Absent' | 'Excused';
    remarks?: string;
  }>;
}

export interface ActivityReport {
  id: string;
  timetable: string;
  planned_hours: number;
  delivered_hours: number;
  completion_rate: number;
  observations?: string;
}

export interface CreateActivityReportData {
  timetable: string;
  planned_hours: number;
  delivered_hours: number;
  observations?: string;
}

// ==================== TEACHING PROGRESS & WORKLOAD ====================

export interface TeachingProgress {
  id: string;
  attribution: string;
  faculty: string;
  progress_percentage: number;
  last_updated: string;
  submitted_by: string;
}

export interface TeachingProgressDetail {
  id: string;
  attribution: {
    id: string;
    course: {
      id: string;
      course_code: string;
      course_name: string;
    };
    principal_teacher: {
      id: string;
      user: {
        first_name: string;
        last_name: string;
        email: string;
      };
    };
    academic_year: string;
  };
  faculty: string;
  progress_percentage: number;
  last_updated: string;
  submitted_by: string;
}

export interface TeacherWorkload {
  id: string;
  faculty: string;
  teacher: string;
  academic_year: string;
  total_hours: number;
  assigned_hours: number;
  is_permanent: boolean;
}

export interface TeacherWorkloadDetail {
  id: string;
  faculty: string;
  teacher: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  academic_year: string;
  total_hours: number;
  assigned_hours: number;
  is_permanent: boolean;
}

export interface CreateTeacherWorkloadData {
  faculty: string;
  teacher: string;
  academic_year: string;
  total_hours: number;
  is_permanent?: boolean;
}

// ==================== ATTRIBUTION ====================

export interface Attribution {
  id: string;
  course: string;
  course_name: string;
  course_code: string;
  principal_teacher: string;
  principal_teacher_name: string;
  substitute_teacher?: string;
  substitute_teacher_name?: string;
  academic_year: string;
  academic_year_name: string;
  date_attribution: string;
  status_principal_teacher: 'Pending' | 'Accepted' | 'Refused';
  status_substitute_teacher?: 'Pending' | 'Accepted' | 'Refused';
  commentaire?: string;
}

export interface AttributionDetail {
  id: string;
  course: {
    id: string;
    course_code: string;
    course_name: string;
    credits: number;
  };
  principal_teacher: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  substitute_teacher?: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  academic_year: string;
  status_principal_teacher: 'Pending' | 'Accepted' | 'Refused';
  status_substitute_teacher?: 'Pending' | 'Accepted' | 'Refused';
  date_attribution: string;
}

export interface ProposeData {
  course_id: string;
  principal_teacher_id: string;
  substitute_teacher_id: string;
  academic_year_id:string;
}

// ==================== ACADEMIC STRUCTURE ====================

export interface FacultyOverview {
  faculty_id: string,
  faculty_name: string,
  abreviation: string,
  department_count: number,
  class_count: number,
  student_count: number,
  teacher_count: number,
  course_count: number
}

export interface Department {
  id: string;
  department_name: string;
  abreviation: string;
  faculty: string;
}

export interface Class {
  id: string;
  class_name: string;
  department: string;
}

export interface ClassGroup {
  id: string;
  class_fk: string;
  class_name: string;
  academic_year: string;
  academic_year_name: string;
  group_name: string;
  created_date: string;
  student_count: string;
  timetable_count: string;
}

export interface Room {
  id: string;
  building_name: string;
  room_name: string;
  capacity: number;
  room_type: 'classroom' | 'laboratory' | 'amphi' | 'office' | 'meeting';
  is_available: boolean;
}

export interface Student {
  id: string;
  matricule: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Inscription {
  id: string;
  student: string;
  academic_year: string;
  class_fk: string;
  regist_status: string;
  date_inscription: string;
}

// ==================== SECRETARY NOTES ====================

export interface SecretaryNote {
  id: string;
  faculty: string;
  subject: string;
  message: string;
  created_by: string;
  created_date: string;
  is_resolved: boolean;
}

export interface CreateSecretaryNoteData {
  faculty: string;
  subject: string;
  message: string;
}

// ==================== DASHBOARD STATS ====================

export interface DeanDashboardStats {
  total_timetables: number;
  published_timetables: number;
  pending_timetables: number;
  teaching_progress_avg: number;
  total_teachers: number;
  permanent_teachers: number;
  visiting_teachers: number;
  total_attributions: number;
  pending_attributions: number;
  accepted_attributions: number;
  total_workload_hours: number;
  assigned_workload_hours: number;
  pending_secretary_notes: number;
  total_students: number;
  active_courses: number;
}

export interface TimetableOverview {
  timetable_id: string;
  class_name: string;
  course_name: string;
  teacher_name: string;
  room_name: string;
  start_date: string;
  end_date: string;
  status: 'Planned' | 'Completed' | 'Cancelled';
  slot_count: number;
}

export interface AttributionStatistics {
  total_attributions: number;
  pending_count: number;
  accepted_count: number;
  refused_count: number;
  by_course: Array<{
    course_name: string;
    count: number;
  }>;
  by_teacher: Array<{
    teacher_name: string;
    count: number;
  }>;
}

export interface RoomUtilizationReport {
  room_name: string;
  room_code: string;
  capacity: number;
  total_sessions: number;
  utilization_rate: number;
  peak_hours: string[];
}

// ==================== EXAM MANAGEMENT ====================

export interface ExamType {
  id: string;
  exam_type_name: string;
}

export interface Exam {
  id: string;
  course: string;
  exam_type: string;
  academic_year: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_by: string;
  created_at: string;
}

export interface ExamRoom {
  id: string;
  exam: string;
  room: string;
  capacity: number;
}

export interface ExamSupervisor {
  id: string;
  exam_room: string;
  supervisor: string;
}

// ==================== RESULTS & JURY ====================

export interface Session {
  id: string;
  session_name: string;
  academic_year: string;
}

export interface Result {
  id: string;
  course: string;
  inscription: string;
  session: string;
  mark: number;
}

export interface CompiledResult {
  id: string;
  inscription: string;
  status: string;
  is_promoted: boolean;
}

export interface Supplement {
  id: string;
  inscription: string;
  course: string;
  validation: boolean;
}

export interface JurySession {
  id: string;
  session_name: string;
  session_date: string;
  status: string;
  created_by: string;
  created_at: string;
}

export interface JuryDecision {
  id: string;
  jury_session: string;
  student: string;
  decision: string;
  notes?: string;
  validated_by: string;
}

export interface GradeComplaint {
  id: string;
  student: string;
  course: string;
  status: string;
  submitted_at: string;
  resolved_at?: string;
}

export interface TeacherPaymentClaim {
  id: string;
  teacher: string;
  course: string;
  status: string;
  total_amount: number;
  submitted_at: string;
  processed_at?: string;
}

// ==================== API RESPONSES ====================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string | Record<string, string[]>;
}

// ==================== QUERY PARAMS ====================

export interface TimetableParams {
  class_group?: string;
  attribution?: string;
  room?: string;
  status?: 'Planned' | 'Completed' | 'Cancelled';
  page?: number;
  page_size?: number;
}

export interface TeachingProgressParams {
  faculty?: string;
  attribution?: string;
  submitted_by?: string;
  page?: number;
  page_size?: number;
}

export interface TeacherWorkloadParams extends QueryParams {
  faculty?: string;
  teacher?: string;
  academic_year?: string;
  is_permanent?: boolean;
  page?: number;
  page_size?: number;
}

export interface AttributionParams extends QueryParams {
  course?: string;
  principal_teacher?: string;
  academic_year?: string;
  status_principal_teacher?: 'Pending' | 'Accepted' | 'Refused';
  page?: number;
  page_size?: number;
}
