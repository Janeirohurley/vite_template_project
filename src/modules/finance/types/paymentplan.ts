
import type { Wordings } from "./wordings";

export interface FeesSheet {
  id: string;
  wording: Omit<Wordings, "academic_year">;
  base_amount: number;
  class_fk?: ClassInfo;
  faculty_info?: FacultyInfo;
  academic_year: AcademicInfo;
}

export interface PaymentPlan {
  id: string;
  feessheet: string;
  description: string;
  total_amount: number;
  monthly_amount?: number;
  start_date: string;
  end_date: string;
  status: "active" | "inactive";
  created_at: string;
  created_by: string;
  feessheet_info?: FeesSheet;
}

export interface PaymentPlanPayload {
  feessheet: string;
  description: string;
  total_amount: number;
  monthly_amount?: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface ClassInfo {
  class_name: string
  department_name: string;
  faculty_name: string;
  id: string;
}

export interface FacultyInfo {
  id: string;
  faculty_name: string;
}
export interface DeprtmentInfo {
  id: string;
  department_name: string;
}


export interface AcademicInfo {
  academic_year: string;
  id: string;
}