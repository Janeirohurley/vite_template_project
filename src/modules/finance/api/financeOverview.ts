import financeAxios from "./financeAxios";
import type { FinanceOverview } from "../types/financeOverview";
import type { QueryParams } from "@/types";

export const getFinanceOverviewApi = async (
  params?: QueryParams
): Promise<FinanceOverview> => {
  const response = await financeAxios.get("/overview/", { params });
  return response.data?.data || response.data;
};
