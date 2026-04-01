import { useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGuestStore, selectIsProfileComplete } from '../store';
import { guestApi } from '../api';
import { getDocumentRequirementsForRole } from '../constants';
import type {
  GuestAccountStatus,
  GuestNotification,
  GuestProfileForm,
  DocumentType,
  UserRole,
} from '../types';

// Clés de cache React Query
export const guestQueryKeys = {
  profile: ['guest', 'profile'] as const,
  notifications: ['guest', 'notifications'] as const,
  documents: ['guest', 'documents'] as const,
  status: ['guest', 'status'] as const,
};

/**
 * Hook principal pour récupérer le profil guest avec React Query
 */
export function useGuestProfile() {
  const { setUser, setStats, setDocumentRequirements, setLoading, setError } =
    useGuestStore();

  const query = useQuery({
    queryKey: guestQueryKeys.profile,
    queryFn: async () => {
      const response = await guestApi.getGuestProfile();
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Synchroniser avec le store Zustand
  useEffect(() => {
    if (query.data) {
      setUser(query.data.user);
      // Mettre à jour les documents requis selon le rôle
      if (query.data.user.requested_role) {
        setStats(query.data.stats)
        setDocumentRequirements(query.data.document_requirements);
      }
    }
    setLoading(query.isLoading);
    if (query.error) {
      setError((query.error as Error).message);
    }
  }, [query.data, setStats, query.isLoading, query.error, setUser, setDocumentRequirements, setLoading, setError]);

  return {
    user: query.data?.user,
    documentRequirements: query.data?.document_requirements,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook pour mettre à jour le profil
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setSubmittingProfile, setProfileSubmitted } = useGuestStore();

  const mutation = useMutation({
    mutationFn: (data: GuestProfileForm) => guestApi.updateGuestProfile(data),
    onMutate: () => {
      setSubmittingProfile(true);
    },
    onSuccess: () => {
      // Invalider les queries pour refetch les données
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.profile });
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.documents });
      setProfileSubmitted(true);
    },
    onSettled: () => {
      setSubmittingProfile(false);
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Hook pour gérer le statut du compte guest
 */
export function useGuestStatus() {
  const { status, setStatus, isLoading, error } = useGuestStore();

  const query = useQuery({
    queryKey: guestQueryKeys.status,
    queryFn: () => guestApi.getAccountStatus(),
    refetchInterval: 1000 * 60 * 2, // Rafraîchir toutes les 2 minutes

  });
  useEffect(() => {
    if (query.data && query.data.status) {

      setStatus(query.data.status);
    }
  }, [query.data?.status, setStatus, query.data]);

  const getStatusInfo = useCallback(() => {
    const statusInfo: Record<
      GuestAccountStatus,
      { progress: number; message: string; color: string }
    > = {
      pending: {
        progress: 25,
        message: 'Votre demande est en attente de traitement.',
        color: 'amber',
      },
      under_review: {
        progress: 50,
        message: 'Un administrateur examine votre dossier.',
        color: 'blue',
      },
      approved: {
        progress: 100,
        message: 'Votre compte a été validé !',
        color: 'green',
      },
      rejected: {
        progress: 0,
        message: "Votre demande n'a pas été acceptée.",
        color: 'red',
      },
    };
    return statusInfo[status];
  }, [status]);

  return {
    status,
    isLoading: isLoading || query.isLoading,
    error,
    checkStatus: query.refetch,
    getStatusInfo,
  };
}

/**
 * Hook pour gérer les notifications guest
 */
export function useGuestNotifications() {
  const queryClient = useQueryClient();
  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
  } = useGuestStore();

  const query = useQuery({
    queryKey: guestQueryKeys.notifications,
    queryFn: () => guestApi.getNotifications(),
    staleTime: 1000 * 30, // 30 secondes
  });

  useEffect(() => {
    if (query.data && Array.isArray(query.data)) {
      setNotifications(query.data);
    }
  }, [query.data, setNotifications]);

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => guestApi.markNotificationAsRead(id),
    onMutate: (id) => {
      storeMarkAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.notifications });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => guestApi.markAllNotificationsAsRead(),
    onMutate: () => {
      storeMarkAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.notifications });
    },
  });

  const hasUnread = unreadCount > 0;

  const getNotificationsByType = useCallback(
    (type: GuestNotification['type']) => {
      return Array.isArray(notifications) ? notifications.filter((n) => n.type === type) : [];
    },
    [notifications]
  );

  const getActionRequired = useCallback(() => {
    return Array.isArray(notifications) ? notifications.filter((n) => n.type === 'action_required' && !n.read) : [];
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    hasUnread,
    isLoading: query.isLoading,
    fetchNotifications: query.refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    getNotificationsByType,
    getActionRequired,
  };
}

