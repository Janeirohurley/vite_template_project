/* eslint-disable @typescript-eslint/no-explicit-any */
import type { QuestionType } from "./index";

// Backend types (snake_case)
export interface QuestionBackend {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  section: string;
  placeholder?: string;
  options?: string[];
  max?: number;
}

export interface SurveyBackend {
  id: string;
  title: string;
  description: string;
  logo?: string;
  multi_step?: boolean;
  start_date?: string;
  end_date?: string;
  questions: QuestionBackend[];
}

export interface SurveyResponseBackend {
  id: string;
  survey_id: string;
  respondent_name?: string;
  respondent_email?: string;
  submitted_at: string;
  responses: Record<string, any>;
}
