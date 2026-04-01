export interface Building {
  id: string;
  building_name: string;
  building_code?: string | null;
  location?: string | null;
  university_name?: string;
}

export interface CreateBuildingData {
  university: string;
  building_name: string;
  building_code?: string | null;
  location?: string | null;
}

export type UpdateBuildingData = Partial<CreateBuildingData>;

export interface Room {
  id: string;
  building_name?: string;
  room_name: string;
  capacity: number;
  room_type: string;
  is_available: boolean;
}

export interface CreateRoomData {
  building: string;
  room_name: string;
  capacity: number;
  room_type: string;
  is_available?: boolean;
}

export type UpdateRoomData = Partial<CreateRoomData>;

export interface EquipmentType {
  id: string;
  name: string;
}

export interface CreateEquipmentTypeData {
  name: string;
}

export type UpdateEquipmentTypeData = Partial<CreateEquipmentTypeData>;

export interface Equipment {
  id: string;
  equipment_name: string;
  equipment_type_name?: string;
  serial_number?: string | null;
  equipment_number: string;
  purchase_date?: string | null;
  status: string;
}

export interface CreateEquipmentData {
  equipment_name: string;
  equipment_type: string;
  serial_number?: string | null;
  equipment_number: string;
  purchase_date?: string | null;
  status?: string;
}

export type UpdateEquipmentData = Partial<CreateEquipmentData>;

export interface EquipmentAllocation {
  id: string;
  equipment_name?: string;
  room_name?: string;
  user_name?: string;
  allocation_date: string;
  return_date?: string | null;
  status: string;
}

export interface CreateEquipmentAllocationData {
  equipment: string;
  room: string;
  allocated_to?: string | null;
  allocation_date: string;
  return_date?: string | null;
  status?: string;
}

export type UpdateEquipmentAllocationData = Partial<CreateEquipmentAllocationData>;

export interface EquipmentMaintenance {
  id: string;
  equipment_name?: string;
  maintenance_date: string;
  return_date?: string | null;
  description: string;
  performed_by?: string | null;
  cost: number;
}

export interface CreateEquipmentMaintenanceData {
  equipment: string;
  maintenance_date: string;
  return_date?: string | null;
  description: string;
  performed_by?: string | null;
  cost: number;
}

export type UpdateEquipmentMaintenanceData = Partial<CreateEquipmentMaintenanceData>;
