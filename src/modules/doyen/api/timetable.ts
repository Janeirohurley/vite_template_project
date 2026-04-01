/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API pour la gestion des emplois du temps (Timetable)
 * Connecté au dashboard_doyen_app backend
 * Base URL: /api/dashboard/doyen/
 */
export interface Class {
  /** Identifiant unique de la classe */
  id: string;

  /** Nom de la classe (ex: BAC I, Terminale A, etc.) */
  class_name: string;

  /** ID du département auquel appartient la classe */
  department: string;

  /** Nom du département (ex: Anne Commune, Tronc Commun) */
  department_name: string;

  /** Nom de la faculté */
  faculty_name: string;

  /** Nombre de groupes dans cette classe */
  group_count: number;

  /** Nombre total d'étudiants dans la classe */
  student_count: number;
}
import axios from '@/lib/axios';
import type { DjangoSuccessResponse, ApiError, QueryParams } from '@/types';
import type {
  ScheduleSlot,
  CreateScheduleSlotData,
  Timetable,
  TimetableDetail,
  CreateTimetableData,
  UpdateTimetableData,
  TimetableMerge,
  CreateTimetableMergeData,
  UpdateTimetableMergeData,
  Attendance,
  CreateAttendanceData,
  BulkAttendanceData,
  ActivityReport,
  CreateActivityReportData,
  TeachingProgress,
  TeachingProgressDetail,
  TeachingProgressParams,
  TeacherWorkload,
  TeacherWorkloadDetail,
  CreateTeacherWorkloadData,
  TeacherWorkloadParams,
  Attribution,
  AttributionDetail,
  AttributionParams,
  ClassGroup,
  Room,
  DeanDashboardStats,
  TimetableOverview,
  AttributionStatistics,
  RoomUtilizationReport,
  ProposeData,
} from '../types/backend';
import { getListApi } from '@/api/getListApi';
import deanAxios from './deanAxios';
import academicAxios from '@/modules/admin/api/axiosAcademic';

const BASE_URL = '/dashboard/doyen';

// ==================== SCHEDULE SLOTS ====================


export const getScheduleSlotsApi = (params?: QueryParams) => getListApi<ScheduleSlot>(deanAxios, "/schedule-slots/", params);

