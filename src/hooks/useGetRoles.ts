import getRoles from "@/api/getRoles";
import type { QueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetRoles(params?: QueryParams) {
    return useQuery({
        queryKey: ['schedule-slots', params],
        queryFn: () => getRoles(params),
    });
}
