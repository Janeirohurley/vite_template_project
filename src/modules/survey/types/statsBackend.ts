/* eslint-disable @typescript-eslint/no-explicit-any */

export interface QuestionStatsBackend {
  question_id: string;
  question_label: string;
  question_type: string;
  total_responses: number;
  option_counts?: Record<string, number>;
  average_rating?: number;
  rating_distribution?: Record<number, number>;
  text_responses?: Array<{ value: string; respondent?: string; date: string }>;
}

export interface SurveyStatsBackend {
  survey_id: string;
  survey_title: string;
  total_responses: number;
  question_stats: QuestionStatsBackend[];
}
