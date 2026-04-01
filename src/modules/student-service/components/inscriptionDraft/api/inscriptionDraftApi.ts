import axios from "@/lib/axios";
import type { InscriptionDraft } from "@/lib/inscriptionDB";
import type { InscriptionFormData } from "@/types/inscription.d";
import type { PaginatedResponse, QueryParams } from "@/types";
import { getListApi } from "@/api/getListApi";

const BASE_URL = "/student/inscription-drafts/";

type BackendInscriptionDraft = {
  id: number;
  session_id: string;
  current_step: number;
  form_data: Partial<InscriptionFormData>;
  title?: string | null;
  created_at: string;
  updated_at: string;
  is_completed: boolean;
};

const fromBackendDraft = (draft: BackendInscriptionDraft): InscriptionDraft => ({
  backendId: draft.id,
  sessionId: draft.session_id,
  currentStep: draft.current_step,
  formData: draft.form_data ?? {},
  title: draft.title ?? undefined,
  createdAt: new Date(draft.created_at),
  updatedAt: new Date(draft.updated_at),
  isCompleted: draft.is_completed,
});

const toBackendDraft = (draft: Partial<InscriptionDraft>) => ({
  session_id: draft.sessionId,
  current_step: draft.currentStep,
  form_data: draft.formData,
  title: draft.title,
  is_completed: draft.isCompleted,
});

export const getInscriptionDraftsApi = async (params?: QueryParams): Promise<PaginatedResponse<InscriptionDraft>> => {
  const response = await getListApi<BackendInscriptionDraft>(axios, BASE_URL, params);
  return {
    ...response,
    results: response.results.map(fromBackendDraft),
  };
};

export const getInscriptionDraftByIdApi = async (id: string): Promise<InscriptionDraft> => {
  const response = await axios.get(`${BASE_URL}${id}/`);
  return fromBackendDraft(response.data.data);
};

export const createInscriptionDraftApi = async (draft: Partial<InscriptionDraft>): Promise<InscriptionDraft> => {
  const response = await axios.post(BASE_URL, toBackendDraft(draft));
  return fromBackendDraft(response.data.data);
};

export const updateInscriptionDraftApi = async (id: string, draft: Partial<InscriptionDraft>): Promise<InscriptionDraft> => {
  const response = await axios.put(`${BASE_URL}${id}/`, toBackendDraft(draft));
  return fromBackendDraft(response.data.data);
};

export const deleteInscriptionDraftApi = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}${id}/`);
};
