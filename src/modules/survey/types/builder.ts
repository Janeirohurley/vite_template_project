import type {  QuestionType,  } from "./index";

export interface QuestionFormData {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  section: string;
  placeholder?: string;
  options?: string[];
  max?: number;
}

export interface SurveyFormData {
  id: string;
  title: string;
  description: string;
  multiStep: boolean;
  startDate?: string;
  endDate?: string;
  logo?: string;
  questions: QuestionFormData[];
}
