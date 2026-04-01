/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * React Query hooks pour la gestion des emplois du temps
 * Utilise l'API dashboard_doyen_app
 */

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  UpdateTimetableData,
  TeachingProgressParams,
  TeacherWorkloadParams,
  AttributionParams,

  UpdateTimetableMergeData,
  ClassGroup,
} from '../types/backend';
import {
  getScheduleSlotsApi,
  createScheduleSlotApi,
  deleteScheduleSlotApi,
  getTimetablesApi,
  getTimetableByIdApi,
  createTimetableApi,
  updateTimetableApi,
  deleteTimetableApi,
  publishTimetableApi,
  getTimetablesByClassGroupApi,
  getTimetablesByClassApi,
  getTimetablesByDayApi,
  getAttendancesApi,
  createAttendanceApi,
  bulkCreateAttendanceApi,
  getActivityReportsApi,
  createActivityReportApi,
  getActivityReportsByAttributionApi,
  getTeachingProgressApi,
  getTeachingProgressByIdApi,
  updateTeachingProgressApi,
  bulkUpdateTeachingProgressApi,
  getTeacherWorkloadsApi,
  getTeacherWorkloadByIdApi,
  createTeacherWorkloadApi,
  getTeacherWorkloadSummaryApi,
  getAttributionsApi,
  getAttributionByIdApi,
  getAttributionsByTeacherApi,
  getAttributionsByCourseApi,
  getDashboardStatsApi,
  getTimetableOverviewApi,
  getAttributionStatisticsApi,
  getRoomUtilizationReportApi,
  getRoomsApi,
  getClassGroupsApi,
  getCourseAttributionsApi,
  getClassesApi,
  getTimetableMergesApi,
  getTimetableMergeByIdApi,
  createTimetableMergeApi,
  updateTimetableMergeApi,
  deleteTimetableMergeApi,
  getCourseAttributionsByClassApi,
  proposerAttribution,
} from '../api/timetable';
import type { PaginatedResponse, QueryParams } from '@/types';
import { notify } from '@/lib';

// ==================== SCHEDULE SLOTS ====================

export function useScheduleSlots(params?: QueryParams) {
  return useQuery({
    queryKey: ['schedule-slots', params],
    queryFn: () => getScheduleSlotsApi(params),
  });
}

export function useCreateScheduleSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createScheduleSlotApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] });
      toast.success('Créneau horaire créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création du créneau');
    },
  });
}

export function useDeleteScheduleSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteScheduleSlotApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] });
      toast.success('Créneau horaire supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression du créneau');
    },
  });
}

// ==================== TIMETABLES ====================

export function useTimetables(params?: QueryParams) {
  return useQuery({
    queryKey: ['timetables', params],
    queryFn: () => getTimetablesApi(params),
  });
}

export function useTimetable(id: string | undefined) {
  return useQuery({
    queryKey: ['timetables', id],
    queryFn: () => getTimetableByIdApi(id!),
    enabled: !!id,
  });
}

export function useCreateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimetableApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timetables'],
        exact: false,
      });

      // Pages utilisant l'API "backend" (stats/merges) ont des queryKeys différents
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });

      queryClient.invalidateQueries({ queryKey: ['timetable-overview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

      toast.success('Emploi du temps créé avec succès');
    },

    onError: (error: any) => {
      toast.error(
        error.message || "Erreur lors de la création de l'emploi du temps"
      );
    },
  });
}


export function useUpdateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimetableData }) =>
      updateTimetableApi(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timetables'],
        exact: false,
      });

      // Pages utilisant l'API "backend" (stats/merges) ont des queryKeys différents
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });

      queryClient.invalidateQueries({ queryKey: ['timetable-overview'] });

      toast.success('Emploi du temps mis à jour avec succès');
    },

    onError: (error: any) => {
      toast.error(
        error.message || "Erreur lors de la mise à jour de l'emploi du temps"
      );
    },
  });
}


export function useDeleteTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimetableApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-overview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Emploi du temps supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression de l\'emploi du temps');
    },
  });
}

