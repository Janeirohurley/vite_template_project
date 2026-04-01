import axios from '@/lib/axios';
import type { DjangoSuccessResponse, ApiError } from '@/types/api';

export async function logoutApi(): Promise<void> {
    try {
        await axios.post<DjangoSuccessResponse<null>>(
            'logout/'
        );

        // Si ton intercepteur transforme déjà "data", pas besoin de toucher
        return;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}
