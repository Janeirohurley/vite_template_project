export * from './auditLog';
export * from './academicTypes'
export * from './geoTypes';
// NOTE: infrastructureTypes exports Room/CreateRoomData/UpdateRoomData which
// collide with academicTypes. We re-export infrastructure types explicitly
// and alias the room-related ones to avoid ambiguity.
export type {
  Building,
  CreateBuildingData,
  UpdateBuildingData,
  Room as InfrastructureRoom,
  CreateRoomData as CreateInfrastructureRoomData,
  UpdateRoomData as UpdateInfrastructureRoomData,
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
} from './infrastructureTypes';
