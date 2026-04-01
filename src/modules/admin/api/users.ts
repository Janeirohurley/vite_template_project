import axios from '@/lib/axios';
import type { DjangoSuccessResponse, ApiError, QueryParams } from '@/types/api';
import type { AdminUser, CreateUserData, UpdateUserData } from '../types/adminUserTypes';
import type { CreateProfileData, Profile } from '../types';
import { getListApi } from '@/api/getListApi';
import AdminAxios from './AdminAxios';

/**
 * Pagination info from backend
 */
export interface PaginationInfo {
    count: number;
    page_size: number;
    current_page: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
}

/**
 * Response pour la liste paginée d'utilisateurs
 */
export interface UsersResponse {
    results: AdminUser[];
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
}

/**
 * Paramètres pour la requête de récupération des utilisateurs
 */
export interface UsersParams extends QueryParams {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    department?: string;
    status?: 'active' | 'inactive' | 'pending';
}

/**
 * Récupère les utilisateurs depuis le backend
 * Endpoint: /dashboard/admin/users
 */

export const getUsersApi = async (params?: QueryParams) => getListApi<AdminUser>(AdminAxios, "/users/",params)
// export async function getUsersApi(params?: UsersParams): Promise<UsersResponse> {
//     try {
//         const response = await axios.get<DjangoSuccessResponse<AdminUser[]> & { pagination?: PaginationInfo }>(
//             '/dashboard/admin/users/',
//             { params }
//         );

//         const data = response.data.data as unknown as AdminUser[];
//         const pagination = (response.data as unknown as { pagination?: PaginationInfo }).pagination;

//         // Si le backend renvoie la pagination séparée
//         if (pagination) {
//             return {
//                 results: data,
//                 count: pagination.count,
//                 next: pagination.next,
//                 previous: pagination.previous,
//                 current_page: pagination.current_page,
//                 total_pages: pagination.total_pages,
//             };
//         }

//         // Fallback si pas de pagination (tableau simple)
//         return {
//             results: Array.isArray(data) ? data : [],
//             count: Array.isArray(data) ? data.length : 0,
//             next: null,
//             previous: null,
//             current_page: 1,
//             total_pages: 1,
//         };
//     } catch (error: unknown) {
//         const axiosError = error as { formattedError?: ApiError };
//         if (axiosError.formattedError) {
//             throw axiosError.formattedError;
//         }
//         throw error;
//     }
// }

/**
 * Récupère un utilisateur spécifique par son ID
 */
export async function getUserByIdApi(id: string): Promise<AdminUser> {
    try {
        const response = await axios.get<DjangoSuccessResponse<AdminUser>>(
            `/dashboard/admin/users/${id}/`
        );

        return response.data.data as unknown as AdminUser;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUserApi(userData: CreateUserData): Promise<AdminUser> {
    try {
        const response = await axios.post<DjangoSuccessResponse<AdminUser>>(
            '/dashboard/admin/users/',
            userData
        );

        return response.data.data as unknown as AdminUser;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Met à jour un utilisateur existant
 */
export async function updateUserApi(id: string, userData: UpdateUserData): Promise<AdminUser> {
    try {
        const response = await axios.patch<DjangoSuccessResponse<AdminUser>>(
            `/users/${id}/`,
            userData
        );

        return response.data.data as unknown as AdminUser;
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Supprime un utilisateur
 */
export async function deleteUserApi(id: string): Promise<void> {
    try {
        await axios.delete(`/dashboard/admin/users/${id}/`);
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Supprime plusieurs utilisateurs
 */
export async function bulkDeleteUsersApi(ids: string[]): Promise<void> {
    try {
        await axios.post('/dashboard/admin/users/bulk-delete/', { ids });
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Récupère la liste des rôles disponibles
 */
export async function getRolesApi(): Promise<import('@/types/user').UserRole[]> {
    try {
        const response = await axios.get<DjangoSuccessResponse<import('@/types/user').UserRole[]>>(
            '/dashboard/admin/roles/'
        );

        return response.data.data as unknown as import('@/types/user').UserRole[];
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Upload d'image de profil pour un utilisateur
 */
export async function uploadProfilePictureApi(file: File, userId: string): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        const response = await axios.post<DjangoSuccessResponse<{ profile_picture?: string; url?: string }>>(
            '/dashboard/admin/users/upload-profile-picture/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const data = response.data.data as unknown as { profile_picture?: string; url?: string };
        return data.profile_picture || data.url || '';
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}

/**
 * Récupère les statistiques des utilisateurs
 */
export async function getUsersStatsApi(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    byRole: Record<string, number>;
}> {
    try {
        const response = await axios.get<DjangoSuccessResponse<{
            total: number;
            active: number;
            inactive: number;
            pending: number;
            byRole: Record<string, number>;
        }>>('/dashboard/admin/users/stats/');

        return response.data.data as unknown as {
            total: number;
            active: number;
            inactive: number;
            pending: number;
            byRole: Record<string, number>;
        };
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}
// ============================================================================
// PROFILE API
// ============================================================================
/**
 * Récupère les profils du doyen connecté
 * Un doyen peut avoir plusieurs profils (plusieurs facultés)
 * Cette API retourne un tableau de profils
 */
export async function getDeanProfileApi(): Promise<import('../types/academicTypes').DeanProfile[]> {
    try {
        const response = await axios.get<DjangoSuccessResponse<import('../types/academicTypes').DeanProfile[]>>(
            '/hr/profiles/'
        );

        const data = response.data.data as unknown as import('../types/academicTypes').DeanProfile[];

        // S'assurer que c'est toujours un tableau
        return Array.isArray(data) ? data : [data];
    } catch (error: unknown) {
        const axiosError = error as { formattedError?: ApiError };
        if (axiosError.formattedError) {
            throw axiosError.formattedError;
        }
        throw error;
    }
}




export const createProfileApi = async (data: CreateProfileData): Promise<Profile> => (await axios.post<DjangoSuccessResponse<Profile>>('/hr/profiles/', data)).data.data;
