import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/geo';
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

const invalidateGeo = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['countries'] });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCountryData) => api.createCountryApi(data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCountryData }) =>
      api.updateCountryApi(id, data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCountryApi(id),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useCreateProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProvinceData) => api.createProvinceApi(data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useUpdateProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProvinceData }) =>
      api.updateProvinceApi(id, data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useDeleteProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteProvinceApi(id),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useCreateCommune = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommuneData) => api.createCommuneApi(data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useUpdateCommune = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommuneData }) =>
      api.updateCommuneApi(id, data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useDeleteCommune = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCommuneApi(id),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateZoneData) => api.createZoneApi(data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateZoneData }) =>
      api.updateZoneApi(id, data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteZoneApi(id),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useCreateColline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCollineData) => api.createCollineApi(data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useUpdateColline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollineData }) =>
      api.updateCollineApi(id, data),
    onSuccess: () => invalidateGeo(queryClient),
  });
};

export const useDeleteColline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCollineApi(id),
    onSuccess: () => invalidateGeo(queryClient),
  });
};
