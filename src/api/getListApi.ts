
import type { DjangoGetListResponse, PaginatedResponse, QueryParams } from "@/types";
import type { AxiosInstance } from "axios";



export async function getListApi<T>(
    axiosInstance: AxiosInstance,
    url: string,
    params?: QueryParams
): Promise<PaginatedResponse<T>> {
    const response = await axiosInstance.get<DjangoGetListResponse<T>>(url, {
        params,
    });

    const { data, pagination } = response.data;

    return {
        results: data,
        count: pagination?.count ?? data.length,
        current_page: pagination?.current_page ?? 1,
        next: pagination?.next ?? null,
        previous: pagination?.previous ?? null,
        total_pages: pagination?.total_pages ?? 0
    };
}