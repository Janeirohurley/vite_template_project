import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersApi, getUserByIdApi, createUserApi, updateUserApi, deleteUserApi, bulkDeleteUsersApi, getRolesApi, uploadProfilePictureApi } from '../api/users';
import type { UserRole } from '@/types/user';
import type { ApiError, QueryParams } from '@/types/api';
import type { AdminUser, CreateUserData, UpdateUserData } from '../types/adminUserTypes';
import { notify } from '@/lib';

/**
 * Hook pour récupérer la liste des utilisateurs
 * Utilise React Query pour la gestion du cache et des états
 */
export function useUsers(params?: QueryParams) {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => getUsersApi(params),
        staleTime: 10000, // Les données sont considérées fraîches pendant 10 secondes
        retry: 2, // Réessayer 2 fois en cas d'échec
    });
}

/**
 * Hook pour récupérer un utilisateur spécifique par son ID
 */
export function useUser(id: string) {
    return useQuery<AdminUser, ApiError>({
        queryKey: ['users', id],
        queryFn: () => getUserByIdApi(id),
        staleTime: 30000,
        retry: 2,
        enabled: !!id, // Ne lance la requête que si l'ID est fourni
    });
}

/**
 * Hook pour créer un nouvel utilisateur
 */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation<AdminUser, ApiError, CreateUserData>({
        mutationFn: (userData) => createUserApi(userData),
        onSuccess: () => {
            // Invalider le cache des utilisateurs pour forcer un rechargement
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

/**
 * Hook pour mettre à jour un utilisateur existant
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation<AdminUser, ApiError, { id: string; userData: UpdateUserData }>({
        mutationFn: ({ id, userData }) => updateUserApi(id, userData),
        onSuccess: (_, variables) => {
            // Invalider le cache de l'utilisateur spécifique et de la liste
            queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            notify.success("user updated successfull")
           
            
        },
    });
}

/**
 * Hook pour supprimer un utilisateur
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => deleteUserApi(id),
        onSuccess: () => {
            // Invalider le cache des utilisateurs pour forcer un rechargement
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

/**
 * Hook pour supprimer plusieurs utilisateurs
 */
export function useBulkDeleteUsers() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string[]>({
        mutationFn: (ids) => bulkDeleteUsersApi(ids),
        onSuccess: () => {
            // Invalider le cache des utilisateurs pour forcer un rechargement
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

/**
 * Hook pour récupérer la liste des rôles disponibles
 */
export function useRoles() {
    return useQuery<UserRole[], ApiError>({
        queryKey: ['roles'],
        queryFn: getRolesApi,
        staleTime: 300000, // Les rôles changent rarement, cache de 5 minutes
        retry: 2,
    });
}

/**
 * Hook pour uploader une image de profil
 */
export function useUploadProfilePicture() {
    const queryClient = useQueryClient();

    return useMutation<string, ApiError, { file: File; userId: string }>({
        mutationFn: ({ file, userId }) => uploadProfilePictureApi(file, userId),
        onSuccess: (_, variables) => {
            // Invalider le cache de l'utilisateur spécifique et de la liste
            queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}


