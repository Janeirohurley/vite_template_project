import infrastructureAxios from './axiosInfrastructure';
import { getListApi } from '@/api/getListApi';
import type { DjangoSuccessResponse, QueryParams } from '@/types';
import type {
  Building,
  CreateBuildingData,
  UpdateBuildingData,
  Room,
  CreateRoomData,
  UpdateRoomData,
  EquipmentType,
  CreateEquipmentTypeData,
  UpdateEquipmentTypeData,
  Equipment,
  CreateEquipmentData,
  UpdateEquipmentData,
  EquipmentAllocation,
  CreateEquipmentAllocationData,
  UpdateEquipmentAllocationData,
  EquipmentMaintenance,
  CreateEquipmentMaintenanceData,
  UpdateEquipmentMaintenanceData,
} from '../types/infrastructureTypes';

export const getBuildingsApi = (params?: QueryParams) =>
  getListApi<Building>(infrastructureAxios, '/buildings/', params);

export const createBuildingApi = async (data: CreateBuildingData): Promise<Building> => {
  const response = await infrastructureAxios.post<DjangoSuccessResponse<Building>>(
    '/buildings/',
    data
  );
  return response.data.data;
};

export const updateBuildingApi = async (
  id: string,
  data: UpdateBuildingData
): Promise<Building> => {
  const response = await infrastructureAxios.put<DjangoSuccessResponse<Building>>(
    '/buildings/',
    { id, ...data }
  );
  return response.data.data;
};

export const deleteBuildingApi = async (id: string): Promise<void> => {
  await infrastructureAxios.delete('/buildings/', { data: { id } });
};

export const getRoomsApi = (params?: QueryParams) =>
  getListApi<Room>(infrastructureAxios, '/rooms/', params);

export const createRoomApi = async (data: CreateRoomData): Promise<Room> => {
  const response = await infrastructureAxios.post<DjangoSuccessResponse<Room>>(
    '/rooms/',
    data
  );
  return response.data.data;
};

export const updateRoomApi = async (id: string, data: UpdateRoomData): Promise<Room> => {
  const response = await infrastructureAxios.patch<DjangoSuccessResponse<Room>>(
    `/rooms/${id}/`,
    data
  );
  return response.data.data;
};

export const deleteRoomApi = async (id: string): Promise<void> => {
  await infrastructureAxios.delete(`/rooms/${id}/`);
};

export const getEquipmentTypesApi = (params?: QueryParams) =>
  getListApi<EquipmentType>(infrastructureAxios, '/equipment-types/', params);

export const createEquipmentTypeApi = async (
  data: CreateEquipmentTypeData
): Promise<EquipmentType> => {
  const response = await infrastructureAxios.post<DjangoSuccessResponse<EquipmentType>>(
    '/equipment-types/',
    data
  );
  return response.data.data;
};

export const updateEquipmentTypeApi = async (
  id: string,
  data: UpdateEquipmentTypeData
): Promise<EquipmentType> => {
  const response = await infrastructureAxios.patch<DjangoSuccessResponse<EquipmentType>>(
    `/equipment-types/${id}/`,
    data
  );
  return response.data.data;
};

export const deleteEquipmentTypeApi = async (id: string): Promise<void> => {
  await infrastructureAxios.delete(`/equipment-types/${id}/`);
};

export const getEquipmentsApi = (params?: QueryParams) =>
  getListApi<Equipment>(infrastructureAxios, '/equipments/', params);

export const createEquipmentApi = async (data: CreateEquipmentData): Promise<Equipment> => {
  const response = await infrastructureAxios.post<DjangoSuccessResponse<Equipment>>(
    '/equipments/',
    data
  );
  return response.data.data;
};

export const updateEquipmentApi = async (
  id: string,
  data: UpdateEquipmentData
): Promise<Equipment> => {
  const response = await infrastructureAxios.patch<DjangoSuccessResponse<Equipment>>(
    `/equipments/${id}/`,
    data
  );
  return response.data.data;
};

export const deleteEquipmentApi = async (id: string): Promise<void> => {
  await infrastructureAxios.delete(`/equipments/${id}/`);
};

export const getEquipmentAllocationsApi = (params?: QueryParams) =>
  getListApi<EquipmentAllocation>(infrastructureAxios, '/equipment-allocations/', params);

export const createEquipmentAllocationApi = async (
  data: CreateEquipmentAllocationData
): Promise<EquipmentAllocation> => {
  const response = await infrastructureAxios.post<DjangoSuccessResponse<EquipmentAllocation>>(
    '/equipment-allocations/',
    data
  );
  return response.data.data;
};

export const updateEquipmentAllocationApi = async (
  id: string,
  data: UpdateEquipmentAllocationData
): Promise<EquipmentAllocation> => {
  const response = await infrastructureAxios.patch<
    DjangoSuccessResponse<EquipmentAllocation>
  >(`/equipment-allocations/${id}/`, data);
  return response.data.data;
};

export const deleteEquipmentAllocationApi = async (id: string): Promise<void> => {
  await infrastructureAxios.delete(`/equipment-allocations/${id}/`);
};

export const getEquipmentMaintenancesApi = (params?: QueryParams) =>
  getListApi<EquipmentMaintenance>(infrastructureAxios, '/equipment-maintenances/', params);

export const createEquipmentMaintenanceApi = async (
  data: CreateEquipmentMaintenanceData
): Promise<EquipmentMaintenance> => {
  const response = await infrastructureAxios.post<
    DjangoSuccessResponse<EquipmentMaintenance>
  >('/equipment-maintenances/', data);
  return response.data.data;
};

export const updateEquipmentMaintenanceApi = async (
  id: string,
  data: UpdateEquipmentMaintenanceData
): Promise<EquipmentMaintenance> => {
  const response = await infrastructureAxios.patch<
    DjangoSuccessResponse<EquipmentMaintenance>
  >(`/equipment-maintenances/${id}/`, data);
  return response.data.data;
};

export const deleteEquipmentMaintenanceApi = async (id: string): Promise<void> => {
  await infrastructureAxios.delete(`/equipment-maintenances/${id}/`);
};
