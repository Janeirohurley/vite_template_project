
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  getSchedulesApi,
  getScheduleByIdApi,
  createScheduleApi,
  updateScheduleApi,
  publishScheduleApi,
  deleteScheduleApi,
  getCoursesApi,
  getCourseByIdApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getTeachersApi,
  getTeacherByIdApi,
  createTeacherApi,
  updateTeacherApi,
  deleteTeacherApi,
  createTeachingAssignmentApi,
  deleteTeachingAssignmentApi,
  getAcademicResultsApi,
  createAcademicResultApi,
  updateAcademicResultApi,
  getJurySessionsApi,
  getJurySessionByIdApi,
  createJurySessionApi,
  updateJurySessionApi,
  deleteJurySessionApi,
  getJuryDecisionsApi,
  getJuryDecisionByIdApi,
  createJuryDecisionApi,
  updateJuryDecisionApi,
  deleteJuryDecisionApi,
  getGradeComplaintsApi,
  getGradeComplaintByIdApi,
  createGradeComplaintApi,
  updateGradeComplaintApi,
  deleteGradeComplaintApi,
  getDeliberationsApi,
  getDeliberationByIdApi,
  createDeliberationApi,
  addDeliberationDecisionApi,
  getCurriculumsApi,
  getCurriculumByIdApi,
  createCurriculumApi,
  updateCurriculumApi,
  createCurriculumModuleApi,
  getValidationRulesApi,
  createValidationRuleApi,
  getRoomsApi,
  createRoomApi,
  getCourseProgressApi,
  createCourseProgressApi,
  updateCourseProgressApi,
  getClassGroupsApi,
  createClassGroupApi,
  updateClassGroupApi,
  getStateDeanApi,
  getFacultiesOverViewApi,
  getDeanStudentsApi,
  getDeanStudentByIdApi,
  getStudentGroupsApi,
  getStudentGroupByIdApi,
  createStudentGroupApi,
  updateStudentGroupApi,
  deleteStudentGroupApi,
  assignStudentsToGroupApi,
  removeStudentsFromGroupApi,
  getDeanDepartmentsApi,
  getDeanClassesApi,
} from '../api';
import type {
  SchedulesParams,
  CreateScheduleData,
  UpdateScheduleData,
  CreateCourseData,
  UpdateCourseData,
  CreateTeacherData,
  UpdateTeacherData,
  CreateTeachingAssignmentData,
  AcademicResultsParams,
  CreateAcademicResultData,
  UpdateAcademicResultData,
  JurySessionsParams,
  CreateJurySessionData,
  UpdateJurySessionData,
  JuryDecisionsParams,
  CreateJuryDecisionData,
  UpdateJuryDecisionData,
  GradeComplaintsParams,
  CreateGradeComplaintData,
  UpdateGradeComplaintData,
  DeliberationsParams,
  CreateDeliberationData,
  CreateDeliberationDecisionData,
  CreateCurriculumData,
  UpdateCurriculumData,
  CreateCurriculumModuleData,
  CreateValidationRuleData,
  CreateRoomData,
  CourseProgressParams,
  CreateCourseProgressData,
  UpdateCourseProgressData,
  CreateClassGroupData,
  UpdateClassGroupData,
  Course,
  Teacher,
  DeanStudent,
  StudentGroup,
  CreateStudentGroupData,
  UpdateStudentGroupData,
  AssignStudentsToGroupData,
  RemoveStudentsFromGroupData,
  DeanDepartment,
  DeanClass,
} from '../types';
import type { PaginatedResponse, QueryParams } from '@/types';

// ==================== SCHEDULES ====================
export function useSchedules(params?: SchedulesParams) {
  return useQuery({
    queryKey: ['schedules', params],
    queryFn: () => getSchedulesApi(params),
  });
}

export function useGetStateDean(params?: { academic_year_id?: string }) {
  return useQuery({
    queryKey: ["academic_year_id", params],
    queryFn: () => getStateDeanApi(params)
  })
}

export function useSchedule(id: string) {
  return useQuery({
    queryKey: ['schedule', id],
    queryFn: () => getScheduleByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateScheduleData) => createScheduleApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleData }) =>
      updateScheduleApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

export function usePublishSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishScheduleApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteScheduleApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

// ==================== COURSES ====================
export function useCourses(
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<Course>,
      Error,
      PaginatedResponse<Course>
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => getCoursesApi(params),
    ...options, // 👈 enabled vient bien d’ici
  });
}


export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseData) => createCourseApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) =>
      updateCourseApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourseApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

