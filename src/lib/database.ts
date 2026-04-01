/* eslint-disable @typescript-eslint/no-explicit-any */
import Dexie from 'dexie';
import type { DeanProfile } from '@/modules/admin/types/academicTypes';

export interface TableSettings {
  id?: number;
  tableId: string;
  hiddenColumns: string[];
  pinnedColumns: string[];
  columnOrder: string[];
  columnWidths: Record<string, number>;
  pageSize: number;
  sortColumns: Array<{ column: string; direction: 'asc' | 'desc' }>;
  selectedRows: string[];
  updatedAt: Date;
}

export interface TableData {
  id?: number;
  tableId: string;
  rowId: string;
  data: any;
  originalIndex: number;
  customOrder?: number;
  updatedAt: Date;
}

export interface DeanProfileStore {
  id?: number;
  profileId: string;
  profileData: DeanProfile;
  updatedAt: Date;
}

export class DataTableDB extends Dexie {
  settings!: Dexie.Table<TableSettings, number>;
  tableData!: Dexie.Table<TableData, number>;
  deanProfile!: Dexie.Table<DeanProfileStore, number>;

  constructor() {
    super('DataTableDB');
    this.version(2).stores({
      settings: '++id, tableId, updatedAt',
      tableData: '++id, [tableId+rowId], tableId, rowId, originalIndex, customOrder, updatedAt',
      deanProfile: '++id, profileId, updatedAt'
    });
  }
}

export const db = new DataTableDB();

// Fonctions utilitaires
export const saveTableSettings = async (tableId: string, settings: Partial<TableSettings>) => {
  const existing = await db.settings.where('tableId').equals(tableId).first();
  
  if (existing) {
    await db.settings.update(existing.id!, {
      ...settings,
      updatedAt: new Date()
    });
  } else {
    await db.settings.add({
      tableId,
      hiddenColumns: [],
      pinnedColumns: [],
      columnOrder: [],
      columnWidths: {},
      pageSize: 10,
      sortColumns: [],
      selectedRows: [],
      ...settings,
      updatedAt: new Date()
    });
  }
};

export const getTableSettings = async (tableId: string): Promise<TableSettings | null> => {
  return await db.settings.where('tableId').equals(tableId).first() || null;
};

export const saveTableData = async (tableId: string, data: any[], getRowId: (row: any) => string) => {
  // Supprimer les anciennes données
  await db.tableData.where('tableId').equals(tableId).delete();
  
  // Sauvegarder les nouvelles données avec leur index original
  const tableDataItems = data.map((row, index) => ({
    tableId,
    rowId: getRowId(row),
    data: row,
    originalIndex: index,
    updatedAt: new Date()
  }));
  
  await db.tableData.bulkAdd(tableDataItems);
};

export const getTableData = async (tableId: string): Promise<any[]> => {
  const items = await db.tableData.where('tableId').equals(tableId).toArray();
  return items
    .sort((a, b) => (a.customOrder ?? a.originalIndex) - (b.customOrder ?? b.originalIndex))
    .map(item => item.data);
};

export const updateRowOrder = async (tableId: string, newOrder: string[]) => {
  const items = await db.tableData.where('tableId').equals(tableId).toArray();

  for (let i = 0; i < newOrder.length; i++) {
    const item = items.find(item => item.rowId === newOrder[i]);
    if (item) {
      await db.tableData.update(item.id!, {
        customOrder: i,
        updatedAt: new Date()
      });
    }
  }
};

// ============================================================================
// DEAN PROFILE UTILITIES
// ============================================================================

export const saveDeanProfile = async (profile: DeanProfile): Promise<void> => {
  // Validation: s'assurer que profile.id est une chaîne valide
  if (!profile.id || typeof profile.id !== 'string') {
    console.error('Invalid profile.id:', profile.id);
    throw new Error('Invalid profile ID: must be a non-empty string');
  }

  const existing = await db.deanProfile.where('profileId').equals(profile.id).first();

  if (existing) {
    await db.deanProfile.update(existing.id!, {
      profileData: profile,
      updatedAt: new Date()
    });
  } else {
    await db.deanProfile.add({
      profileId: profile.id,
      profileData: profile,
      updatedAt: new Date()
    });
  }
};

export const getDeanProfile = async (): Promise<DeanProfile | null> => {
  const profiles = await db.deanProfile.toArray();

  // On retourne le profil le plus récent (il ne devrait y en avoir qu'un)
  if (profiles.length > 0) {
    const sorted = profiles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return sorted[0].profileData;
  }

  return null;
};

export const deleteDeanProfile = async (): Promise<void> => {
  await db.deanProfile.clear();
};

export const updateDeanProfile = async (profile: DeanProfile): Promise<void> => {
  await saveDeanProfile(profile);
};