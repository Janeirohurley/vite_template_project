import axios from '@/lib/axios';
import { getListApi } from '@/api/getListApi';
import type { DjangoSuccessResponse, QueryParams } from '@/types';
import type {
  DocumentRequest,
  CreateDocumentRequestData,
  UpdateDocumentRequestData,
} from '../types';

const BASE_URL = '/dashboard/student-services/document-requests/';

export const getDocumentRequestsApi = (params?: QueryParams) =>
  getListApi<DocumentRequest>(axios, BASE_URL, params);

export async function createDocumentRequestApi(
  data: CreateDocumentRequestData
): Promise<DocumentRequest> {
  const response = await axios.post<DjangoSuccessResponse<DocumentRequest>>(BASE_URL, data);
  return response.data.data as unknown as DocumentRequest;
}

export async function updateDocumentRequestApi(
  id: string,
  data: UpdateDocumentRequestData
): Promise<DocumentRequest> {
  const response = await axios.patch<DjangoSuccessResponse<DocumentRequest>>(
    `${BASE_URL}${id}/`,
    data
  );
  return response.data.data as unknown as DocumentRequest;
}

export async function deleteDocumentRequestApi(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}${id}/`);
}
