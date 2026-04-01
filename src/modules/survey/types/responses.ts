/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentName?: string;
  respondentEmail?: string;
  submittedAt: string;
  responses: Record<string, any>;
}

export interface QuestionStats {
  questionId: string;
  questionLabel: string;
  questionType: string;
  totalResponses: number;
  optionCounts?: Record<string, number>;
  averageRating?: number;
  ratingDistribution?: Record<number, number>;
  textResponses?: Array<{ value: string; respondent?: string; date: string }>;
}

export interface SurveyStats {
  surveyId: string;
  surveyTitle: string;
  totalResponses: number;
  questionStats: QuestionStats[];
}
