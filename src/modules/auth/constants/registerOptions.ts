// Constantes et options pour le formulaire d'enregistrement

import type { SelectOption, GenderEnum, MaritalStatusEnum } from '../types';

/**
 * Options pour le champ Genre
 */
export const GENDER_OPTIONS: SelectOption[] = [
    { id: 'M', value: 'M', label: 'Homme' },
    { id: 'F', value: 'F', label: 'Femme' },
    { id: 'O', value: 'O', label: 'Autre' }
];

/**
 * Options pour le champ État civil
 */
export const MARITAL_STATUS_OPTIONS: SelectOption[] = [
    { id: 'S', value: 'S', label: 'Célibataire' },
    { id: 'M', value: 'M', label: 'Marié(e)' },
    { id: 'D', value: 'D', label: 'Divorcé(e)' },
    { id: 'W', value: 'W', label: 'Veuf/Veuve' }
];

/**
 * Langues parlées communes (peut être étendu ou récupéré depuis l'API)
 */
export const SPOKEN_LANGUAGES_OPTIONS: SelectOption[] = [
    { id: 'FR', value: 'FR', label: 'Français' },
    { id: 'EN', value: 'EN', label: 'Anglais' },
    { id: 'KI', value: 'KI', label: 'Kirundi' },
    { id: 'SW', value: 'SW', label: 'Swahili' },
    { id: 'ES', value: 'ES', label: 'Espagnol' },
    { id: 'AR', value: 'AR', label: 'Arabe' },
    { id: 'PT', value: 'PT', label: 'Portugais' },
    { id: 'DE', value: 'DE', label: 'Allemand' },
    { id: 'IT', value: 'IT', label: 'Italien' },
    { id: 'ZH', value: 'ZH', label: 'Chinois' },
];

/**
 * Mapping des valeurs de genre vers leur label
 */
export const GENDER_LABELS: Record<GenderEnum, string> = {
    M: 'Homme',
    F: 'Femme',
    O: 'Autre'
};

/**
 * Mapping des valeurs d'état civil vers leur label
 */
export const MARITAL_STATUS_LABELS: Record<MaritalStatusEnum, string> = {
    S: 'Célibataire',
    M: 'Marié(e)',
    D: 'Divorcé(e)',
    W: 'Veuf/Veuve'
};

/**
 * Validation: Âge minimum pour l'inscription (18 ans)
 */
export const MIN_AGE = 18;

/**
 * Validation: Âge maximum pour l'inscription (100 ans)
 */
export const MAX_AGE = 100;

/**
 * Validation: Format du numéro de téléphone (regex)
 */
export const PHONE_REGEX = /^(\+?257|0)?[67]\d{7}$/;

/**
 * Validation: Longueur maximale du numéro de téléphone
 */
export const PHONE_MAX_LENGTH = 20;

/**
 * Validation: Longueur maximale de l'email
 */
export const EMAIL_MAX_LENGTH = 254;

/**
 * Helper: Calculer l'âge depuis la date de naissance
 */
export function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
 * Helper: Valider une date de naissance
 */
export function validateBirthDate(birthDate: string): {
    valid: boolean;
    error?: string;
} {
    if (!birthDate) {
        return { valid: true }; // Optionnel
    }

    const age = calculateAge(birthDate);

    if (age < MIN_AGE) {
        return {
            valid: false,
            error: `Vous devez avoir au moins ${MIN_AGE} ans pour vous inscrire.`
        };
    }

    if (age > MAX_AGE) {
        return {
            valid: false,
            error: 'La date de naissance semble incorrecte.'
        };
    }

    return { valid: true };
}

/**
 * Helper: Valider un numéro de téléphone
 */
export function validatePhoneNumber(phone: string): {
    valid: boolean;
    error?: string;
} {
    if (!phone) {
        return { valid: true }; // Optionnel
    }

    if (phone.length > PHONE_MAX_LENGTH) {
        return {
            valid: false,
            error: `Le numéro de téléphone ne doit pas dépasser ${PHONE_MAX_LENGTH} caractères.`
        };
    }

    if (!PHONE_REGEX.test(phone)) {
        return {
            valid: false,
            error: 'Le format du numéro de téléphone est invalide. Ex: +25761234567 ou 061234567'
        };
    }

    return { valid: true };
}

/**
 * Helper: Valider un email
 */
export function validateEmail(email: string): {
    valid: boolean;
    error?: string;
} {
    if (!email) {
        return {
            valid: false,
            error: 'L\'email est requis.'
        };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
        return {
            valid: false,
            error: `L'email ne doit pas dépasser ${EMAIL_MAX_LENGTH} caractères.`
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            valid: false,
            error: 'Le format de l\'email est invalide.'
        };
    }

    return { valid: true };
}
