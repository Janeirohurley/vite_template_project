import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryParams } from '@/types/api';
import type {
  CreateJurySessionData,
  UpdateJurySessionData,
  CreateJuryDecisionData,
  UpdateGradeComplaintData,
} from '../types/juryTypes';
import {
  getJurySessionsApi,
  getJurySessionByIdApi,
  createJurySessionApi,
  updateJurySessionApi,
  deleteJurySessionApi,
  getJuryDecisionsApi,
  getJuryDecisionByIdApi,
  createJuryDecisionApi,
  getGradeComplaintsApi,
  getGradeComplaintByIdApi,
  updateGradeComplaintApi,
} from '../api/juryApi';

// Jury Sessions
export const useJurySessions = (params?: QueryParams) =>
  useQuery({
    queryKey: ['jury-sessions', params],
    queryFn: () => getJurySessionsApi(params),
  });

export const useJurySession = (id: string) =>
  useQuery({
    queryKey: ['jury-session', id],
    queryFn: () => getJurySessionByIdApi(id),
    enabled: !!id,
  });

export const useCreateJurySession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJurySessionData) => createJurySessionApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jury-sessions'] });
    },
  });
};

export const useUpdateJurySession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJurySessionData }) =>
      updateJurySessionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jury-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['jury-session'] });
    },
  });
};

export const useDeleteJurySession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJurySessionApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jury-sessions'] });
    },
  });
};

// Jury Decisions
export const useJuryDecisions = (params?: QueryParams) =>
  useQuery({
    queryKey: ['jury-decisions', params],
    queryFn: () => getJuryDecisionsApi(params),
  });

export const useJuryDecision = (id: string) =>
  useQuery({
    queryKey: ['jury-decision', id],
    queryFn: () => getJuryDecisionByIdApi(id),
    enabled: !!id,
  });

export const useCreateJuryDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJuryDecisionData) => createJuryDecisionApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jury-decisions'] });
    },
  });
};

// Grade Complaints
export const useGradeComplaints = (params?: QueryParams) =>
  useQuery({
    queryKey: ['grade-complaints', params],
    queryFn: () => getGradeComplaintsApi(params),
  });

export const useGradeComplaint = (id: string) =>
  useQuery({
    queryKey: ['grade-complaint', id],
    queryFn: () => getGradeComplaintByIdApi(id),
    enabled: !!id,
  });

export const useUpdateGradeComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGradeComplaintData }) =>
      updateGradeComplaintApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['grade-complaint'] });
    },
  });
};
