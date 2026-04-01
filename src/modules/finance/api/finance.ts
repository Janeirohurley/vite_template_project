import { getListApi } from "@/api/getListApi";
import financeAxios from "./financeAxios";
import type { QueryParams } from "@/types";
import type { CreateFeesSheets, FeesSheet, wording } from "../types/finance";
import type { GroupedOption } from "@/components/ui/SingleSelectDropdown";




export const getFeesSheetsApi = (params?: QueryParams) => getListApi<FeesSheet>(financeAxios, "fees-sheets/", params);
export const getFeesSheetsGroupedOptionApi = (params?: QueryParams) => getListApi<GroupedOption>(financeAxios, "fees-sheets/grouped-options/", params);

export const createFeesSheetsApi = async (data: CreateFeesSheets): Promise<FeesSheet> => {
  return (await financeAxios.post("fees-sheets/", data)).data
}
export const updatedFeesSheetsApi = async (
  id: string,
  data: Partial<CreateFeesSheets> ,
  isPartial = false
) => {
  const request = isPartial
    ? financeAxios.patch
    : financeAxios.put;

  return (await request(`fees-sheets/${id}/`, data)).data;
};

export const deleteFeesSheetsApi = async (id: string) => {
  return (await financeAxios.delete(`fees-sheets/${id}/`)).data
}

export const getWordingApi = (params?: QueryParams) => getListApi<wording>(financeAxios, "wordings/", params);
