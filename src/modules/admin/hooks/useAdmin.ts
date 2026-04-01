import type { ApiError } from "@/types";
import type { UniversityStatistics } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getUnveristeOverView } from "../api";

export const useAdminStatistique=()=> {
    return useQuery<UniversityStatistics, ApiError>({
        queryKey: ['dashboard-overview'],
        queryFn: () => getUnveristeOverView(),
        staleTime: 30000, // Les données sont considérées fraîches pendant 30 secondes
        refetchInterval: 120000, // Rafraîchir automatiquement toutes les 2 minutes (120 secondes)
        retry: 2, // Réessayer 2 fois en cas d'échec
    });
}