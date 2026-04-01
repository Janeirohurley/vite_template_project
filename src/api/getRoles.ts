import type { ApiError, DjangoSuccessResponse, QueryParams, UserRole } from "@/types";
import axios from '@/lib/axios';
export default async function getRoles(params?: QueryParams): Promise<UserRole> {
    try {
        const response = await axios.get<DjangoSuccessResponse<UserRole>>('/available-roles/', { params });
        return response.data.data;
    } catch (error: ApiError | unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}