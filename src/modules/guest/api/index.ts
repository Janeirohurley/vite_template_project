
import type { DjangoSuccessResponse } from '@/types';
import type {
  GuestUser,
  GuestNotification,
  GuestProfileForm,
  GuestDocument,
  GuestAccountStatus,
  GuestProfileResponse,
} from '../types';
import guestAxions from './guestAxions';


/**
 * Récupérer les informations du compte guest
 */
export async function getGuestProfile(): Promise<GuestProfileResponse> {
  const response = await guestAxions.get<DjangoSuccessResponse<GuestProfileResponse>>('/profile');
  return response.data.data;
}


/**
 * Mettre à jour le profil guest
 */
export async function updateGuestProfile(data: GuestProfileForm): Promise<GuestUser> {
  const response = await guestAxions.put<GuestUser>('/profile', data);
  
  return response.data;
}

/**
 * Récupérer le statut du compte
 */
type GuestAccountStatusResponse = {
  status: GuestAccountStatus;
};

export async function getAccountStatus(): Promise<GuestAccountStatusResponse> {
  const response =
    await guestAxions.get<DjangoSuccessResponse<GuestAccountStatusResponse>>(
      "/status"
    );

  return response.data.data;
}



/**
 * Récupérer les notifications
 */
export async function getNotifications(): Promise<GuestNotification[]> {
  const response = await guestAxions.get<DjangoSuccessResponse<GuestNotification[]>>('/notifications');
  return response.data.data;
}

/**
 * Marquer une notification comme lue
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  await guestAxions.patch(`/notifications/${id}/read`);
}

/**
 * Marquer toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await guestAxions.patch('/notifications/read-all');
}

/**
 * Télécharger un document
 */
export async function uploadDocument(
  file: File,
  type: GuestDocument['type']
): Promise<GuestDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await guestAxions.post<GuestDocument>('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Supprimer un document
 */
export async function deleteDocument(id: string): Promise<void> {
  await guestAxions.delete(`/documents/${id}`);
}

/**
 * Récupérer les documents
 */
export async function getDocuments(): Promise<GuestDocument[]> {
  const response = await guestAxions.get<DjangoSuccessResponse<GuestDocument[]>>('/documents');
  return response.data.data;
}

/**
 * Contacter le support
 */
export async function contactSupport(message: string): Promise<void> {
  await guestAxions.post('/support', { message });
}

export const guestApi = {
  getGuestProfile,
  updateGuestProfile,
  getAccountStatus,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  uploadDocument,
  deleteDocument,
  getDocuments,
  contactSupport,
};
