export * from './auditLogs';
export * from './users';
export * from './academic'
export * from './admin'
export * from './AdminAxios'
// NOTE: infrastructure exports room APIs that collide with academic room APIs.
// Re-export infrastructure APIs explicitly with aliases for room-related functions.
export {
  getBuildingsApi,
  createBuildingApi,
  updateBuildingApi,
  deleteBuildingApi,
  getRoomsApi as getInfrastructureRoomsApi,
  createRoomApi as createInfrastructureRoomApi,
  updateRoomApi as updateInfrastructureRoomApi,
  deleteRoomApi as deleteInfrastructureRoomApi,
  getEquipmentTypesApi,
  createEquipmentTypeApi,
  updateEquipmentTypeApi,
  deleteEquipmentTypeApi,
  getEquipmentsApi,
  createEquipmentApi,
  updateEquipmentApi,
  deleteEquipmentApi,
  getEquipmentAllocationsApi,
  createEquipmentAllocationApi,
  updateEquipmentAllocationApi,
  deleteEquipmentAllocationApi,
  getEquipmentMaintenancesApi,
  createEquipmentMaintenanceApi,
  updateEquipmentMaintenanceApi,
  deleteEquipmentMaintenanceApi,
} from './infrastructure'
