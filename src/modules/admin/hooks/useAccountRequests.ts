import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryParams } from '@/types/api';
import {
  getAccountRequestsApi,
  getAccountRequestStatsApi,
  getAccountRequestByIdApi,
  markAsUnderReviewApi,
  updateDocumentStatusApi,
  reviewAccountRequestApi,
  getRoleRequirementsApi,
} from '../api/accountRequestApi';
import type { ReviewAccountData, UpdateDocumentStatusData } from '../types/accountRequestTypes';

export const useAccountRequests = (params?: QueryParams) =>
  useQuery({
    queryKey: ['accountRequests', params],
    queryFn: () => getAccountRequestsApi(params),
  });

export const useAccountRequestStats = () =>
  useQuery({
    queryKey: ['accountRequestStats'],
    queryFn: getAccountRequestStatsApi,
  });

export const useAccountRequestById = (id: string) =>
  useQuery({
    queryKey: ['accountRequest', id],
    queryFn: () => getAccountRequestByIdApi(id),
    enabled: !!id,
  });

export const useMarkAsUnderReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => markAsUnderReviewApi(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountRequests'] });
      queryClient.invalidateQueries({ queryKey: ['accountRequestStats'] });
    },
  });
};

export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      documentId,
      data,
    }: {
      requestId: string;
      documentId: string;
      data: UpdateDocumentStatusData;
    }) => updateDocumentStatusApi(requestId, documentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accountRequest', variables.requestId] });
    },
  });
};

export const useReviewAccountRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: ReviewAccountData }) =>
      reviewAccountRequestApi(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountRequests'] });
      queryClient.invalidateQueries({ queryKey: ['accountRequest'] });
      queryClient.invalidateQueries({ queryKey: ['accountRequestStats'] });
    },
  });
};

export const useRoleRequirements = (roleId?: string) =>
  useQuery({
    queryKey: ['roleRequirements', roleId],
    queryFn: () => getRoleRequirementsApi(roleId as string),
    enabled: !!roleId,
  });
