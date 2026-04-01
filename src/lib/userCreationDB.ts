import Dexie, { type Table } from 'dexie';

export interface UserCreationDraft {
  id?: number;
  sessionId: string;
  currentStep: number;
  userData: Partial<{
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    gender?: string;
    date_of_birth?: string;
    place_of_birth?: string;
    nationality?: string;
    marital_status?: string;
    address?: string;
  }>;
  profileData: {
    position?: string;
    start_date?: string;
    end_date?: string;
    faculty?: string;
    room?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  title?: string;
}

export class UserCreationDatabase extends Dexie {
  userDrafts!: Table<UserCreationDraft>;

  constructor() {
    super('UserCreationDatabase');
    this.version(1).stores({
      userDrafts: '++id, sessionId, currentStep, createdAt, updatedAt, isCompleted'
    });
  }
}

export const userCreationDB = new UserCreationDatabase();

export const saveUserDraft = async (
  sessionId: string,
  currentStep: number,
  userData: UserCreationDraft['userData'],
  profileData: UserCreationDraft['profileData'],
  title?: string
) => {
  const now = new Date();
  const existing = await userCreationDB.userDrafts
    .where('sessionId')
    .equals(sessionId)
    .first();

  if (existing) {
    await userCreationDB.userDrafts.update(existing.id!, {
      currentStep,
      userData,
      profileData,
      updatedAt: now,
      title: title || existing.title
    });
  } else {
    await userCreationDB.userDrafts.add({
      sessionId,
      currentStep,
      userData,
      profileData,
      createdAt: now,
      updatedAt: now,
      isCompleted: false,
      title: title || `Utilisateur ${new Date().toLocaleDateString()}`
    });
  }
};

export const getUserDraft = async (sessionId: string): Promise<UserCreationDraft | undefined> => {
  return await userCreationDB.userDrafts
    .where('sessionId')
    .equals(sessionId)
    .first();
};

export const getAllIncompleteUserDrafts = async (): Promise<UserCreationDraft[]> => {
  const drafts = await userCreationDB.userDrafts.toArray();
  return drafts
    .filter(draft => draft.isCompleted === false)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

export const markUserDraftComplete = async (sessionId: string) => {
  const draft = await getUserDraft(sessionId);
  if (draft) {
    await userCreationDB.userDrafts.update(draft.id!, {
      isCompleted: true,
      updatedAt: new Date()
    });
  }
};

export const deleteUserDraft = async (sessionId: string) => {
  const draft = await getUserDraft(sessionId);
  if (draft) {
    await userCreationDB.userDrafts.delete(draft.id!);
  }
};

export const generateUserSessionId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
