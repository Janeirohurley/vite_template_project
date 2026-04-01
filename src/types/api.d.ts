/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/api.d.ts

/**
 * Structure standard pour les réponses de succès Django (success_response)
 */
export interface DjangoSuccessResponse<T = unknown> {
    status: "success";
    message: string;
    data: T;
    [key: string]: unknown; // Pour les champs extra optionnels
}


export interface DjangoGetListResponse<T> extends DjangoSuccessResponse<T[]> {
    pagination?: {
        count: number;
        page_size: number;
        current_page: number;
        total_pages: number;
        next: string | null;
        previous: string | null;
    };
}


/**
 * Structure standard pour les réponses d'erreur Django (error_response)
 */
export interface DjangoErrorResponse {
    status: "error";
    message: string;
    errors?: Record<string, string[]> | string[] | null;
}

/**
 * Type générique pour toutes les réponses API
 */
export type ApiResponse<T> = DjangoSuccessResponse<T> | DjangoErrorResponse;

/**
 * Structure pour les erreurs API formatées côté client
 */
export interface ApiError {
    message: string; // Message traduit en français
    originalMessage?: string; // Message original du backend
    errorCode?: string; // Code d'erreur (ex: "EmailAlreadyExists")
    statusCode?: number;
    errors?: Record<string, string[]>;
    field?: string;
    extra?: any; // Données additionnelles liées à l'erreur
}

/**
 * Pagination standard pour les réponses paginées
 */
export interface PaginationMeta {
    total: number;
    page: number;
    perPage: number;
}



/**
 * Response pour les listes paginées
 */
export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number
    total_pages:number
}

/**
 * Paramètres de requête communs
 */
export interface QueryParams {
    page?: number;
    page_size?: number;
    search?: string;
    [key: string]: any;
}
