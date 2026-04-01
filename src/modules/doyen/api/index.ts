/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '@/lib/axios';
import type { DjangoSuccessResponse, ApiError, QueryParams } from '@/types';
import type {
  Schedule,
  SchedulesParams,
  SchedulesResponse,
  CreateScheduleData,
  UpdateScheduleData,
  Course,
  CreateCourseData,
  UpdateCourseData,
  Teacher,
  CreateTeacherData,
  UpdateTeacherData,
  TeachingAssignment,
  CreateTeachingAssignmentData,
  AcademicResult,
  AcademicResultsParams,
  CreateAcademicResultData,
  UpdateAcademicResultData,
  JurySession,
  JurySessionsParams,
  CreateJurySessionData,
  UpdateJurySessionData,
  JuryDecision,
  JuryDecisionsParams,
  CreateJuryDecisionData,
  UpdateJuryDecisionData,
  GradeComplaint,
  GradeComplaintsParams,
  CreateGradeComplaintData,
  UpdateGradeComplaintData,
  Deliberation,
  DeliberationsParams,
  CreateDeliberationData,
  CreateDeliberationDecisionData,
  Curriculum,
  CreateCurriculumData,
  UpdateCurriculumData,
  CreateCurriculumModuleData,
  CurriculumModule,
  ValidationRule,
  CreateValidationRuleData,
  Room,
  CreateRoomData,
  CourseProgress,
  CourseProgressParams,
  CreateCourseProgressData,
  UpdateCourseProgressData,
  ClassGroup,
  CreateClassGroupData,
  UpdateClassGroupData,
  DeanState,
  DeanStudent,
  StudentGroup,
  CreateStudentGroupData,
  UpdateStudentGroupData,
  AssignStudentsToGroupData,
  RemoveStudentsFromGroupData,
  DeanDepartment,
  DeanClass,
} from '../types';
import type { FacultyOverview } from '../types/backend';
import deanAxios from './deanAxios';
import { getListApi } from '@/api/getListApi';

