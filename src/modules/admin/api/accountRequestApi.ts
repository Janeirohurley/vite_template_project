
import type { DjangoSuccessResponse, QueryParams } from '@/types/api';
import type {
  AccountRequest,
  AccountRequestStats,
  AccountRequestListItem,
  ReviewAccountData,
  UpdateDocumentStatusData,
} from '../types/accountRequestTypes';
import type { DocumentRequirement } from '@/modules/guest/types';
import { getListApi } from '@/api/getListApi';
import guestAxions from '@/modules/guest/api/guestAxions';
export const getAccountRequestsApi = (params?: QueryParams) =>
  getListApi<AccountRequestListItem>(guestAxions, '/account-requests/', params);

export const getAccountRequestStatsApi = async (): Promise<AccountRequestStats> =>
  (await guestAxions.get<DjangoSuccessResponse<AccountRequestStats>>('/account-requests/stats/')).data.data;

export const getAccountRequestByIdApi = async (id: string): Promise<AccountRequest> =>
  (await guestAxions.get<DjangoSuccessResponse<AccountRequest>>(`/account-requests/${id}/`)).data.data;

export const markAsUnderReviewApi = async (requestId: string): Promise<void> =>
  await guestAxions.patch(`/account-requests/${requestId}/mark_under_review/`);

export const updateDocumentStatusApi = async (
  requestId: string,
  documentId: string,
  data: UpdateDocumentStatusData
): Promise<void> =>
  await guestAxions.patch(`/account-requests/${requestId}/documents/${documentId}/`, data);

export const reviewAccountRequestApi = async (
  requestId: string,
  data: ReviewAccountData
): Promise<void> =>
  await guestAxions.post(`/account-requests/${requestId}/review/`, data);

export const getRoleRequirementsApi = async (
  roleId: string
): Promise<DocumentRequirement[]> =>
  (await guestAxions.get<DjangoSuccessResponse<DocumentRequirement[]>>(`/roles/${roleId}/requirements`)).data.data;
