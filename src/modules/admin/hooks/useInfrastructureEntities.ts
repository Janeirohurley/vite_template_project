import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryParams } from '@/types';
import * as api from '../api/infrastructure';
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

export const useBuildings = (params: QueryParams = {}) =>
  useQuery({
    queryKey: ['buildings', params],
    queryFn: () => api.getBuildingsApi(params),
  });

export const useCreateBuilding = () => {
  const qc = useQueryClient();
  return useMutation<Building, Error, CreateBuildingData>({
    mutationFn: api.createBuildingApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }),
  });
};

export const useUpdateBuilding = () => {
  const qc = useQueryClient();
  return useMutation<Building, Error, { id: string; data: UpdateBuildingData }>({
    mutationFn: ({ id, data }) => api.updateBuildingApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }),
  });
};

export const useDeleteBuilding = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: api.deleteBuildingApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }),
  });
};

export const useRooms = (params: QueryParams = {}) =>
  useQuery({
    queryKey: ['rooms', params],
    queryFn: () => api.getRoomsApi(params),
  });

export const useCreateRoom = () => {
  const qc = useQueryClient();
  return useMutation<Room, Error, CreateRoomData>({
    mutationFn: api.createRoomApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

export const useUpdateRoom = () => {
  const qc = useQueryClient();
  return useMutation<Room, Error, { id: string; data: UpdateRoomData }>({
    mutationFn: ({ id, data }) => api.updateRoomApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

export const useDeleteRoom = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: api.deleteRoomApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

export const useEquipmentTypes = (params: QueryParams = {}) =>
  useQuery({
    queryKey: ['equipment-types', params],
    queryFn: () => api.getEquipmentTypesApi(params),
  });

export const useCreateEquipmentType = () => {
  const qc = useQueryClient();
  return useMutation<EquipmentType, Error, CreateEquipmentTypeData>({
    mutationFn: api.createEquipmentTypeApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-types'] }),
  });
};

export const useUpdateEquipmentType = () => {
  const qc = useQueryClient();
  return useMutation<EquipmentType, Error, { id: string; data: UpdateEquipmentTypeData }>({
    mutationFn: ({ id, data }) => api.updateEquipmentTypeApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-types'] }),
  });
};

export const useDeleteEquipmentType = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: api.deleteEquipmentTypeApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-types'] }),
  });
};

export const useEquipments = (params: QueryParams = {}) =>
  useQuery({
    queryKey: ['equipments', params],
    queryFn: () => api.getEquipmentsApi(params),
  });

export const useCreateEquipment = () => {
  const qc = useQueryClient();
  return useMutation<Equipment, Error, CreateEquipmentData>({
    mutationFn: api.createEquipmentApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipments'] }),
  });
};

export const useUpdateEquipment = () => {
  const qc = useQueryClient();
  return useMutation<Equipment, Error, { id: string; data: UpdateEquipmentData }>({
    mutationFn: ({ id, data }) => api.updateEquipmentApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipments'] }),
  });
};

export const useDeleteEquipment = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: api.deleteEquipmentApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipments'] }),
  });
};

export const useEquipmentAllocations = (params: QueryParams = {}) =>
  useQuery({
    queryKey: ['equipment-allocations', params],
    queryFn: () => api.getEquipmentAllocationsApi(params),
  });

export const useCreateEquipmentAllocation = () => {
  const qc = useQueryClient();
  return useMutation<EquipmentAllocation, Error, CreateEquipmentAllocationData>({
    mutationFn: api.createEquipmentAllocationApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-allocations'] }),
  });
};

export const useUpdateEquipmentAllocation = () => {
  const qc = useQueryClient();
  return useMutation<
    EquipmentAllocation,
    Error,
    { id: string; data: UpdateEquipmentAllocationData }
  >({
    mutationFn: ({ id, data }) => api.updateEquipmentAllocationApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-allocations'] }),
  });
};

export const useDeleteEquipmentAllocation = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: api.deleteEquipmentAllocationApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-allocations'] }),
  });
};

export const useEquipmentMaintenances = (params: QueryParams = {}) =>
  useQuery({
    queryKey: ['equipment-maintenances', params],
    queryFn: () => api.getEquipmentMaintenancesApi(params),
  });

export const useCreateEquipmentMaintenance = () => {
  const qc = useQueryClient();
  return useMutation<EquipmentMaintenance, Error, CreateEquipmentMaintenanceData>({
    mutationFn: api.createEquipmentMaintenanceApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-maintenances'] }),
  });
};

export const useUpdateEquipmentMaintenance = () => {
  const qc = useQueryClient();
  return useMutation<
    EquipmentMaintenance,
    Error,
    { id: string; data: UpdateEquipmentMaintenanceData }
  >({
    mutationFn: ({ id, data }) => api.updateEquipmentMaintenanceApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-maintenances'] }),
  });
};

export const useDeleteEquipmentMaintenance = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: api.deleteEquipmentMaintenanceApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment-maintenances'] }),
  });
};
