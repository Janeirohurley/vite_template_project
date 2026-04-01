
import type { DjangoSuccessResponse, QueryParams } from '@/types/api';
import type {
  JurySession,
  JuryDecision,
  GradeComplaint,
  CreateJurySessionData,
  UpdateJurySessionData,
  CreateJuryDecisionData,
  UpdateGradeComplaintData,
} from '../types/juryTypes';
import { getListApi } from '@/api/getListApi';
import deanAxios from './deanAxios';

// Jury Sessions
export const getJurySessionsApi = (params?: QueryParams) =>
  getListApi<JurySession>(deanAxios, '/jury-sessions/', params);

export const getJurySessionByIdApi = async (id: string): Promise<JurySession> =>
  (await deanAxios.get<DjangoSuccessResponse<JurySession>>(`/jury-sessions/${id}/`)).data.data;

export const createJurySessionApi = async (data: CreateJurySessionData): Promise<JurySession> =>
  (await deanAxios.post<DjangoSuccessResponse<JurySession>>('/jury-sessions/', data)).data.data;

export const updateJurySessionApi = async (id: string, data: UpdateJurySessionData): Promise<JurySession> =>
  (await deanAxios.patch<DjangoSuccessResponse<JurySession>>(`/jury-sessions/${id}/`, data)).data.data;

export const deleteJurySessionApi = async (id: string): Promise<void> =>
  await deanAxios.delete(`/jury-sessions/${id}/`);

// Jury Decisions
export const getJuryDecisionsApi = (params?: QueryParams) =>
  getListApi<JuryDecision>(deanAxios, '/jury-decisions/', params);

export const getJuryDecisionByIdApi = async (id: string): Promise<JuryDecision> =>
  (await deanAxios.get<DjangoSuccessResponse<JuryDecision>>(`/jury-decisions/${id}/`)).data.data;

export const createJuryDecisionApi = async (data: CreateJuryDecisionData): Promise<JuryDecision> =>
  (await deanAxios.post<DjangoSuccessResponse<JuryDecision>>('/jury-decisions/', data)).data.data;

// Grade Complaints
export const getGradeComplaintsApi = (params?: QueryParams) =>
  getListApi<GradeComplaint>(deanAxios, '/grade-complaints/', params);

export const getGradeComplaintByIdApi = async (id: string): Promise<GradeComplaint> =>
  (await deanAxios.get<DjangoSuccessResponse<GradeComplaint>>(`/grade-complaints/${id}/`)).data.data;

export const updateGradeComplaintApi = async (id: string, data: UpdateGradeComplaintData): Promise<GradeComplaint> =>
  (await deanAxios.patch<DjangoSuccessResponse<GradeComplaint>>(`/grade-complaints/${id}/`, data)).data.data;
