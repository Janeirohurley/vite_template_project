import SurveyAxios from "./surveyAxios";
import type { Survey } from "../types";
import type { SurveyResponse, SurveyStats } from "../types/responses";
import type { SurveyBackend, SurveyResponseBackend } from "../types/backend";
import type { SurveyStatsBackend } from "../types/statsBackend";
import { transformKeysToCamelCase, transformKeysToSnakeCase } from "../utils/caseTransform";
import type { AxiosResponse } from "axios";
import { getListApi } from "@/api/getListApi";
import type { PaginatedResponse } from "@/types";

// Survey CRUD
export const getSurveysApi = async (): Promise<PaginatedResponse<Survey>> => {
  const response = await getListApi<SurveyBackend>(SurveyAxios, "/");
  return {
    ...response,
    results: response.results.map(
      (survey) => transformKeysToCamelCase(survey) as Survey
    ),
  };
};

export const getSurveyByIdApi = async (id: string): Promise<AxiosResponse<Survey>> => {
  const response = await SurveyAxios.get<SurveyBackend>(`/${id}`);
  const payload = (response.data as unknown as { data?: SurveyBackend })?.data ?? response.data;
  return { ...response, data: transformKeysToCamelCase(payload) as Survey };
};

export const createSurveyApi = async (survey: Survey, logoFile?: File): Promise<AxiosResponse<Survey>> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, questions, logo, ...rest } = survey;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cleanedQuestions = (questions || []).map(({ id: _questionId, ...q }) => q);
  const createPayload = { ...rest, questions: cleanedQuestions };
  
  const formData = new FormData();
  const snakeCaseData = transformKeysToSnakeCase(createPayload);
  
  // Ajouter chaque champ individuellement au FormData
  Object.entries(snakeCaseData).forEach(([key, value]) => {
    if (key === 'questions') {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  if (logoFile) {
    formData.append('logo', logoFile);
  }
  
  const response = await SurveyAxios.post<SurveyBackend>("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const payload = (response.data as unknown as { data?: SurveyBackend })?.data ?? response.data;
  return { ...response, data: transformKeysToCamelCase(payload) as Survey };
};

export const updateSurveyApi = async (id: string, survey: Partial<Survey>, logoFile?: File): Promise<AxiosResponse<Survey>> => {
  const formData = new FormData();
  const snakeCaseData = transformKeysToSnakeCase(survey);
  
  // Ajouter chaque champ individuellement au FormData
  Object.entries(snakeCaseData).forEach(([key, value]) => {
    if (key === 'questions') {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  if (logoFile) {
    formData.append('logo', logoFile);
  }
  
  const response = await SurveyAxios.put<SurveyBackend>(`/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const payload = (response.data as unknown as { data?: SurveyBackend })?.data ?? response.data;
  return { ...response, data: transformKeysToCamelCase(payload) as Survey };
};

export const deleteSurveyApi = (id: string) => SurveyAxios.delete(`/${id}/`);

// Survey Responses
export const getSurveyResponsesApi = async (surveyId: string): Promise<AxiosResponse<SurveyResponse[]>> => {
  const response = await SurveyAxios.get<SurveyResponseBackend[]>(`/${surveyId}/responses/`);
  const payload = (response.data as unknown as { data?: SurveyResponseBackend[] })?.data ?? response.data;
  return { ...response, data: transformKeysToCamelCase(payload) as SurveyResponse[] };
};

export const submitSurveyResponseApi = async (
  surveyId: string,
  response: Omit<SurveyResponse, "id" | "submittedAt">
): Promise<AxiosResponse<SurveyResponse>> => {
  const normalizedResponses = Object.fromEntries(
    Object.entries(response.responses || {}).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value.map((v) => String(v))];
      }
      if (value === null || value === undefined) {
        return [key, ""];
      }
      return [key, String(value)];
    })
  );

  const formData = new FormData();
  formData.append("survey_id", response.surveyId);
  if (response.respondentName) formData.append("respondent_name", response.respondentName);
  if (response.respondentEmail) formData.append("respondent_email", response.respondentEmail);
  formData.append("responses", JSON.stringify(normalizedResponses));

  const apiResponse = await SurveyAxios.post<SurveyResponseBackend>(
    `/${surveyId}/submit_response/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  const payload = (apiResponse.data as unknown as { data?: SurveyResponseBackend })?.data ?? apiResponse.data;
  return { ...apiResponse, data: transformKeysToCamelCase(payload) as SurveyResponse };
};

export const getSurveyResponseByIdApi = async (surveyId: string, responseId: string): Promise<AxiosResponse<SurveyResponse>> => {
  const response = await SurveyAxios.get<SurveyResponseBackend>(`/${surveyId}/responses/${responseId}/`);
  const payload = (response.data as unknown as { data?: SurveyResponseBackend })?.data ?? response.data;
  return { ...response, data: transformKeysToCamelCase(payload) as SurveyResponse };
};

// Survey Statistics
export const getSurveyStatsApi = async (surveyId: string): Promise<AxiosResponse<SurveyStats>> => {
  const response = await SurveyAxios.get<SurveyStatsBackend>(`/${surveyId}/stats/`);
  const payload = (response.data as unknown as { data?: SurveyStatsBackend })?.data ?? response.data;
  return { ...response, data: transformKeysToCamelCase(payload) as SurveyStats };
};
