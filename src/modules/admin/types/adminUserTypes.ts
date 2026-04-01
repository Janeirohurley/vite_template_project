/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from '@/types/user';

/**
 * Interface étendue pour la gestion admin des utilisateurs
 * Ajoute des champs spécifiques à l'admin qui ne sont pas dans l'interface User de base
 */
export interface AdminUser extends User {
    is_active: boolean;
    profile: Array<{
        id: string,
        position: string,
        start_date: string,
        end_date: string
    }>;
}

/**
 * Données pour créer un utilisateur (formulaire admin)
 */
export interface CreateUserData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    birth_date?: string;
    nationality?: string;
    gender: 'M' | 'F' | 'O';
    marital_status: 'M' | 'S' | 'D' | 'W';
    residence?: string[];
    spoken_languages?: string[];
    department?: string;
    role_id: string;
    is_active?: boolean;
}

/**
 * Données pour mettre à jour un utilisateur (formulaire admin)
 */
export interface UpdateUserData extends Partial<CreateUserData> {
    is_active?: boolean;
    email_verified?: boolean;
    requires_2fa?: boolean;
    requires_2fa_qr?: boolean;
    requires_2fa_email?: boolean;
    requires_2fa_static?: boolean;
    status?: 'Active' | 'Inactive' | 'Pending';
}