export function usePublishTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishTimetableApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-overview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Emploi du temps publié avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la publication de l\'emploi du temps');
    },
  });
}

export function useTimetablesByClassGroup(classGroupId?: string, academicYearId?: string) {
  return useQuery({
    queryKey: ['timetables', 'class-group', classGroupId, academicYearId],
    queryFn: () => getTimetablesByClassGroupApi(classGroupId!, academicYearId),
    enabled: !!classGroupId,
  });
}

export function useTimetablesByClass(classId?: string, academicYearId?: string) {
  return useQuery({
    queryKey: ['timetables', 'class', classId, academicYearId],
    queryFn: () => getTimetablesByClassApi(classId!, academicYearId),
    enabled: !!classId,
  });
}

export function useTimetablesByDay(dayOfWeek?: string, academicYearId?: string) {
  return useQuery({
    queryKey: ['timetables', 'day', dayOfWeek, academicYearId],
    queryFn: () => getTimetablesByDayApi(dayOfWeek!, academicYearId),
    enabled: !!dayOfWeek,
  });
}

// ==================== ATTENDANCE ====================

export function useAttendances(timetableId?: string) {
  return useQuery({
    queryKey: ['attendances', timetableId],
    queryFn: () => getAttendancesApi(timetableId),
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendanceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast.success('Présence enregistrée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'enregistrement de la présence');
    },
  });
}

export function useBulkCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkCreateAttendanceApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast.success(`${data.created_count} présences enregistrées avec succès`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'enregistrement des présences');
    },
  });
}

// ==================== ACTIVITY REPORTS ====================

export function useActivityReports(timetableId?: string) {
  return useQuery({
    queryKey: ['activity-reports', timetableId],
    queryFn: () => getActivityReportsApi(timetableId),
  });
}

export function useActivityReportsByAttribution(attributionId?: string) {
  return useQuery({
    queryKey: ['activity-reports', 'attribution', attributionId],
    queryFn: () => getActivityReportsByAttributionApi(attributionId!),
    enabled: !!attributionId,
  });
}

export function useCreateActivityReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivityReportApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-reports'] });
      queryClient.invalidateQueries({ queryKey: ['teaching-progress'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-workload'] });
      toast.success('Rapport d\'activité créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création du rapport');
    },
  });
}

// ==================== TEACHING PROGRESS ====================

export function useTeachingProgress(params?: TeachingProgressParams) {
  return useQuery({
    queryKey: ['teaching-progress', params],
    queryFn: () => getTeachingProgressApi(params),
  });
}

export function useTeachingProgressDetail(id?: string) {
  return useQuery({
    queryKey: ['teaching-progress', id],
    queryFn: () => getTeachingProgressByIdApi(id!),
    enabled: !!id,
  });
}

export function useUpdateTeachingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeachingProgressApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teaching-progress'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Progression mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la progression');
    },
  });
}

export function useBulkUpdateTeachingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateTeachingProgressApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teaching-progress'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(`${data.updated_count} progressions mises à jour avec succès`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour des progressions');
    },
  });
}

// ==================== TEACHER WORKLOAD ====================

export function useTeacherWorkloads(params?: TeacherWorkloadParams) {
  return useQuery({
    queryKey: ['teacher-workload', params],
    queryFn: () => getTeacherWorkloadsApi(params),
  });
}

export function useTeacherWorkloadDetail(id?: string) {
  return useQuery({
    queryKey: ['teacher-workload', id],
    queryFn: () => getTeacherWorkloadByIdApi(id!),
    enabled: !!id,
  });
}

export function useCreateTeacherWorkload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacherWorkloadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-workload'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Charge de travail créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création de la charge de travail');
    },
  });
}

export function useTeacherWorkloadSummary(academicYearId?: string) {
  return useQuery({
    queryKey: ['teacher-workload', 'summary', academicYearId],
    queryFn: () => getTeacherWorkloadSummaryApi(academicYearId),
  });
}

// ==================== ATTRIBUTIONS ====================

export function useAttributions(params?: AttributionParams) {
  return useQuery({
    queryKey: ['attributions', params],
    queryFn: () => getAttributionsApi(params),
  });
}

