import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import paymentAxios from "../api/paymentAxios";
import type { QueryParams } from "@/types";
import { geBankPayments, getPaymentsApi, getPaymentsByInscriptionId } from "../api/payment";

// 1. Hook pour les PAIEMENTS (Formatage strict pour PaginatedResponse)
export function usePayments(params?: QueryParams) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => getPaymentsApi(params)
  });
}

// Hook pour récupérer les paiements par inscription_id
export function usePaymentsByInscription(inscriptionId?: string) {
  return useQuery({
    queryKey: ['payments', 'by-inscription', inscriptionId],
    queryFn: () => getPaymentsByInscriptionId(inscriptionId!),
    // On n'exécute la requête que si l'id est fourni
    enabled: !!inscriptionId,
  });
}

// 2. Hook pour les BANQUES
export function useBanksPayments(params?: QueryParams) {
  return useQuery({
    queryKey: ['banks', params],
    queryFn: () => geBankPayments(params),
  });
}



// 5. MUTATIONS
export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => paymentAxios.post("payments/", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });
}

// 6. Mutation pour la mise à jour d'un paiement


export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: FormData }) =>
      paymentAxios.patch(`payments/${id}/`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentAxios.delete(`payments/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });
}
