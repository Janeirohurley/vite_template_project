// Index du module généré automatiquement
export type QuestionType =
    | "text"
    | "textarea"
    | "radio"
    | "checkbox"
    | "select"
    | "rating";

export interface QuestionBase {
    id: string;
    label: string;
    type: QuestionType;
    required?: boolean;
    section?: string;
    placeholder?: string;
}

export interface OptionQuestion extends QuestionBase {
    type: "radio" | "checkbox" | "select";
    options: string[];
}

export interface RatingQuestion extends QuestionBase {
    type: "rating";
    max?: number;
}

export type Question =
    | (QuestionBase & { type: "text" | "textarea" })
    | OptionQuestion
    | RatingQuestion;

export interface Survey {
    id: string;
    title: string;
    description?: string;
    logo?: string;
    questions: Question[];
    multiStep?: boolean;
    startDate?: string;
    endDate?: string;
}

export type SurveyResponseValue = string | string[] | number | boolean | null;
export type SurveyResponses = Record<string, SurveyResponseValue>;