export function useAttribution(id?: string) {
  return useQuery({
    queryKey: ['attributions', id],
    queryFn: () => getAttributionByIdApi(id!),
    enabled: !!id,
  });
}

export function useAttributionsByTeacher(teacherId?: string, academicYearId?: string) {
  return useQuery({
    queryKey: ['attributions', 'teacher', teacherId, academicYearId],
    queryFn: () => getAttributionsByTeacherApi(teacherId!, academicYearId),
    enabled: !!teacherId,
  });
}

export function useAttributionsByCourse(courseId?: string, academicYearId?: string) {
  return useQuery({
    queryKey: ['attributions', 'course', courseId, academicYearId],
    queryFn: () => getAttributionsByCourseApi(courseId!, academicYearId),
    enabled: !!courseId,
  });
}

export function useProposeTeacher() {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: proposerAttribution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributions'] });
      queryClient.invalidateQueries({ queryKey: ['teacher'] });
      notify.success('Charge de travail créée avec succès ✅✅🤣🤣');
    }
    ,
    onError:()=>{
       notify.error("Quelque chose se passe mal lors de la proposition , Proposer encore une fois👌😉")
    }

  })
}

// ==================== DASHBOARD & STATS ====================

export function useDashboardStats(academicYearId?: string) {
  return useQuery({
    queryKey: ['dashboard-stats', academicYearId],
    queryFn: () => getDashboardStatsApi(academicYearId),
  });
}

export function useTimetableOverview(academicYearId?: string) {
  return useQuery({
    queryKey: ['timetable-overview', academicYearId],
    queryFn: () => getTimetableOverviewApi(academicYearId),
  });
}

export function useAttributionStatistics(academicYearId?: string) {
  return useQuery({
    queryKey: ['attribution-statistics', academicYearId],
    queryFn: () => getAttributionStatisticsApi(academicYearId),
  });
}

export function useRoomUtilizationReport(academicYearId?: string) {
  return useQuery({
    queryKey: ['room-utilization-report', academicYearId],
    queryFn: () => getRoomUtilizationReportApi(academicYearId),
  });
}

// ==================== ROOMS ====================

export function useRooms(params?: QueryParams) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => getRoomsApi(params),
  });
}

// ==================== CLASS GROUPS ====================
export function useClassGroups(
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<ClassGroup>,
      Error,
      PaginatedResponse<ClassGroup>
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['class-groups', params],
    queryFn: () => getClassGroupsApi(params),
    ...options,
  });
}


// ========================= CLASS========================
export function useClasses(params?: QueryParams) {
  return useQuery({
    queryKey: ['classes', params],
    queryFn: () => getClassesApi(params),
  });
}

// ==================== COURSE ATTRIBUTIONS ====================

export function useCourseAttributions(params?: AttributionParams) {
  return useQuery({
    queryKey: ['course-attributions', params],
    queryFn: () => getCourseAttributionsApi(params),
  });
}

export function useCourseAttributionsByClass(params?: AttributionParams) {
  return useQuery({
    queryKey: ['course-attributions-by-class', params],
    queryFn: () => getCourseAttributionsByClassApi(params),
  });
}

// ==================== TIMETABLE MERGES ====================

export function useTimetableMerges(params?: QueryParams) {
  return useQuery({
    queryKey: ['timetable-merges', params],
    queryFn: () => getTimetableMergesApi(params),
  });
}

export function useTimetableMerge(id?: string) {
  return useQuery({
    queryKey: ['timetable-merges', id],
    queryFn: () => getTimetableMergeByIdApi(id!),
    enabled: !!id,
  });
}

export function useCreateTimetableMerge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimetableMergeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable-merges'] });
      toast.success('Fusion créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création de la fusion');
    },
  });
}

export function useUpdateTimetableMerge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimetableMergeData }) =>
      updateTimetableMergeApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timetable-merges'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-merges', variables.id] });
      toast.success('Fusion mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la fusion');
    },
  });
}

export function useDeleteTimetableMerge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimetableMergeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable-merges'] });
      toast.success('Fusion supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression de la fusion');
    },
  });
}
