import axios from "@/lib/axios";
import financeAxios from "./financeAxios";
import { getListApi } from "@/api/getListApi";
import type { QueryParams } from "@/types";
import type {
  CreatePaymentPromisePayload,
  PaymentPromise,
  PaymentPromiseStatus,
  StudentInfo,
} from "../types/paymentPromise";

type InscriptionApiItem = {
  student: string;
  student_first_name?: string;
  student_last_name?: string;
  student_matricule?: string;
  class_info?: { class_name?: string };
};

export const fetchPaymentPromisesApi = (params?: QueryParams) =>
  getListApi<PaymentPromise>(financeAxios, "/payment-promises/", params);

export const createPaymentPromiseApi = async (payload: CreatePaymentPromisePayload) => {
  const res = await financeAxios.post("/payment-promises/", payload);
  return res.data;
};

export const updatePaymentPromiseStatusApi = async (id: string, status: PaymentPromiseStatus) => {
  const res = await financeAxios.patch(`/payment-promises/${id}/`, { status });
  return res.data;
};

export const fetchStudentPromiseOptionsApi = async (): Promise<StudentInfo[]> => {
  const response = await axios.get("/student/inscriptions/");
  const base = response.data?.data || response.data;
  const list: InscriptionApiItem[] = Array.isArray(base)
    ? base
    : Array.isArray(base?.results)
      ? base.results
      : [];

  return list.map((ins) => ({
    id: ins.student,
    full_name: `${ins.student_first_name || ""} ${ins.student_last_name || ""}`.trim().toUpperCase(),
    matricule: ins.student_matricule || "N/A",
    class_name: ins.class_info?.class_name,
  }));
};
