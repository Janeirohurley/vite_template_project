// src/modules/finance/hooks/useWordings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWordingsApi,
  getWordingsApi,
  updateWordingsApi,
  deleteWordingsApi,
} from "../api/wordings";
import type { CreateWordingPayload, Wordings } from "../types/wordings";
import type { QueryParams } from "@/types";

// --- GET ---
export function useWordings(params?: QueryParams) {
  return useQuery({
    queryKey: ["wordings", params],
    queryFn: () => getWordingsApi(params),
    staleTime: 1000 * 60 * 2, // 2 minutes, pour éviter les reloads trop fréquents
  });
}

// --- CREATE ---
export function useCreateWordings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWordingPayload) => createWordingsApi(data),
    onSuccess: () => {
      // Invalide les queries pour rafraîchir automatiquement les listes
      queryClient.invalidateQueries({ queryKey: ["wordings"] });
    },
  });
}

// --- UPDATE ---

export type UpdateWordingsPayload = {
  id: string;
  data: Partial<Wordings>; // Utilise Partial pour autoriser des modifs d'un seul champ
};

export function useUpdateWordings() {
  const queryClient = useQueryClient();

  return useMutation({
    // On déstructure ici pour être sûr de ce qu'on passe à l'API
    mutationFn: ({ id, data }: UpdateWordingsPayload) => updateWordingsApi(id, data),
    onSuccess: () => {
      // Rafraîchit la liste des catégories
      queryClient.invalidateQueries({ queryKey: ["wordings"] });
      // CRUCIAL : Rafraîchit aussi les barèmes qui dépendent de ces catégories
      queryClient.invalidateQueries({ queryKey: ["feesSheets"] });
      queryClient.invalidateQueries({ queryKey: ["grouped-options-fees"] });
    },
  });
}

// --- DELETE ---
export function useDeleteWordings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteWordingsApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordings"] });
    },
  });
}
