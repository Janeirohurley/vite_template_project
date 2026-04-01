// Types pour le module d'authentification
// Note: Les types User et UserRole sont importés depuis @/types pour la cohérence globale

import type { BaseEntity } from "@/types";

export interface LoginCredentials {
    email: string
    password: string
}

/**
 * Enum pour le genre
 */
export type GenderEnum = 'M' | 'F' | 'O';

/**
 * Enum pour l'état civil
 */
export type MaritalStatusEnum = 'S' | 'M' | 'D' | 'W';

export interface RegisterData {
    // Informations de base
    first_name: string
    last_name: string
    email: string
    password: string
    confirmPassword: string

    // Informations personnelles supplémentaires
    gender?: GenderEnum | null
    phone_number?: string | null
    birth_date?: string | null // Format: YYYY-MM-DD
    nationality?: string | null // UUID
    residence?: string[] | null // Array of UUIDs
    marital_status?: MaritalStatusEnum | null
    profile_picture?: string | null // URI
    spoken_languages?: string[] | null // Array of language codes or names
}

export interface AuthResponse extends BaseEntity {
    user: import("@/types").User
    access: string
    refresh: string
}

export interface AuthError {
    message: string
    field?: string
    code?: string
}

/**
 * Options pour les champs de sélection
 */
export interface SelectOption {
    id:string
    value: string
    label: string
}

/**
 * Données de nationalité (à remplir depuis l'API)
 */
export interface Nationality {
    id: string
    name: string
    code: string
}

/**
 * Données de résidence (à remplir depuis l'API)
 */
export interface Residence {
    id: string
    name: string
    type: string
}
