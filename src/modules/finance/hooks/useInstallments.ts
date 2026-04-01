import { useQuery } from "@tanstack/react-query";
import { getPaymentInstallmentsApi } from "../api/paymentinstallement";
import type { QueryParams } from "@/types";

export const usePaymentInstallments = (initialParams: QueryParams = { page: 1, page_size: 10 }) => {
  const query = useQuery({
    queryKey: ["payment-installments", initialParams],
    queryFn: () => getPaymentInstallmentsApi(initialParams),
  });

  return {
    ...query,
    installments: query.data?.results || [],
    totalCount: query.data?.count || 0,
    loading: query.isLoading,
    params: initialParams,
    refresh: query.refetch,
  };
};

export const useInstallments = usePaymentInstallments;