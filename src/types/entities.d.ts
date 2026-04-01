// src/types/entities.d.ts

/**
 * Département académique
 */
export interface Department {
    id: number;
    name: string;
    code: string;
}

/**
 * Programme d'études
 */
export interface Program {
    id: number;
    name: string;
    year: string;
    departmentId: number;
}

/**
 * Année académique
 */
export interface AcademicYear {
    id: number;
    label: string; // ex: "2024-2025"
    isActive: boolean;
}

/**
 * Types géographiques (nested structure)
 */
export interface Colline {
    id: string;
    colline_name: string;
}

export interface Zone {
    id: string;
    zone_name: string;
    collines?: Colline[];
}

export interface Commune {
    id: string;
    commune_name: string;
    zones?: Zone[];
}

export interface Province {
    id: string;
    province_name: string;
    communes?: Commune[];
}

export interface Country {
    id: string;
    country_name: string;
    provinces?: Province[];
}
