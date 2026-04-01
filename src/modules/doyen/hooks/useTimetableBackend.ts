import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTimetablesApi,
  getTimetableStatsApi,
  validateMergeApi,
  createMergeApi,
  getMergePreviewApi,
  addToMergeApi,
  removeFromMergeApi,
  shareTimetableApi,
  unshareTimetableApi,
} from '../api/timetableBackendApi';
import type { CreateMergeRequest, AddToMergeRequest } from '../types/timetableBackend';
import type { QueryParams } from '@/types';

export const useTimetablesWithStats = (params: QueryParams) => {
  return useQuery({
    queryKey: ['timetables-with-stats', params],
    queryFn: () => getTimetablesApi(params),
  });
};

export const useTimetableStats = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['timetable-stats', params],
    queryFn: () => getTimetableStatsApi(params),
  });
};

export const useValidateMerge = () => {
  return useMutation({
    mutationFn: (timetableIds: string[]) => validateMergeApi(timetableIds),
  });
};

export const useCreateMergeBackend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreateMergeRequest) => createMergeApi(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-merges'] });
    },
  });
};

export const useMergePreview = (mergeId: string | null | undefined) => {
  return useQuery({
    queryKey: ['merge-preview', mergeId],
    queryFn: () => getMergePreviewApi(mergeId!),
    enabled: !!mergeId,
  });
};

export const useAddToMergeBackend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ mergeId, request }: { mergeId: string; request: AddToMergeRequest }) =>
      addToMergeApi(mergeId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-merges'] });
    },
  });
};

export const useRemoveFromMergeBackend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ mergeId, timetableId }: { mergeId: string; timetableId: string }) =>
      removeFromMergeApi(mergeId, timetableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-merges'] });
    },
  });
};

export const useShareTimetable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ timetableId, groupIds }: { timetableId: string; groupIds: string[] }) =>
      shareTimetableApi(timetableId, groupIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });
    },
  });
};

export const useUnshareTimetable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ timetableId, groupId }: { timetableId: string; groupId: string }) =>
      unshareTimetableApi(timetableId, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['timetable-stats'] });
    },
  });
};
