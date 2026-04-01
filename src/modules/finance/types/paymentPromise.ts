export type PaymentPromiseStatus = "pending" | "kept" | "broken";

export interface PaymentPromise {
  id: string;
  student: string;
  promised_amount: number;
  promised_date: string;
  status: PaymentPromiseStatus;
  notes?: string;
  recorded_at?: string;
}

export interface StudentInfo {
  id: string;
  full_name: string;
  matricule: string;
  class_name?: string;
}

export interface EnrichedPaymentPromise extends PaymentPromise {
  student_detail: StudentInfo;
}

export interface CreatePaymentPromisePayload {
  student: string;
  promised_amount: number;
  promised_date: string;
}
