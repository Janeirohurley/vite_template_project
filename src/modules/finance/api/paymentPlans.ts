import type { QueryParams } from "@/types";
import paymentAxios from "./paymentAxios";
import { getListApi } from "@/api/getListApi";
import type { PaymentPlan, PaymentPlanPayload } from "../types/paymentplan";


export const fetchPaymentPlansApi = async (params?: QueryParams) =>
  getListApi<PaymentPlan>(paymentAxios, "/payment-plans/", params);

export const createPaymentPlanApi = async (payload: PaymentPlanPayload) => {
  const res = await paymentAxios.post("/payment-plans/", payload);
  return res.data;
};

export const updatePaymentPlanApi = async (id: string, payload: Partial<PaymentPlanPayload>) => {
  const res = await paymentAxios.patch(`/payment-plans/${id}/`, payload);
  return res.data;
};

export const deletePaymentPlanApi = async (id: string) => {
  await paymentAxios.delete(`/payment-plans/${id}/`);
};