// ==================== SCHEDULES / TIMETABLES ====================
export async function getSchedulesApi(params?: SchedulesParams): Promise<SchedulesResponse> {
  try {
    const response = await axios.get<DjangoSuccessResponse<SchedulesResponse | Schedule[]>>(
      '/academic/schedules/',
      { params }
    );

    const data = response.data.data as unknown as SchedulesResponse | Schedule[];

    if (Array.isArray(data)) {
      return {
        results: data,
        count: data.length,
        next: null,
        previous: null,
      };
    }

    return data;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getScheduleByIdApi(id: string): Promise<Schedule> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Schedule>>(
      `/academic/schedules/${id}/`
    );

    return response.data.data as unknown as Schedule;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createScheduleApi(data: CreateScheduleData): Promise<Schedule> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Schedule>>(
      '/academic/schedules/',
      data
    );

    return response.data.data as unknown as Schedule;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateScheduleApi(id: string, data: UpdateScheduleData): Promise<Schedule> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<Schedule>>(
      `/academic/schedules/${id}/`,
      data
    );

    return response.data.data as unknown as Schedule;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function publishScheduleApi(id: string): Promise<Schedule> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Schedule>>(
      `/academic/schedules/${id}/publish/`
    );

    return response.data.data as unknown as Schedule;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteScheduleApi(id: string): Promise<void> {
  try {
    await axios.delete(`/academic/schedules/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== COURSES ====================

export const getCoursesApi = (params?: QueryParams) =>
  getListApi<Course>(deanAxios, '/courses/by_class', params);

export async function getCourseByIdApi(id: string): Promise<Course> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Course>>(
      `/academic/courses/${id}/`
    );

    return response.data.data as unknown as Course;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createCourseApi(data: CreateCourseData): Promise<Course> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Course>>(
      '/academic/courses/',
      data
    );

    return response.data.data as unknown as Course;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateCourseApi(id: string, data: UpdateCourseData): Promise<Course> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<Course>>(
      `/academic/courses/${id}/`,
      data
    );

    return response.data.data as unknown as Course;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteCourseApi(id: string): Promise<void> {
  try {
    await axios.delete(`/academic/courses/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== TEACHERS ====================

export const getTeachersApi = (params?: QueryParams) =>
  getListApi<Teacher>(axios, '/academic/teachers/', params);



export async function getTeacherByIdApi(id: string): Promise<Teacher> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Teacher>>(
      `/academic/teachers/${id}/`
    );

    return response.data.data as unknown as Teacher;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createTeacherApi(data: CreateTeacherData): Promise<Teacher> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Teacher>>(
      '/academic/teachers/',
      data
    );

    return response.data.data as unknown as Teacher;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateTeacherApi(id: string, data: UpdateTeacherData): Promise<Teacher> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<Teacher>>(
      `/academic/teachers/${id}/`,
      data
    );

    return response.data.data as unknown as Teacher;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteTeacherApi(id: string): Promise<void> {
  try {
    await axios.delete(`/academic/teachers/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== TEACHING ASSIGNMENTS ====================
export async function createTeachingAssignmentApi(data: CreateTeachingAssignmentData): Promise<TeachingAssignment> {
  try {
    const response = await axios.post<DjangoSuccessResponse<TeachingAssignment>>(
      '/academic/teaching-assignments/',
      data
    );

    return response.data.data as unknown as TeachingAssignment;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteTeachingAssignmentApi(id: string): Promise<void> {
  try {
    await axios.delete(`/academic/teaching-assignments/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== ACADEMIC RESULTS ====================

export const getAcademicResultsApi  = (params?: AcademicResultsParams) =>
  getListApi<AcademicResult>(deanAxios, '/results/', params);

export async function createAcademicResultApi(data: CreateAcademicResultData): Promise<AcademicResult> {
  try {
    const response = await axios.post<DjangoSuccessResponse<AcademicResult>>(
      '/academic/results/',
      data
    );

    return response.data.data as unknown as AcademicResult;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateAcademicResultApi(id: string, data: UpdateAcademicResultData): Promise<AcademicResult> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<AcademicResult>>(
      `/academic/results/${id}/`,
      data
    );

    return response.data.data as unknown as AcademicResult;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== JURY SESSIONS ====================
export const getJurySessionsApi = (params?: JurySessionsParams) =>
  getListApi<JurySession>(deanAxios, '/jury-sessions/', params);

export async function getJurySessionByIdApi(id: string): Promise<JurySession> {
  try {
    const response = await deanAxios.get<DjangoSuccessResponse<JurySession>>(
      `/jury-sessions/${id}/`
    );
    return response.data.data as unknown as JurySession;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createJurySessionApi(data: CreateJurySessionData): Promise<JurySession> {
  try {
    const response = await deanAxios.post<DjangoSuccessResponse<JurySession>>(
      '/jury-sessions/',
      data
    );
    return response.data.data as unknown as JurySession;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateJurySessionApi(id: string, data: UpdateJurySessionData): Promise<JurySession> {
  try {
    const response = await deanAxios.patch<DjangoSuccessResponse<JurySession>>(
      `/jury-sessions/${id}/`,
      data
    );
    return response.data.data as unknown as JurySession;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteJurySessionApi(id: string): Promise<void> {
  try {
    await deanAxios.delete(`/jury-sessions/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== JURY DECISIONS ====================
export const getJuryDecisionsApi = (params?: JuryDecisionsParams) =>
  getListApi<JuryDecision>(deanAxios, '/jury-decisions/', params);

export async function getJuryDecisionByIdApi(id: string): Promise<JuryDecision> {
  try {
    const response = await deanAxios.get<DjangoSuccessResponse<JuryDecision>>(
      `/jury-decisions/${id}/`
    );
    return response.data.data as unknown as JuryDecision;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createJuryDecisionApi(data: CreateJuryDecisionData): Promise<JuryDecision> {
  try {
    const response = await deanAxios.post<DjangoSuccessResponse<JuryDecision>>(
      '/jury-decisions/',
      data
    );
    return response.data.data as unknown as JuryDecision;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateJuryDecisionApi(id: string, data: UpdateJuryDecisionData): Promise<JuryDecision> {
  try {
    const response = await deanAxios.patch<DjangoSuccessResponse<JuryDecision>>(
      `/jury-decisions/${id}/`,
      data
    );
    return response.data.data as unknown as JuryDecision;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteJuryDecisionApi(id: string): Promise<void> {
  try {
    await deanAxios.delete(`/jury-decisions/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== GRADE COMPLAINTS ====================
export const getGradeComplaintsApi = (params?: GradeComplaintsParams) =>
  getListApi<GradeComplaint>(deanAxios, '/grade-complaints/', params);

export async function getGradeComplaintByIdApi(id: string): Promise<GradeComplaint> {
  try {
    const response = await deanAxios.get<DjangoSuccessResponse<GradeComplaint>>(
      `/grade-complaints/${id}/`
    );
    return response.data.data as unknown as GradeComplaint;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createGradeComplaintApi(data: CreateGradeComplaintData): Promise<GradeComplaint> {
  try {
    const response = await deanAxios.post<DjangoSuccessResponse<GradeComplaint>>(
      '/grade-complaints/',
      data
    );
    return response.data.data as unknown as GradeComplaint;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateGradeComplaintApi(id: string, data: UpdateGradeComplaintData): Promise<GradeComplaint> {
  try {
    const response = await deanAxios.patch<DjangoSuccessResponse<GradeComplaint>>(
      `/grade-complaints/${id}/`,
      data
    );
    return response.data.data as unknown as GradeComplaint;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteGradeComplaintApi(id: string): Promise<void> {
  try {
    await deanAxios.delete(`/grade-complaints/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== DELIBERATIONS (OLD - Keep for backward compatibility) ====================


export const getDeliberationsApi = (params?: DeliberationsParams) =>
  getListApi<Deliberation>(deanAxios, '/deliberations/', params);

export async function getDeliberationByIdApi(id: string): Promise<Deliberation> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Deliberation>>(
      `/academic/deliberations/${id}/`
    );

    return response.data.data as unknown as Deliberation;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createDeliberationApi(data: CreateDeliberationData): Promise<Deliberation> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Deliberation>>(
      '/academic/deliberations/',
      data
    );

    return response.data.data as unknown as Deliberation;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function addDeliberationDecisionApi(data: CreateDeliberationDecisionData): Promise<any> {
  try {
    const response = await axios.post<DjangoSuccessResponse<any>>(
      '/academic/deliberation-decisions/',
      data
    );

    return response.data.data as unknown as any;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== CURRICULUM ====================
export async function getCurriculumsApi(): Promise<Curriculum[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Curriculum[]>>(
      '/academic/curriculums/'
    );

    return response.data.data as unknown as Curriculum[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getCurriculumByIdApi(id: string): Promise<Curriculum> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Curriculum>>(
      `/academic/curriculums/${id}/`
    );

    return response.data.data as unknown as Curriculum;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createCurriculumApi(data: CreateCurriculumData): Promise<Curriculum> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Curriculum>>(
      '/academic/curriculums/',
      data
    );

    return response.data.data as unknown as Curriculum;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateCurriculumApi(id: string, data: UpdateCurriculumData): Promise<Curriculum> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<Curriculum>>(
      `/academic/curriculums/${id}/`,
      data
    );

    return response.data.data as unknown as Curriculum;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createCurriculumModuleApi(data: CreateCurriculumModuleData): Promise<CurriculumModule> {
  try {
    const response = await axios.post<DjangoSuccessResponse<CurriculumModule>>(
      '/academic/curriculum-modules/',
      data
    );

    return response.data.data as unknown as CurriculumModule;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== VALIDATION RULES ====================
export async function getValidationRulesApi(curriculumId?: string): Promise<ValidationRule[]> {
  try {
    const params = curriculumId ? { curriculum: curriculumId } : undefined;
    const response = await axios.get<DjangoSuccessResponse<ValidationRule[]>>(
      '/academic/validation-rules/',
      { params }
    );

    return response.data.data as unknown as ValidationRule[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createValidationRuleApi(data: CreateValidationRuleData): Promise<ValidationRule> {
  try {
    const response = await axios.post<DjangoSuccessResponse<ValidationRule>>(
      '/academic/validation-rules/',
      data
    );

    return response.data.data as unknown as ValidationRule;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== ROOMS ====================
export async function getRoomsApi(): Promise<Room[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Room[]>>(
      '/academic/rooms/'
    );

    return response.data.data as unknown as Room[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createRoomApi(data: CreateRoomData): Promise<Room> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Room>>(
      '/academic/rooms/',
      data
    );

    return response.data.data as unknown as Room;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== COURSE PROGRESS ====================
export const getCourseProgressApi = (params?: CourseProgressParams) =>
  getListApi<CourseProgress>(deanAxios, "/teaching-progress", params)



export async function createCourseProgressApi(data: CreateCourseProgressData): Promise<CourseProgress> {
  try {
    const response = await axios.post<DjangoSuccessResponse<CourseProgress>>(
      '/academic/course-progress/',
      data
    );

    return response.data.data as unknown as CourseProgress;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateCourseProgressApi(id: string, data: UpdateCourseProgressData): Promise<CourseProgress> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<CourseProgress>>(
      `/academic/course-progress/${id}/`,
      data
    );

    return response.data.data as unknown as CourseProgress;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== CLASS GROUPS ====================
export async function getClassGroupsApi(classId?: string): Promise<ClassGroup[]> {
  try {
    const params = classId ? { class_fk: classId } : undefined;
    const response = await axios.get<DjangoSuccessResponse<ClassGroup[]>>(
      '/academic/class-groups/',
      { params }
    );

    return response.data.data as unknown as ClassGroup[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createClassGroupApi(data: CreateClassGroupData): Promise<ClassGroup> {
  try {
    const response = await axios.post<DjangoSuccessResponse<ClassGroup>>(
      '/academic/class-groups/',
      data
    );

    return response.data.data as unknown as ClassGroup;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateClassGroupApi(id: string, data: UpdateClassGroupData): Promise<ClassGroup> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<ClassGroup>>(
      `/academic/class-groups/${id}/`,
      data
    );

    return response.data.data as unknown as ClassGroup;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}


export async function getStateDeanApi(params?: { academic_year_id?: string }): Promise<DeanState> {
  try {
    const response = await deanAxios.get<DjangoSuccessResponse<DeanState>>(
      "/stats/", { params } // adapte l’URL à ton endpoint réel
    );

    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };

    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }

    throw error;
  }
}


// =======================================FACULTY OVERVIEW===================================


export const getFacultiesOverViewApi = async (params?: QueryParams) => {
  try {
    const response = await deanAxios.get<DjangoSuccessResponse<FacultyOverview>>("/faculty/overview/", { params })
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };

    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }

    throw error;
  }
}

// ==================== STUDENTS FOR DEAN ====================
export const getDeanStudentsApi = (params?: QueryParams) => {

  if (params?.class_id) {
    return getListApi<DeanStudent>(deanAxios, '/students/by_class', params);
  }
  return getListApi<DeanStudent>(deanAxios, '/students/by_faculty', params);
}


export async function getDeanStudentByIdApi(id: string): Promise<DeanStudent> {
  try {
    const response = await deanAxios.get<DjangoSuccessResponse<DeanStudent>>(
      `/students/${id}/`
    );

    return response.data.data as unknown as DeanStudent;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== STUDENT GROUPS FOR DEAN ====================
export const getStudentGroupsApi = (params?: QueryParams) =>
  getListApi<StudentGroup>(
    deanAxios,
    params?.class_id ? "/class-groups/by_class/" : "/class-groups/",
    params
  );


export async function getStudentGroupByIdApi(id: string): Promise<StudentGroup> {
  try {
    const response = await deanAxios.get<DjangoSuccessResponse<StudentGroup>>(
      `/student-groups/${id}/`
    );
    return response.data.data as unknown as StudentGroup;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createStudentGroupApi(data: CreateStudentGroupData): Promise<StudentGroup> {
  try {
    const response = await deanAxios.post<DjangoSuccessResponse<StudentGroup>>(
      '/class-groups/',
      data
    );
    return response.data.data as unknown as StudentGroup;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateStudentGroupApi(id: string, data: UpdateStudentGroupData): Promise<StudentGroup> {
  try {
    const response = await deanAxios.patch<DjangoSuccessResponse<StudentGroup>>(
      `/student-groups/${id}/`,
      data
    );
    return response.data.data as unknown as StudentGroup;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteStudentGroupApi(id: string): Promise<void> {
  try {
    await deanAxios.delete(`/class-groups/${id}/ `);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function assignStudentsToGroupApi(data: AssignStudentsToGroupData): Promise<StudentGroup> {
  try {
    const response = await deanAxios.post<DjangoSuccessResponse<StudentGroup>>(
      `/class-groups/${data.group_id}/bulk_assign_students/`,
      { student_ids: data.student_ids }
    );
    return response.data.data as unknown as StudentGroup;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function removeStudentsFromGroupApi(data: RemoveStudentsFromGroupData): Promise<StudentGroup> {
  try {
    const response = await deanAxios.post<DjangoSuccessResponse<StudentGroup>>(
      `/class-groups/${data.group_id}/remove-students/`,
      { student_ids: data.student_ids }
    );
    return response.data.data as unknown as StudentGroup;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== DEPARTMENTS & CLASSES ====================
export const getDeanDepartmentsApi = (params?: QueryParams) =>
  getListApi<DeanDepartment>(deanAxios, '/departments/by_faculty', params);

export const getDeanClassesApi = (params?: QueryParams) =>
  getListApi<DeanClass>(deanAxios, '/classes/by_faculty', params);

