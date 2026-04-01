import { createInscriptionDraftApi, deleteInscriptionDraftApi, updateInscriptionDraftApi } from '@/modules/student-service/components/inscriptionDraft/api/inscriptionDraftApi';
import type { InscriptionFormData } from '../types/inscription.d';
import {
  inscriptionDB,
  saveInscriptionDraft as saveLocalDraft,
  deleteDraft as deleteLocalDraft,
  getInscriptionDraft,
  markDraftAsCompleted,
  generateSessionId,
} from './inscriptionDB';
import type { InscriptionDraft } from './inscriptionDB';

export const saveInscriptionDraft = async (
  sessionId: string,
  currentStep: number,
  formData: Partial<InscriptionFormData>,
  title?: string,
  backendId?: number
): Promise<InscriptionDraft> => {
  const draft = await saveLocalDraft(sessionId, currentStep, formData, title, backendId);

  if (draft.backendId) {
    await updateInscriptionDraftApi(String(draft.backendId), draft);
    return draft;
  }

  const created = await createInscriptionDraftApi(draft);
  if (draft.id && created.backendId) {
    await inscriptionDB.inscriptionDrafts.update(draft.id, {
      backendId: created.backendId,
    });
  }
  return { ...draft, backendId: created.backendId };
};

export const deleteDraft = async (sessionId: string): Promise<void> => {
  const draft = await getInscriptionDraft(sessionId);
  if (draft?.backendId) {
    try {
      await deleteInscriptionDraftApi(String(draft.backendId));
    } catch (error: unknown) {
      const status = getErrorStatus(error);
      if (status !== 404) {
        throw error;
      }
    }
  }
  await deleteLocalDraft(sessionId);
};

export { markDraftAsCompleted, generateSessionId };

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null) return undefined;
  if (!('response' in error)) return undefined;
  const response = (error as { response?: { status?: number } }).response;
  return response?.status;
};
