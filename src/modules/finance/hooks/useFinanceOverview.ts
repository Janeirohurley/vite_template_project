import { useQuery } from "@tanstack/react-query";
import { getFinanceOverviewApi } from "../api/financeOverview";
import type { QueryParams } from "@/types";

export const useFinanceOverview = (params?: QueryParams) =>
  useQuery({
    queryKey: ["finance-overview", params],
    queryFn: () => getFinanceOverviewApi(params),
  });
