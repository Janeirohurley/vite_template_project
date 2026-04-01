/* eslint-disable @typescript-eslint/no-explicit-any */
import Dexie from "dexie";

export const inscriptionDB = new Dexie("inscriptionDB");
inscriptionDB.version(1).stores({
  inscriptions: "id, status, updatedAt",
});

export interface InscriptionDraft {
  id: string;
  data: any;
  updatedAt: Date;
  status: "draft" | "completed";
}

export default inscriptionDB;
