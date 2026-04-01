// Réexporter le store centralisé pour compatibilité avec les imports existants
import { useAppStore } from "@/lib/store";

export const useSettings = useAppStore;
export type { Theme, Language } from "@/lib/store";