import axios from '@/lib/axios';
import type { DjangoSuccessResponse, ApiError } from '@/types/api';
import type { User } from '@/types';

export async function getUserApi(): Promise<User> {
    try {
        const response = await axios.get<DjangoSuccessResponse<User>>(
            'users/me/'
        );

        // Grâce à ton intercepteur, data = data.data
        return response.data.data as User;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}
