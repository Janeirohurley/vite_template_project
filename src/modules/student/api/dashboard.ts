import axios from '@/lib/axios';
import type { DjangoSuccessResponse, ApiError } from '@/types/api';
import type { StudentDashboardData } from '../types';

export async function fetchStudentDashboardData(): Promise<StudentDashboardData> {
    try {
        const response = await axios.get<DjangoSuccessResponse<StudentDashboardData>>(
            '/student/dashboard/'
        );

        // Grâce à ton intercepteur, data = data.data
        return response.data.data as StudentDashboardData;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}