/**
 * Hook pour gérer les documents
 */
export function useGuestDocuments() {
  const queryClient = useQueryClient();
  const {
    documents,
    documentRequirements,
    isUploadingDocument,
    setDocuments,
    addDocument,
    removeDocument,
    setUploadingDocument,
    setUploadProgress,
  } = useGuestStore();

  const query = useQuery({
    queryKey: guestQueryKeys.documents,
    queryFn: () => guestApi.getDocuments(),
  });

  useEffect(() => {
    if (query.data && Array.isArray(query.data)) {
      setDocuments(query.data);
    }
  }, [query.data, setDocuments]);

  const uploadMutation = useMutation({
    mutationFn: ({ file, type }: { file: File; type: DocumentType }) =>
      guestApi.uploadDocument(file, type),
    onMutate: () => {
      setUploadingDocument(true);
      setUploadProgress(0);
    },
    onSuccess: (newDoc) => {
      addDocument(newDoc);
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.documents });
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.profile });
    },
    onSettled: () => {
      setUploadingDocument(false);
      setUploadProgress(100);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => guestApi.deleteDocument(id),
    onSuccess: (_, id) => {
      removeDocument(id);
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.documents });
    },
  });

  const getDocumentByType = useCallback(
    (type: DocumentType) => {
      return Array.isArray(documents) ? documents.find((doc) => doc.type === type) : undefined;
    },
    [documents]
  );

  const getMissingDocuments = useCallback(() => {
    if (!Array.isArray(documents)) return [];
    const uploadedTypes = documents.map((doc) => doc.type);

    return documentRequirements.filter(
      (req) => req.required && !uploadedTypes.includes(req.type)
    );
  }, [documents, documentRequirements]);


  const getRejectedDocuments = useCallback(() => {
    return Array.isArray(documents) ? documents.filter((doc) => doc.status === 'rejected') : [];
  }, [documents]);

  return {
    documents,
    documentRequirements,
    isUploading: isUploadingDocument || uploadMutation.isPending,
    isLoading: query.isLoading,
    uploadDocument: uploadMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    getDocumentByType,
    getMissingDocuments,
    getRejectedDocuments,
    refetch: query.refetch,
  };
}

/**
 * Hook pour upload de l'image de profil
 */
export function useProfileImage() {
  const queryClient = useQueryClient();
  const { setProfileImage } = useGuestStore();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'photo');
      const response = await guestApi.uploadDocument(file, 'photo');
      return response;
    },
    onSuccess: (doc) => {
      setProfileImage(doc.url);
      queryClient.invalidateQueries({ queryKey: guestQueryKeys.profile });
    },
  });

  return {
    uploadProfileImage: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
  };
}

/**
 * Hook pour calculer la complétion du profil
 */
export function useProfileCompletion() {
  const { user, stats, documents, documentRequirements } = useGuestStore();
  const isComplete = useGuestStore(selectIsProfileComplete);

  const getMissingFields = useCallback(() => {
    if (!user) return [];

    const missing: string[] = [];
    if (!user.first_name) missing.push('Prénom');
    if (!user.last_name) missing.push('Nom');
    if (!user.phone) missing.push('Téléphone');
    if (!user.birth_date) missing.push('Date de naissance');
    if (!user.requested_role || user.requested_role === 'guest')
      missing.push('Type de compte demandé');
    if (!user.profile_image_url) missing.push('Photo de profil');

    // Vérifier les documents manquants
    const requiredDocs = documentRequirements.filter((req) => req.required);
    const uploadedDocTypes = documents.map((doc) => doc.type);
    requiredDocs.forEach((req) => {
      if (!uploadedDocTypes.includes(req.type)) {
        missing.push(req.label);
      }
    });

    return missing;
  }, [user, documents, documentRequirements]);

  return {
    completion: stats?.profile_completion || 0,
    missingFields: getMissingFields(),
    isComplete,
  };
}

/**
 * Hook pour changer le rôle demandé et mettre à jour les documents requis
 */
export function useRoleSelection() {
  const { user, updateUserRole, setDocumentRequirements } = useGuestStore();

  const selectRole = useCallback(
    (role: UserRole) => {
      updateUserRole(role);
      const requirements = getDocumentRequirementsForRole(role);
      setDocumentRequirements(requirements);
    },
    [updateUserRole, setDocumentRequirements]
  );

  return {
    currentRole: user?.requested_role || 'guest',
    selectRole,
  };
}
