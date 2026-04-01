import axios from '@/lib/axios';
import deanAxios from './deanAxios';
import type { DjangoSuccessResponse, ApiError, QueryParams } from '@/types';
import type {
  TimetableStats,
  MergeValidationResponse,
  CreateMergeRequest,
  CreateMergeResponse,
  MergePreviewResponse,
  AddToMergeRequest,
  AddToMergeResponse,
  TimetableWithMerges,
  ShareTimetableResponse,
} from '../types/timetableBackend';
import { getListApi } from '@/api/getListApi';

const BASE_URL = '/dashboard/doyen';

export const getTimetablesApi = (params?: QueryParams) =>
  getListApi<TimetableWithMerges>(deanAxios, '/timetables/', params);

export async function getTimetableStatsApi(params?: QueryParams): Promise<TimetableStats> {
  try {
    const response = await axios.get<DjangoSuccessResponse<TimetableStats>>(
      `${BASE_URL}/timetables/stats/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function validateMergeApi(timetableIds: string[]): Promise<MergeValidationResponse> {
  try {
    const response = await axios.post<DjangoSuccessResponse<MergeValidationResponse>>(
      `${BASE_URL}/timetable-merges/validate/`,
      { timetable_ids: timetableIds }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createMergeApi(request: CreateMergeRequest): Promise<CreateMergeResponse> {
  try {
    const response = await axios.post<DjangoSuccessResponse<CreateMergeResponse>>(
      `${BASE_URL}/timetable-merges/`,
      request
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function getMergePreviewApi(mergeId: string): Promise<MergePreviewResponse> {
  try {
    const response = await axios.get<DjangoSuccessResponse<MergePreviewResponse>>(
      `${BASE_URL}/timetable-merges/${mergeId}/preview/`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function addToMergeApi(
  mergeId: string,
  request: AddToMergeRequest
): Promise<AddToMergeResponse> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<AddToMergeResponse>>(
      `${BASE_URL}/timetable-merges/${mergeId}/add/`,
      request
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function removeFromMergeApi(
  mergeId: string,
  timetableId: string
): Promise<AddToMergeResponse> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<AddToMergeResponse>>(
      `${BASE_URL}/timetable-merges/${mergeId}/remove/`,
      { timetable_id: timetableId }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function shareTimetableApi(
  timetableId: string,
  groupIds: string[]
): Promise<ShareTimetableResponse> {
  try {
    const response = await axios.post<DjangoSuccessResponse<ShareTimetableResponse>>(
      `${BASE_URL}/timetables/${timetableId}/add_shared_groups/`,
      { group_ids: groupIds }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function unshareTimetableApi(
  timetableId: string,
  groupId: string
): Promise<ShareTimetableResponse> {
  try {
    const response = await axios.post<DjangoSuccessResponse<ShareTimetableResponse>>(
      `${BASE_URL}/timetables/${timetableId}/remove_shared_group/`,
      { group_id: groupId }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}