export async function createScheduleSlotApi(data: CreateScheduleSlotData): Promise<ScheduleSlot> {
  try {
    const response = await axios.post<DjangoSuccessResponse<ScheduleSlot>>(
      `${BASE_URL}/schedule-slots/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteScheduleSlotApi(id: string): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/schedule-slots/${id}/`);
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== TIMETABLES ====================

export const getTimetablesApi = (params?: QueryParams) =>
  getListApi<Timetable>(deanAxios, "/timetables/", params);

export async function getTimetableByIdApi(id: string): Promise<TimetableDetail> {
  try {
    const response = await axios.get<DjangoSuccessResponse<TimetableDetail>>(
      `${BASE_URL}/timetables/${id}/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createTimetableApi(data: CreateTimetableData): Promise<Timetable> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Timetable>>(
      `${BASE_URL}/timetables/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateTimetableApi(id: string, data: UpdateTimetableData): Promise<Timetable> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<Timetable>>(
      `${BASE_URL}/timetables/${id}/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteTimetableApi(id: string): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/timetables/${id}/`);
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function publishTimetableApi(id: string): Promise<Timetable> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Timetable>>(
      `${BASE_URL}/timetables/${id}/publish/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getTimetablesByClassGroupApi(
  classGroupId: string,
  academicYearId?: string
): Promise<Timetable[]> {
  try {
    const params = { class_group_id: classGroupId, academic_year_id: academicYearId };
    const response = await axios.get<DjangoSuccessResponse<Timetable[]>>(
      `${BASE_URL}/timetables/by_class_group/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getTimetablesByClassApi(
  classId: string,
  academicYearId?: string
): Promise<Timetable[]> {
  try {
    const params = { class_id: classId, academic_year_id: academicYearId };
    const response = await axios.get<DjangoSuccessResponse<Timetable[]>>(
      `${BASE_URL}/timetables/by_class/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getTimetablesByDayApi(
  dayOfWeek: string,
  academicYearId?: string
): Promise<Timetable[]> {
  try {
    const params = { day_of_week: dayOfWeek, academic_year_id: academicYearId };
    const response = await axios.get<DjangoSuccessResponse<Timetable[]>>(
      `${BASE_URL}/timetables/by_day/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== ATTENDANCE ====================

export async function getAttendancesApi(timetableId?: string): Promise<Attendance[]> {
  try {
    const params = timetableId ? { timetable: timetableId } : undefined;
    const response = await axios.get<DjangoSuccessResponse<Attendance[]>>(
      `${BASE_URL}/attendances/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createAttendanceApi(data: CreateAttendanceData): Promise<Attendance> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Attendance>>(
      `${BASE_URL}/attendances/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function bulkCreateAttendanceApi(data: BulkAttendanceData): Promise<{ created_count: number }> {
  try {
    const response = await axios.post<DjangoSuccessResponse<{ created_count: number }>>(
      `${BASE_URL}/attendances/bulk_create/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== ACTIVITY REPORTS ====================

export async function getActivityReportsApi(timetableId?: string): Promise<ActivityReport[]> {
  try {
    const params = timetableId ? { timetable: timetableId } : undefined;
    const response = await axios.get<DjangoSuccessResponse<ActivityReport[]>>(
      `${BASE_URL}/activity-reports/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createActivityReportApi(data: CreateActivityReportData): Promise<ActivityReport> {
  try {
    const response = await axios.post<DjangoSuccessResponse<ActivityReport>>(
      `${BASE_URL}/activity-reports/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getActivityReportsByAttributionApi(attributionId: string): Promise<ActivityReport[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<ActivityReport[]>>(
      `${BASE_URL}/activity-reports/by_attribution/`,
      { params: { attribution_id: attributionId } }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== TEACHING PROGRESS ====================

export const getTeachingProgressApi = (params?: TeachingProgressParams) =>
  getListApi<TeachingProgress>(deanAxios, "/teaching-progress/", params);

export async function getTeachingProgressByIdApi(id: string): Promise<TeachingProgressDetail> {
  try {
    const response = await axios.get<DjangoSuccessResponse<TeachingProgressDetail>>(
      `${BASE_URL}/teaching-progress/${id}/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateTeachingProgressApi(id: string): Promise<TeachingProgressDetail> {
  try {
    const response = await axios.post<DjangoSuccessResponse<TeachingProgressDetail>>(
      `${BASE_URL}/teaching-progress/${id}/update_progress/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function bulkUpdateTeachingProgressApi(academicYearId?: string): Promise<{ updated_count: number }> {
  try {
    const response = await axios.post<DjangoSuccessResponse<{ updated_count: number }>>(
      `${BASE_URL}/teaching-progress/bulk_update/`,
      { academic_year_id: academicYearId }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== TEACHER WORKLOAD ====================

export const getTeacherWorkloadsApi = (params?: TeacherWorkloadParams) =>
  getListApi<TeacherWorkload>(deanAxios, "/teacher-workload/", params);

export async function getTeacherWorkloadByIdApi(id: string): Promise<TeacherWorkloadDetail> {
  try {
    const response = await axios.get<DjangoSuccessResponse<TeacherWorkloadDetail>>(
      `${BASE_URL}/teacher-workload/${id}/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createTeacherWorkloadApi(data: CreateTeacherWorkloadData): Promise<TeacherWorkload> {
  try {
    const response = await axios.post<DjangoSuccessResponse<TeacherWorkload>>(
      `${BASE_URL}/teacher-workload/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getTeacherWorkloadSummaryApi(academicYearId?: string): Promise<any> {
  try {
    const response = await axios.get<DjangoSuccessResponse<any>>(
      `${BASE_URL}/teacher-workload/summary/`,
      { params: { academic_year_id: academicYearId } }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== ATTRIBUTIONS ====================

export const getAttributionsApi = (params?: AttributionParams) =>
  getListApi<Attribution>(deanAxios, "/course-attributions/", params);

export async function getAttributionByIdApi(id: string): Promise<AttributionDetail> {
  try {
    const response = await axios.get<DjangoSuccessResponse<AttributionDetail>>(
      `${BASE_URL}/course-attributions/${id}/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getAttributionsByTeacherApi(
  teacherId: string,
  academicYearId?: string
): Promise<Attribution[]> {
  try {
    const params = { teacher_id: teacherId, academic_year_id: academicYearId };
    const response = await axios.get<DjangoSuccessResponse<Attribution[]>>(
      `${BASE_URL}/course-attributions/by_teacher/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getAttributionsByCourseApi(
  courseId: string,
  academicYearId?: string
): Promise<Attribution[]> {
  try {
    const params = { course_id: courseId, academic_year_id: academicYearId };
    const response = await axios.get<DjangoSuccessResponse<Attribution[]>>(
      `${BASE_URL}/course-attributions/by_course/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== DASHBOARD & STATS ====================

export async function getDashboardStatsApi(academicYearId?: string): Promise<DeanDashboardStats> {
  try {
    const response = await axios.get<DjangoSuccessResponse<DeanDashboardStats>>(
      `${BASE_URL}/stats/`,
      { params: { academic_year_id: academicYearId } }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getTimetableOverviewApi(academicYearId?: string): Promise<TimetableOverview[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<TimetableOverview[]>>(
      `${BASE_URL}/timetable/overview/`,
      { params: { academic_year_id: academicYearId } }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getAttributionStatisticsApi(academicYearId?: string): Promise<AttributionStatistics> {
  try {
    const response = await axios.get<DjangoSuccessResponse<AttributionStatistics>>(
      `${BASE_URL}/stats/attributions/`,
      { params: { academic_year_id: academicYearId } }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getRoomUtilizationReportApi(academicYearId?: string): Promise<RoomUtilizationReport[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<RoomUtilizationReport[]>>(
      `${BASE_URL}/reports/room-utilization/`,
      { params: { academic_year_id: academicYearId } }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== ROOMS ====================

export const getRoomsApi = (params?: QueryParams) =>
  getListApi<Room>(axios, "/infrastructure/rooms/", params);

// ==================== CLASS GROUPS ====================

export const getClassGroupsApi = (params?: QueryParams) =>
  getListApi<ClassGroup>(deanAxios, "/class-groups/by_class", params);

// ===================class=============================
export const getClassesApi = (params?: QueryParams) =>
  getListApi<Class>(deanAxios, '/classes/by_faculty', params);

// ==================== COURSE ATTRIBUTIONS (for dropdown) ====================

export const getCourseAttributionsApi = (params?: AttributionParams) =>
  getListApi<Attribution>(deanAxios, "/course-attributions/", params);

export const getCourseAttributionsByClassApi = (params?: AttributionParams) =>
  getListApi<Attribution>(deanAxios, "/course-attributions/by_class", params);

export async function proposerAttribution(data: ProposeData) {
  try {
    await academicAxios.post(
      '/attributions/',
      data
    )
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== TIMETABLE MERGES ====================

export const getTimetableMergesApi = (params?: QueryParams) =>
  getListApi<TimetableMerge>(deanAxios, "/timetable-merges/", params);

export async function getTimetableMergeByIdApi(id: string): Promise<TimetableMerge> {
  try {
    const response = await axios.get<DjangoSuccessResponse<TimetableMerge>>(
      `${BASE_URL}/timetable-merges/${id}/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createTimetableMergeApi(data: CreateTimetableMergeData): Promise<TimetableMerge> {
  try {
    const response = await axios.post<DjangoSuccessResponse<TimetableMerge>>(
      `${BASE_URL}/timetable-merges/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateTimetableMergeApi(id: string, data: UpdateTimetableMergeData): Promise<TimetableMerge> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<TimetableMerge>>(
      `${BASE_URL}/timetable-merges/${id}/`,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteTimetableMergeApi(id: string): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/timetable-merges/${id}/`);
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}