// ==================== TEACHERS ====================
export function useTeachers
  (
    params?: QueryParams,
    options?: Omit<
      UseQueryOptions<
        PaginatedResponse<Teacher>,
        Error,
        PaginatedResponse<Teacher>
      >, 'queryKey' | 'queryFn'
    >) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => getTeachersApi(params),
    ...options
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => getTeacherByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeacherData) => createTeacherApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherData }) =>
      updateTeacherApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher'] });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeacherApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

// ==================== TEACHING ASSIGNMENTS ====================
export function useCreateTeachingAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeachingAssignmentData) => createTeachingAssignmentApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteTeachingAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeachingAssignmentApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

// ==================== ACADEMIC RESULTS ====================
export function useAcademicResults(params?: AcademicResultsParams) {
  return useQuery({
    queryKey: ['academicResults', params],
    queryFn: () => getAcademicResultsApi(params),
  });
}

export function useCreateAcademicResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAcademicResultData) => createAcademicResultApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicResults'] });
    },
  });
}

export function useUpdateAcademicResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcademicResultData }) =>
      updateAcademicResultApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicResults'] });
    },
  });
}

// ==================== JURY SESSIONS ====================
export function useJurySessions(params?: JurySessionsParams) {
  return useQuery({
    queryKey: ['jurySessions', params],
    queryFn: () => getJurySessionsApi(params),
  });
}

export function useJurySession(id: string) {
  return useQuery({
    queryKey: ['jurySession', id],
    queryFn: () => getJurySessionByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateJurySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJurySessionData) => createJurySessionApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jurySessions'] });
    },
  });
}

export function useUpdateJurySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJurySessionData }) =>
      updateJurySessionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jurySessions'] });
      queryClient.invalidateQueries({ queryKey: ['jurySession'] });
    },
  });
}

export function useDeleteJurySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJurySessionApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jurySessions'] });
    },
  });
}

// ==================== JURY DECISIONS ====================
export function useJuryDecisions(params?: JuryDecisionsParams) {
  return useQuery({
    queryKey: ['juryDecisions', params],
    queryFn: () => getJuryDecisionsApi(params),
  });
}

export function useJuryDecision(id: string) {
  return useQuery({
    queryKey: ['juryDecision', id],
    queryFn: () => getJuryDecisionByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateJuryDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJuryDecisionData) => createJuryDecisionApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['juryDecisions'] });
      queryClient.invalidateQueries({ queryKey: ['jurySessions'] });
      queryClient.invalidateQueries({ queryKey: ['jurySession'] });
    },
  });
}

export function useUpdateJuryDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJuryDecisionData }) =>
      updateJuryDecisionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['juryDecisions'] });
      queryClient.invalidateQueries({ queryKey: ['juryDecision'] });
      queryClient.invalidateQueries({ queryKey: ['jurySessions'] });
    },
  });
}

export function useDeleteJuryDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJuryDecisionApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['juryDecisions'] });
      queryClient.invalidateQueries({ queryKey: ['jurySessions'] });
    },
  });
}

// ==================== GRADE COMPLAINTS ====================
export function useGradeComplaints(params?: GradeComplaintsParams) {
  return useQuery({
    queryKey: ['gradeComplaints', params],
    queryFn: () => getGradeComplaintsApi(params),
  });
}

export function useGradeComplaint(id: string) {
  return useQuery({
    queryKey: ['gradeComplaint', id],
    queryFn: () => getGradeComplaintByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateGradeComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGradeComplaintData) => createGradeComplaintApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeComplaints'] });
    },
  });
}

export function useUpdateGradeComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGradeComplaintData }) =>
      updateGradeComplaintApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['gradeComplaint'] });
    },
  });
}

export function useDeleteGradeComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGradeComplaintApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeComplaints'] });
    },
  });
}

// ==================== DELIBERATIONS (OLD - Keep for backward compatibility) ====================
export function useDeliberations(params?: DeliberationsParams) {
  return useQuery({
    queryKey: ['deliberations', params],
    queryFn: () => getDeliberationsApi(params),
  });
}

export function useDeliberation(id: string) {
  return useQuery({
    queryKey: ['deliberation', id],
    queryFn: () => getDeliberationByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateDeliberation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeliberationData) => createDeliberationApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliberations'] });
    },
  });
}

export function useAddDeliberationDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeliberationDecisionData) => addDeliberationDecisionApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliberations'] });
      queryClient.invalidateQueries({ queryKey: ['deliberation'] });
    },
  });
}

