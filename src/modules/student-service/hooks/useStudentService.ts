import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInscriptionsApi,
  createInscriptionApi,
  updateInscriptionApi,
  getStudentsApi,
  getStudentByIdApi,
  createStudentApi,
  getParentsApi,
  createParentApi,
  getProfessionsApi,
  getTrainingsApi,
  getStudentHsInfoApi,
  createStudentHsInfoApi,
  getStudentGraduateInfoApi,
  createStudentGraduateInfoApi,
  deleteInscriptionApi,
  getPopulationsApi,
  exportPopulationsApi,
  activateInscriptionApi,
  getParentsListApi,
  repleceInscriptionApi,
  getStudentServiceStatsApi,
  deleteStudentApi,
  getHighSchoolsApi,
  createHighSchoolApi,
  updateHighSchoolApi,
  deleteHighSchoolApi,
} from '../api/studentServiceApi';
import type {
  InscriptionsParams,
  CreateInscriptionData,
  UpdateInscriptionData,
  StudentsParams,
  CreateStudentData,
  CreateParentData,
  CreateStudentHsInfoData,
  CreateStudentGraduateInfoData,
  PopulationParams,
  CreateHighSchoolData,
  UpdateHighSchoolData,
} from '../types';
import type { QueryParams } from '@/types';

// ==================== INSCRIPTIONS ====================
export function useInscriptions(params?: InscriptionsParams) {
  return useQuery({
    queryKey: ['inscriptions', params],
    queryFn: () => getInscriptionsApi(params),
  });
}

export function useCreateInscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInscriptionData) => createInscriptionApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    },
  });
}

export function useUpdateInscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInscriptionData }) =>
      updateInscriptionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    },
  });
}

export function useDeleteInscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return deleteInscriptionApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    },
  });
}
export function
  useActivateInscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return activateInscriptionApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    },
  });
}

export function useReplaceInscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, class_fk_id }: { id: string; class_fk_id: string }) => {
      return repleceInscriptionApi(id, class_fk_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    },
  });
}

// ==================== STUDENTS ====================
export function useStudents(params?: StudentsParams) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => getStudentsApi(params),
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return deleteStudentApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Students'] });
    },
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudentByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentData) => createStudentApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// ==================== PARENTS ====================
export function useParents() {
  return useQuery({
    queryKey: ['parents'],
    queryFn: () => getParentsApi(),
  });
}

export function useParentsList(params?: QueryParams) {
  return useQuery({
    queryKey: ['parentsList', params],
    queryFn: () => getParentsListApi(params),
  });
}

// ==================== HIGHSCHOOLS ====================
export function useHighSchools(params?: QueryParams) {
  return useQuery({
    queryKey: ['highschools', params],
    queryFn: () => getHighSchoolsApi(params),
  });
}

export function useCreateHighSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHighSchoolData) => createHighSchoolApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highschools'] });
    },
  });
}

export function useUpdateHighSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHighSchoolData }) => updateHighSchoolApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highschools'] });
    },
  });
}

export function useDeleteHighSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHighSchoolApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highschools'] });
    },
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateParentData) => createParentApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
  });
}

// student service dashboard stats
export function useStudentServiceStats(params?:QueryParams) {
  return useQuery({
    queryKey: ['student', 'stats', params],
    queryFn: () => getStudentServiceStatsApi(params),
  });
}

// ==================== PROFESSIONS ====================
export function useProfessions() {
  return useQuery({
    queryKey: ['professions'],
    queryFn: () => getProfessionsApi(),
  });
}

// ==================== TRAININGS ====================
export function useTrainings() {
  return useQuery({
    queryKey: ['trainings'],
    queryFn: () => getTrainingsApi(),
  });
}

// ==================== STUDENT HS INFO ====================
export function useStudentHsInfo() {
  return useQuery({
    queryKey: ['studentHsInfo'],
    queryFn: () => getStudentHsInfoApi(),
  });
}

export function useCreateStudentHsInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentHsInfoData) => createStudentHsInfoApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentHsInfo'] });
    },
  });
}

// ==================== STUDENT GRADUATE INFO ====================
export function useStudentGraduateInfo() {
  return useQuery({
    queryKey: ['studentGraduateInfo'],
    queryFn: () => getStudentGraduateInfoApi(),
  });
}

export function useCreateStudentGraduateInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentGraduateInfoData) => createStudentGraduateInfoApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentGraduateInfo'] });
    },
  });
}

// ==================== POPULATIONS ====================
/**
 * Hook pour récupérer les données de population avec filtrage et pagination côté serveur.
 * @param params - Paramètres de filtrage et pagination
 * @param enabled - Activer/désactiver la requête
 */
export function usePopulations(params?: PopulationParams, enabled = true) {
  return useQuery({
    queryKey: ['populations', params],
    queryFn: () => getPopulationsApi(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour exporter les données de population.
 * Retourne une mutation qui déclenche le téléchargement.
 */
export function useExportPopulations() {
  return useMutation({
    mutationFn: ({ params, format }: { params?: PopulationParams; format?: 'csv' | 'excel' | 'pdf' }) =>
      exportPopulationsApi(params, format),
    onSuccess: (blob, { format = 'excel' }) => {
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const extensions = { csv: 'csv', excel: 'xlsx', pdf: 'pdf' };
      link.download = `populations_export.${extensions[format]}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}
