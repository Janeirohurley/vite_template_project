// src/hooks/useFetch.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { ApiResponse } from "@/types";

export function useFetch<T>(
    key: string,
    url: string,
    enabled: boolean = true
) {
    return useQuery({
        queryKey: [key],
        queryFn: async () => {
            const { data } = await axios.get<ApiResponse<T>>(url);
            return data;
        },
        enabled,
    });
}
