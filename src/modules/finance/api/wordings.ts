import type { QueryParams } from "@/types";
import { getListApi } from "@/api/getListApi";
import wordingsAxios from "./wordingsAxios";
import type { CreateWordingPayload, Wordings } from "../types/wordings";

export const getWordingsApi = (params?: QueryParams) =>
  getListApi<Wordings>(wordingsAxios, "/", params);

export const createWordingsApi = async (data: CreateWordingPayload): Promise<Wordings> => {
  return (await wordingsAxios.post("/", data)).data;
};

export const updateWordingsApi = async (id: string, data: Partial<Wordings>): Promise<Wordings> => {

  return (await wordingsAxios.patch(`/${id}/`, data)).data;
};

export const deleteWordingsApi = async (id: string): Promise<void> => {
  await wordingsAxios.delete(`/${id}/`);
};