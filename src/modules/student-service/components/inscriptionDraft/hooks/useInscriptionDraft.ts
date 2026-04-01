import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInscriptionDraftsApi,
  getInscriptionDraftByIdApi,
  createInscriptionDraftApi,
  updateInscriptionDraftApi,
  deleteInscriptionDraftApi,
} from "../api/inscriptionDraftApi";
import type { InscriptionDraft } from "@/lib/inscriptionDB";


export const useInscriptionDrafts = () => {
  return useQuery({
    queryKey: ["inscriptionDrafts"],
    queryFn: getInscriptionDraftsApi,
  });
};

export const useInscriptionDraft = (id: string) => {
  return useQuery({
    queryKey: ["inscriptionDrafts", id],
    queryFn: () => getInscriptionDraftByIdApi(id),
    enabled: !!id,
  });
};

export const useCreateInscriptionDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: Partial<InscriptionDraft>) => createInscriptionDraftApi(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscriptionDrafts"] });
    },
  });
};

export const useUpdateInscriptionDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: Partial<InscriptionDraft> }) => updateInscriptionDraftApi(id, draft),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inscriptionDrafts"] });
      queryClient.invalidateQueries({ queryKey: ["inscriptionDrafts", variables.id] });
    },
  });
};

export const useDeleteInscriptionDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInscriptionDraftApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscriptionDrafts"] });
    },
  });
};
