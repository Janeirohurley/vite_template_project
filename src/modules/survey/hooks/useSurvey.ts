import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSurveysApi,
  getSurveyByIdApi,
  createSurveyApi,
  updateSurveyApi,
  deleteSurveyApi,
  getSurveyResponsesApi,
  submitSurveyResponseApi,
  getSurveyStatsApi,
} from "../api/surveyApi";
import type { Survey } from "../types";
import type { SurveyResponse } from "../types/responses";

// Survey hooks
export const useSurveys = () => {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: async () => {
      return getSurveysApi();
    },
  });
};

export const useSurvey = (id: string) => {
  return useQuery({
    queryKey: ["surveys", id],
    queryFn: async () => {
      const response = await getSurveyByIdApi(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ survey, logoFile }: { survey: Survey; logoFile?: File }) => 
      createSurveyApi(survey, logoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
};

export const useUpdateSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, survey, logoFile }: { id: string; survey: Partial<Survey>; logoFile?: File }) =>
      updateSurveyApi(id, survey, logoFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["surveys", variables.id] });
    },
  });
};

export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSurveyApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
};

// Survey Response hooks
export const useSurveyResponses = (surveyId: string) => {
  return useQuery({
    queryKey: ["surveys", surveyId, "responses"],
    queryFn: async () => {
      const response = await getSurveyResponsesApi(surveyId);
      return response.data;
    },
    enabled: !!surveyId,
  });
};

export const useSubmitSurveyResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      surveyId,
      response,
    }: {
      surveyId: string;
      response: Omit<SurveyResponse, "id" | "submittedAt">;
    }) => submitSurveyResponseApi(surveyId, response),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["surveys", variables.surveyId, "responses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["surveys", variables.surveyId, "stats"],
      });
    },
  });
};

// Survey Statistics
export const useSurveyStats = (surveyId: string) => {
  return useQuery({
    queryKey: ["surveys", surveyId, "stats"],
    queryFn: async () => {
      const response = await getSurveyStatsApi(surveyId);
      return response.data;
    },
    enabled: !!surveyId,
  });
};
