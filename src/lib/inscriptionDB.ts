import Dexie, {type Table } from 'dexie';
import type { InscriptionFormData } from '../types/inscription.d';

export interface InscriptionDraft {
  id?: number;
  sessionId: string;
  currentStep: number;
  formData: Partial<InscriptionFormData>;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  title?: string;
}

export class InscriptionDatabase extends Dexie {
  inscriptionDrafts!: Table<InscriptionDraft>;

  constructor() {
    super('InscriptionDatabase');
    this.version(1).stores({
      inscriptionDrafts: '++id, sessionId, currentStep, createdAt, updatedAt, isCompleted'
    });
  }
}

export const inscriptionDB = new InscriptionDatabase();

// Helper functions
export const saveInscriptionDraft = async (
  sessionId: string,
  currentStep: number,
  formData: Partial<InscriptionFormData>,
  title?: string
) => {
  const now = new Date();
  const existing = await inscriptionDB.inscriptionDrafts
    .where('sessionId')
    .equals(sessionId)
    .first();

  if (existing) {
    await inscriptionDB.inscriptionDrafts.update(existing.id!, {
      currentStep,
      formData,
      updatedAt: now,
      title: title || existing.title
    });
  } else {
    await inscriptionDB.inscriptionDrafts.add({
      sessionId,
      currentStep,
      formData,
      createdAt: now,
      updatedAt: now,
      isCompleted: false,
      title: title || `Inscription ${new Date().toLocaleDateString()}`
    });
  }
};

export const getInscriptionDraft = async (sessionId: string): Promise<InscriptionDraft | undefined> => {
  return await inscriptionDB.inscriptionDrafts
    .where('sessionId')
    .equals(sessionId)
    .first();
};

export const getAllIncompleteDrafts = async (): Promise<InscriptionDraft[]> => {
  const drafts = await inscriptionDB.inscriptionDrafts
    .toArray();

  // filter incomplete drafts and tri descendant
  return drafts
    .filter(draft => draft.isCompleted === false)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};


export const markDraftAsCompleted = async (sessionId: string) => {
  const draft = await getInscriptionDraft(sessionId);
  if (draft) {
    await inscriptionDB.inscriptionDrafts.update(draft.id!, {
      isCompleted: true,
      updatedAt: new Date()
    });
  }
};

export const deleteDraft = async (sessionId: string) => {
  const draft = await getInscriptionDraft(sessionId);
  if (draft) {
    await inscriptionDB.inscriptionDrafts.delete(draft.id!);
  }
};

export const generateSessionId = (): string => {
  return `inscription_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};