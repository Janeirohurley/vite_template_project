import { create } from 'zustand';
import type {
  GuestUser,
  GuestNotification,
  GuestAccountStatus,
  GuestDocument,
  GuestDashboardStats,
  DocumentRequirement,
  UserRole,
} from '../types';

interface GuestState {
  // État utilisateur
  user: GuestUser | null;
  status: GuestAccountStatus;
  isLoading: boolean;
  error: string | null;

  // Documents
  documents: GuestDocument[];
  documentRequirements: DocumentRequirement[];
  isUploadingDocument: boolean;
  uploadProgress: number;

  // Notifications
  notifications: GuestNotification[];
  unreadCount: number;

  // Statistiques
  stats: GuestDashboardStats | null;

  // Profile
  isProfileSubmitted: boolean;
  isSubmittingProfile: boolean;

  // Actions utilisateur
  setUser: (user: GuestUser) => void;
  setStatus: (status: GuestAccountStatus) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserRole: (role: UserRole) => void;
  setProfileImage: (url: string) => void;

  // Actions documents
  setDocuments: (documents: GuestDocument[]) => void;
  setDocumentRequirements: (requirements: DocumentRequirement[]) => void;
  addDocument: (document: GuestDocument) => void;
  updateDocument: (id: string, updates: Partial<GuestDocument>) => void;
  removeDocument: (id: string) => void;
  setUploadingDocument: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;

  // Actions notifications
  setNotifications: (notifications: GuestNotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: GuestNotification) => void;

  // Actions statistiques
  setStats: (stats: GuestDashboardStats) => void;

  // Actions profil
  setProfileSubmitted: (submitted: boolean) => void;
  setSubmittingProfile: (submitting: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  status: 'pending' as GuestAccountStatus,
  isLoading: false,
  error: null,
  documents: [],
  documentRequirements: [],
  isUploadingDocument: false,
  uploadProgress: 0,
  notifications: [],
  unreadCount: 0,
  stats: null,
  isProfileSubmitted: false,
  isSubmittingProfile: false,
};

export const useGuestStore = create<GuestState>((set) => ({
  ...initialState,

  // Actions utilisateur
  setUser: (user) =>
    set({
      user,
      status: user?.status || 'pending',
      documents: user?.documents || [],
      notifications: user?.notifications || [],
      unreadCount: user?.notifications?.filter((n) => !n.read).length || 0,
      isProfileSubmitted: user?.profile_submitted || false,
    }),

  setStatus: (status) => set({ status }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  updateUserRole: (role) =>
    set((state) => ({
      user: state.user ? { ...state.user, requestedRole: role } : null,
    })),

  setProfileImage: (url) =>
    set((state) => ({
      user: state.user ? { ...state.user, profileImageUrl: url } : null,
    })),

  // Actions documents
  setDocuments: (documents) => set({ documents }),

  setDocumentRequirements: (requirements) =>
    set({ documentRequirements: requirements }),

  addDocument: (document) =>
    set((state) => ({
      documents: [...state.documents, document],
    })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),

  setUploadingDocument: (isUploading) =>
    set({ isUploadingDocument: isUploading }),

  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  // Actions notifications
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    })),

  // Actions statistiques
  setStats: (stats) => set({ stats }),

  // Actions profil
  setProfileSubmitted: (submitted) => set({ isProfileSubmitted: submitted }),
  setSubmittingProfile: (submitting) => set({ isSubmittingProfile: submitting }),

  // Reset
  reset: () => set(initialState),
}));

// Sélecteurs utiles
export const selectUser = (state: GuestState) => state.user;
export const selectStatus = (state: GuestState) => state.status;
export const selectDocuments = (state: GuestState) => state.documents;
export const selectNotifications = (state: GuestState) => state.notifications;
export const selectUnreadCount = (state: GuestState) => state.unreadCount;
export const selectStats = (state: GuestState) => state.stats;
export const selectIsProfileComplete = (state: GuestState) => {
  const { user, documents, documentRequirements } = state;
  if (!user) return false;

  // Vérifier les champs obligatoires du profil
  const requiredFields = ['first_name', 'last_name', 'email', 'requested_role'];
  const profileComplete = requiredFields.every(
    (field) => user[field as keyof GuestUser]
  );

  // Vérifier les documents requis
  const requiredDocs = documentRequirements.filter((req) => req.required);
  const uploadedDocTypes = documents.map((doc) => doc.type);
  const docsComplete = requiredDocs.every((req) =>
    uploadedDocTypes.includes(req.type)
  );

  return profileComplete && docsComplete;
};
