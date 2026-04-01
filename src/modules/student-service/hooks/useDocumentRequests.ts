import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryParams } from '@/types';
import type {
  CreateDocumentRequestData,
  UpdateDocumentRequestData,
} from '../types';
import {
  getDocumentRequestsApi,
  createDocumentRequestApi,
  updateDocumentRequestApi,
  deleteDocumentRequestApi,
} from '../api/documentRequestsApi';

export function useDocumentRequests(params?: QueryParams) {
  return useQuery({
    queryKey: ['document-requests', params],
    queryFn: () => getDocumentRequestsApi(params),
  });
}

export function useCreateDocumentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocumentRequestData) => createDocumentRequestApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-requests'] });
    },
  });
}

export function useUpdateDocumentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentRequestData }) =>
      updateDocumentRequestApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-requests'] });
    },
  });
}

export function useDeleteDocumentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDocumentRequestApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-requests'] });
    },
  });
}
