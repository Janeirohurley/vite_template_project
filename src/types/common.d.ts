// src/types/common.d.ts

import type { LucideIcon } from "lucide-react";
import type { Country } from "./entities";

/**
 * Type générique pour les IDs
 */
export type ID = string ;

/**
 * Option pour les sélecteurs
 */
export interface SelectOption {
    label: string;
    value: string | number;
}

/**
 * Entité de base pour tout module
 */
export interface BaseEntity {
    id: ID;
    created_at:string;
    updated_at?:string;
    
}

/**
 * Données paginées génériques
 */
export interface PaginatedData<T> {
    items: T[];
    total: number;
    page: number;
    perPage: number;
}

/**
 * Item de navigation pour les menus
 */
export interface NavItem {
    label: string;
    to?: string;
    icon: LucideIcon;
    children?: NavItem[];
}

export interface Universite {
    id: string
    university_name: string,
    university_abrev: string,
    country: Country
}