// ==================== CURRICULUM ====================
export function useCurriculums() {
  return useQuery({
    queryKey: ['curriculums'],
    queryFn: () => getCurriculumsApi(),
  });
}

export function useCurriculum(id: string) {
  return useQuery({
    queryKey: ['curriculum', id],
    queryFn: () => getCurriculumByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCurriculumData) => createCurriculumApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
    },
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCurriculumData }) =>
      updateCurriculumApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
    },
  });
}

export function useCreateCurriculumModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCurriculumModuleData) => createCurriculumModuleApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
    },
  });
}

// ==================== VALIDATION RULES ====================
export function useValidationRules(curriculumId?: string) {
  return useQuery({
    queryKey: ['validationRules', curriculumId],
    queryFn: () => getValidationRulesApi(curriculumId),
  });
}

export function useCreateValidationRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateValidationRuleData) => createValidationRuleApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validationRules'] });
    },
  });
}

// ==================== ROOMS ====================
export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRoomsApi(),
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoomData) => createRoomApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

// ==================== COURSE PROGRESS ====================
export function useCourseProgress(params?: CourseProgressParams) {
  return useQuery({
    queryKey: ['courseProgress', params],
    queryFn: () => getCourseProgressApi(params),
  });
}

export function useCreateCourseProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseProgressData) => createCourseProgressApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] });
    },
  });
}

export function useUpdateCourseProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseProgressData }) =>
      updateCourseProgressApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] });
    },
  });
}

// ==================== CLASS GROUPS ====================
export function useClassGroups(classId?: string) {
  return useQuery({
    queryKey: ['classGroups', classId],
    queryFn: () => getClassGroupsApi(classId),
  });
}

export function useCreateClassGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClassGroupData) => createClassGroupApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classGroups'] });
    },
  });
}

export function useUpdateClassGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassGroupData }) =>
      updateClassGroupApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classGroups'] });
    },
  });
}


export function useGetFacultyOverView(params?: QueryParams) {
  return useQuery({
    queryKey: ['facultyoverview', params],
    queryFn: () => getFacultiesOverViewApi(params),
  });
}

// ==================== STUDENTS FOR DEAN ====================
export function useDeanStudents(
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<DeanStudent>,
      Error,
      PaginatedResponse<DeanStudent>
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['deanStudents', params],
    queryFn: () => getDeanStudentsApi(params),
    ...options,
  });
}

export function useDeanStudent(id: string) {
  return useQuery({
    queryKey: ['deanStudent', id],
    queryFn: () => getDeanStudentByIdApi(id),
    enabled: !!id,
  });
}

// ==================== STUDENT GROUPS ====================
export function useStudentGroups(
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<StudentGroup>,
      Error,
      PaginatedResponse<StudentGroup>
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['studentGroups', params],
    queryFn: () => getStudentGroupsApi(params),
    ...options,
  });
}



export function useStudentGroup(id: string) {
  return useQuery({
    queryKey: ['studentGroup', id],
    queryFn: () => getStudentGroupByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateStudentGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentGroupData) => createStudentGroupApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentGroups'] });
    },
  });
}

export function useUpdateStudentGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentGroupData }) =>
      updateStudentGroupApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentGroups'] });
      queryClient.invalidateQueries({ queryKey: ['studentGroup'] });
    },
  });
}

export function useDeleteStudentGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStudentGroupApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentGroups'] });
    },
  });
}

export function useAssignStudentsToGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignStudentsToGroupData) => assignStudentsToGroupApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentGroups'] });
      queryClient.invalidateQueries({ queryKey: ['studentGroup'] });
      queryClient.invalidateQueries({ queryKey: ['deanStudents'] });
    },
  });
}

export function useRemoveStudentsFromGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RemoveStudentsFromGroupData) => removeStudentsFromGroupApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentGroups'] });
      queryClient.invalidateQueries({ queryKey: ['studentGroup'] });
      queryClient.invalidateQueries({ queryKey: ['deanStudents'] });
    },
  });
}

// ==================== DEPARTMENTS & CLASSES ====================
export function useDeanDepartments(
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<DeanDepartment>,
      Error,
      PaginatedResponse<DeanDepartment>
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['deanDepartments', params],
    queryFn: () => getDeanDepartmentsApi(params),
    ...options,
  });
}

export function useDeanClasses(
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<DeanClass>,
      Error,
      PaginatedResponse<DeanClass>
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['deanClasses', params],
    queryFn: () => getDeanClassesApi(params),
    ...options,
  });
}
