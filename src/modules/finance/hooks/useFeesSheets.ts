// src/modules/finance/hooks/useFeesSheets.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createFeesSheetsApi, deleteFeesSheetsApi, getFeesSheetsApi, getFeesSheetsGroupedOptionApi, getWordingApi, updatedFeesSheetsApi } from "../api";
import type { QueryParams } from "@/types";
import type { CreateFeesSheets } from "../types/finance";
export type UpdateFeesSheetsPayload = {
  id: string;
  data: Partial<CreateFeesSheets>;
  isPartial: boolean;
};




// ==================== FeesSheets ====================
export function useFeesSheets(params?: QueryParams) {
  return useQuery({
    queryKey: ['feesSheets', params],
    queryFn: () => getFeesSheetsApi(params),
  });
}
export function useFeesSheetsGroupedOptions(params?: QueryParams) {
  return useQuery({
    queryKey: ['grouped-options-fees', params],
    queryFn: () => getFeesSheetsGroupedOptionApi(params),
  });
}
export function useWordings(params?: QueryParams) {
  return useQuery({
    queryKey: ['wordings', params],
    queryFn: () => getWordingApi(params),
  });
}


export function useCreateFeesSheets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFeesSheets) => createFeesSheetsApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feesSheets',"grouped-options-fees"] });
    },
  });
}


export function useUpdateFeesSheets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, isPartial = false }: UpdateFeesSheetsPayload) =>
      updatedFeesSheetsApi(id, data, isPartial),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feesSheets','grouped-options-fees'] });
    },
  });
}


export function useDeleteFeesSheets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeesSheetsApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feesSheets','grouped-options-fees'] });
    },
  });
}
