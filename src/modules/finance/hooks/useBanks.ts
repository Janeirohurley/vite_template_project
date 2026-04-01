import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBankApi,
  getBanksApi,
  updateBankApi,
  deleteBankApi,
} from "../api/banks";
import type { QueryParams } from "@/types";
import type { Banks } from "../types/banks";

// --- GET ---
export function useBanks(params?: QueryParams) {
  return useQuery({
    queryKey: ["banks", params],
    queryFn: () => getBanksApi(params),
    staleTime: 1000 * 60 * 2,
  });
}

// --- CREATE ---
export function useCreateBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Banks>) => createBankApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });
}

// --- UPDATE ---
export type UpdateBankPayload = {
  id: string;
  data: Partial<Banks>;
  isPartial?: boolean;
};

export function useUpdateBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, isPartial = false }: UpdateBankPayload) => updateBankApi(id, data, isPartial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });
}

// --- DELETE ---
export function useDeleteBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBankApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });
}