import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/paymentPlans";
import type { QueryParams } from "@/types";
import type { PaymentPlanPayload } from "../types/paymentplan";

export function usePaymentPlans(params?: QueryParams) {
  return useQuery({
    queryKey: ["payment-plans", params],
    queryFn: () => api.fetchPaymentPlansApi(params),
  });
}

export function useCreatePaymentPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentPlanPayload) => api.createPaymentPlanApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-plans"] });
    },
  });
}

export type UpdatePaymentPlanPayload = {
  id: string;
  data: Partial<PaymentPlanPayload>;
};

export function useUpdatePaymentPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePaymentPlanPayload) => api.updatePaymentPlanApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-plans"] });
    },
  });
}

export function useDeletePaymentPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deletePaymentPlanApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-plans"] });
    },
  });
}