// src/types/user.d.ts

import type { BaseEntity } from "./common";
import type { Colline } from "./entities";

/**
 * Rôles utilisateur
 */
export type UserRole = {
    id: string;
    name: "admin" | "teacher" | "student" | "guest" | "staff" | "student_service" | "dean" | "finance_service" | "super_admin" |"director_academic";
    description: string;
};

export type UserGender = 'M' | 'F' | 'O';
export type UserMaritalStatus = "M" | "S" | "D" | "W" | null;

/**
 * Interface de l'utilisateur global
 */
export interface User extends BaseEntity {
    gender: UserGender;         // si tu veux gérer plusieurs genres
    email: string;
    phone_number: string | null;
    birth_date: string | null;
    nationality: string | null;
    first_name: string;
    last_name: string;
    residence: Colline[];                    // ou un tableau d’objets si besoin plus tard
    marital_status: UserMaritalStatus;

    role: UserRole;

    email_verified: boolean;

    requires_2fa: boolean;
    requires_2fa_qr: boolean;
    requires_2fa_email: boolean;
    requires_2fa_static: boolean;

    totp_secret_key: string | null;

    profile_picture: string | null;
    nationality_name?:string
    spoken_languages: string[];
    username?: string;
    department?: string;
    last_login:string;
}

