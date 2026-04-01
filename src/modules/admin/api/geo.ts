import axios from '@/lib/axios';
import type { Country, Province, Commune, Zone, Colline } from '@/types';
import type {
  CreateCountryData,
  UpdateCountryData,
  CreateProvinceData,
  UpdateProvinceData,
  CreateCommuneData,
  UpdateCommuneData,
  CreateZoneData,
  UpdateZoneData,
  CreateCollineData,
  UpdateCollineData,
} from '../types/geoTypes';

type ApiPayload<T> = {
  data?: T;
};

const resolveData = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiPayload<T>).data as T;
  }
  return payload as T;
};

export const createCountryApi = async (data: CreateCountryData): Promise<Country> => {
  const response = await axios.post('/geo/countries/', data);
  return resolveData<Country>(response.data);
};

export const updateCountryApi = async (
  id: string,
  data: UpdateCountryData
): Promise<Country> => {
  const response = await axios.put(`/geo/countries/${id}/`, data);
  return resolveData<Country>(response.data);
};

export const deleteCountryApi = async (id: string): Promise<void> => {
  await axios.delete(`/geo/countries/${id}/`);
};

export const createProvinceApi = async (data: CreateProvinceData): Promise<Province> => {
  const response = await axios.post('/geo/provinces/', data);
  return resolveData<Province>(response.data);
};

export const updateProvinceApi = async (
  id: string,
  data: UpdateProvinceData
): Promise<Province> => {
  const response = await axios.put(`/geo/provinces/${id}/`, data);
  return resolveData<Province>(response.data);
};

export const deleteProvinceApi = async (id: string): Promise<void> => {
  await axios.delete(`/geo/provinces/${id}/`);
};

export const createCommuneApi = async (data: CreateCommuneData): Promise<Commune> => {
  const response = await axios.post('/geo/communes/', data);
  return resolveData<Commune>(response.data);
};

export const updateCommuneApi = async (
  id: string,
  data: UpdateCommuneData
): Promise<Commune> => {
  const response = await axios.put(`/geo/communes/${id}/`, data);
  return resolveData<Commune>(response.data);
};

export const deleteCommuneApi = async (id: string): Promise<void> => {
  await axios.delete(`/geo/communes/${id}/`);
};

export const createZoneApi = async (data: CreateZoneData): Promise<Zone> => {
  const response = await axios.post('/geo/zones/', data);
  return resolveData<Zone>(response.data);
};

export const updateZoneApi = async (id: string, data: UpdateZoneData): Promise<Zone> => {
  const response = await axios.put(`/geo/zones/${id}/`, data);
  return resolveData<Zone>(response.data);
};

export const deleteZoneApi = async (id: string): Promise<void> => {
  await axios.delete(`/geo/zones/${id}/`);
};

export const createCollineApi = async (data: CreateCollineData): Promise<Colline> => {
  const response = await axios.post('/geo/collines/', data);
  return resolveData<Colline>(response.data);
};

export const updateCollineApi = async (
  id: string,
  data: UpdateCollineData
): Promise<Colline> => {
  const response = await axios.put(`/geo/collines/${id}/`, data);
  return resolveData<Colline>(response.data);
};

export const deleteCollineApi = async (id: string): Promise<void> => {
  await axios.delete(`/geo/collines/${id}/`);
};
