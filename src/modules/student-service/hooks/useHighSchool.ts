import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/highschool';
import type { QueryParams } from '@/types';
import type {
  CreateHighSchoolData,
  UpdateHighSchoolData,
  CreateSectionData,
  UpdateSectionData,
  CreateCertificateData,
  UpdateCertificateData,
  CreateOptionData,
  UpdateOptionData,
  CreateTrainingCenterData,
  UpdateTrainingCenterData,
} from '../types';

export function useHighSchools(params: QueryParams = {}) {
  return useQuery({
    queryKey: ['highschools', params],
    queryFn: () => api.fetchHighSchools(params),
  });
}

export function useCreateHighSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHighSchoolData) => api.createHighSchool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highschools'] });
    },
  });
}

export function useUpdateHighSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHighSchoolData }) =>
      api.updateHighSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highschools'] });
    },
  });
}

export function useDeleteHighSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteHighSchool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highschools'] });
    },
  });
}

export function useSections(params: QueryParams = {}) {
  return useQuery({
    queryKey: ['sections', params],
    queryFn: () => api.fetchSections(params),
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSectionData) => api.createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSectionData }) =>
      api.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useCertificates(params: QueryParams = {}) {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: () => api.fetchCertificates(params),
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCertificateData) => api.createCertificate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCertificateData }) =>
      api.updateCertificate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useOptions(params: QueryParams = {}) {
  return useQuery({
    queryKey: ['options', params],
    queryFn: () => api.fetchOptions(params),
  });
}

export function useCreateOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOptionData) => api.createOption(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
}

export function useUpdateOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOptionData }) =>
      api.updateOption(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
}

export function useDeleteOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteOption(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
}

export function useTrainingCenters(params: QueryParams = {}) {
  return useQuery({
    queryKey: ['training-centers', params],
    queryFn: () => api.fetchTrainingCenters(params),
  });
}

export function useCreateTrainingCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTrainingCenterData) => api.createTrainingCenter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-centers'] });
    },
  });
}

export function useUpdateTrainingCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrainingCenterData }) =>
      api.updateTrainingCenter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-centers'] });
    },
  });
}

export function useDeleteTrainingCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteTrainingCenter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-centers'] });
    },
  });
}
