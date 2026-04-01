import type { QueryParams } from "@/types";
import { getListApi } from "@/api/getListApi";
import BanksAxios from "./banksAxios"; // <--- SANS accolades si c'est un export default
import type { Banks } from "../types/banks";
// import { Bank } from "../types/bank"; // Si tu as un type Bank

export const getBanksApi = (params?: QueryParams) =>
  getListApi<Banks>(BanksAxios, "/", params);

export const createBankApi = async (data: Partial<Banks>) => {
  return (await BanksAxios.post("/", data)).data;
};

export const updateBankApi = async (id: string, data: Partial<Banks>, isPartial = false) => {
  const method = isPartial ? BanksAxios.patch : BanksAxios.put;
  return (await method(`/${id}/`, data)).data;
};

export const deleteBankApi = async (id: string) => {
  await BanksAxios.delete(`/${id}/`);
};