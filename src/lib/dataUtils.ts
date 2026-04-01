// src/lib/dataUtils.ts

/**
 * Utilitaires pour la gestion et manipulation de données
 */

// ==================== TYPES ====================

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface SortParams<T> {
    key: keyof T;
    order: 'asc' | 'desc';
}

export interface FilterConfig<T> {
    key: keyof T;
    value: unknown;
    operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte';
}

// ==================== ARRAY MANIPULATION ====================

/**
 * Supprime les doublons d'un tableau basé sur une clé
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

/**
 * Groupe les éléments d'un tableau par une clé
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * Compte les occurrences de chaque valeur pour une clé donnée
 */
export function countBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        result[groupKey] = (result[groupKey] || 0) + 1;
        return result;
    }, {} as Record<string, number>);
}

/**
 * Crée un index/map à partir d'un tableau basé sur une clé
 */
export function indexBy<T>(array: T[], key: keyof T): Record<string, T> {
    return array.reduce((result, item) => {
        const indexKey = String(item[key]);
        result[indexKey] = item;
        return result;
    }, {} as Record<string, T>);
}

/**
 * Divise un tableau en chunks de taille donnée
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Mélange un tableau de manière aléatoire (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Récupère des éléments aléatoires d'un tableau
 */
export function sample<T>(array: T[], count: number = 1): T[] {
    const shuffled = shuffle(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

// ==================== FILTRAGE ET RECHERCHE ====================

/**
 * Filtre un tableau basé sur plusieurs critères
 */
export function filterBy<T>(array: T[], filters: FilterConfig<T>[]): T[] {
    return array.filter(item => {
        return filters.every(filter => {
            const value = item[filter.key];
            const filterValue = filter.value;
            const operator = filter.operator || 'equals';

            switch (operator) {
                case 'equals':
                    return value === filterValue;
                case 'contains':
                    return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
                case 'startsWith':
                    return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
                case 'endsWith':
                    return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
                case 'gt':
                    return Number(value) > Number(filterValue);
                case 'gte':
                    return Number(value) >= Number(filterValue);
                case 'lt':
                    return Number(value) < Number(filterValue);
                case 'lte':
                    return Number(value) <= Number(filterValue);
                default:
                    return true;
            }
        });
    });
}

/**
 * Recherche dans plusieurs champs d'un tableau
 */
export function search<T>(
    array: T[],
    query: string,
    searchKeys: (keyof T)[]
): T[] {
    if (!query.trim()) return array;

    const lowerQuery = query.toLowerCase();
    return array.filter(item =>
        searchKeys.some(key => {
            const value = item[key];
            return String(value).toLowerCase().includes(lowerQuery);
        })
    );
}

/**
 * Filtre les éléments qui correspondent à tous les critères
 */
export function findMatches<T>(
    array: T[],
    criteria: Partial<T>
): T[] {
    return array.filter(item =>
        Object.entries(criteria).every(([key, value]) =>
            item[key as keyof T] === value
        )
    );
}

// ==================== TRI ====================

/**
 * Trie un tableau par une ou plusieurs clés
 */
export function sortBy<T>(
    array: T[],
    sorts: SortParams<T>[]
): T[] {
    return [...array].sort((a, b) => {
        for (const sort of sorts) {
            const aVal = a[sort.key];
            const bVal = b[sort.key];

            let comparison = 0;
            if (aVal < bVal) comparison = -1;
            if (aVal > bVal) comparison = 1;

            if (comparison !== 0) {
                return sort.order === 'asc' ? comparison : -comparison;
            }
        }
        return 0;
    });
}

// ==================== PAGINATION ====================

/**
 * Pagine un tableau de données
 */
export function paginate<T>(
    array: T[],
    params: PaginationParams
): PaginatedResult<T> {
    const { page, pageSize } = params;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        data: array.slice(start, end),
        total: array.length,
        page,
        pageSize,
        totalPages: Math.ceil(array.length / pageSize)
    };
}

// ==================== TRANSFORMATION ====================

/**
 * Extrait les valeurs d'une clé spécifique
 */
export function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
    return array.map(item => item[key]);
}

/**
 * Transforme un tableau en utilisant une fonction de mapping
 */
export function mapValues<T, R>(
    array: T[],
    mapper: (item: T, index: number) => R
): R[] {
    return array.map(mapper);
}

/**
 * Fusionne deux tableaux d'objets basés sur une clé commune
 */
export function mergeArrays<T, U>(
    arr1: T[],
    arr2: U[],
    key1: keyof T,
    key2: keyof U
): (T & Partial<U>)[] {
    const map2 = indexBy(arr2, key2);
    return arr1.map(item => ({
        ...item,
        ...map2[String(item[key1])]
    }));
}

/**
 * Normalise un tableau d'objets en structure id -> objet
 */
export function normalize<T extends { id: string | number }>(
    array: T[]
): { byId: Record<string, T>; allIds: (string | number)[] } {
    return {
        byId: indexBy(array, 'id'),
        allIds: array.map(item => item.id)
    };
}

/**
 * Dénormalise une structure normalisée en tableau
 */
export function denormalize<T>(
    byId: Record<string, T>,
    allIds: (string | number)[]
): T[] {
    return allIds.map(id => byId[String(id)]).filter(Boolean);
}

// ==================== AGRÉGATION ====================

/**
 * Calcule la somme d'une propriété numérique
 */
export function sum<T>(array: T[], key: keyof T): number {
    return array.reduce((total, item) => {
        const value = item[key];
        return total + (typeof value === 'number' ? value : 0);
    }, 0);
}

/**
 * Calcule la moyenne d'une propriété numérique
 */
export function average<T>(array: T[], key: keyof T): number {
    if (array.length === 0) return 0;
    return sum(array, key) / array.length;
}

/**
 * Trouve la valeur minimale d'une propriété
 */
export function min<T>(array: T[], key: keyof T): T[typeof key] | undefined {
    if (array.length === 0) return undefined;
    return array.reduce((minimum, item) =>
        item[key] < minimum ? item[key] : minimum,
        array[0][key]
    );
}

/**
 * Trouve la valeur maximale d'une propriété
 */
export function max<T>(array: T[], key: keyof T): T[typeof key] | undefined {
    if (array.length === 0) return undefined;
    return array.reduce((maximum, item) =>
        item[key] > maximum ? item[key] : maximum,
        array[0][key]
    );
}

/**
 * Calcule des statistiques de base pour une propriété numérique
 */
export function stats<T>(array: T[], key: keyof T) {
    return {
        count: array.length,
        sum: sum(array, key),
        average: average(array, key),
        min: min(array, key),
        max: max(array, key)
    };
}

// ==================== VALIDATION ====================

/**
 * Vérifie si un tableau est vide
 */
export function isEmpty<T>(array: T[] | null | undefined): boolean {
    return !array || array.length === 0;
}

/**
 * Vérifie si tous les éléments satisfont une condition
 */
export function every<T>(array: T[], predicate: (item: T) => boolean): boolean {
    return array.every(predicate);
}

/**
 * Vérifie si au moins un élément satisfait une condition
 */
export function some<T>(array: T[], predicate: (item: T) => boolean): boolean {
    return array.some(predicate);
}

/**
 * Compte les éléments qui satisfont une condition
 */
export function countIf<T>(array: T[], predicate: (item: T) => boolean): number {
    return array.filter(predicate).length;
}

// ==================== OBJECT MANIPULATION ====================

/**
 * Supprime les propriétés undefined/null d'un objet
 */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((result, [key, value]) => {
        if (value !== null && value !== undefined) {
            result[key as keyof T] = value as T[keyof T];
        }
        return result;
    }, {} as Partial<T>);
}

/**
 * Sélectionne seulement certaines clés d'un objet
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {} as Pick<T, K>);
}

/**
 * Exclut certaines clés d'un objet
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}

/**
 * Deep clone d'un objet
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Vérifie l'égalité profonde entre deux objets
 */
export function deepEqual(obj1: unknown, obj2: unknown): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Fusionne plusieurs objets en profondeur
 */
export function deepMerge<T extends Record<string, unknown>>(
    target: T,
    ...sources: Partial<T>[]
): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (source) {
        for (const key in source) {
            const sourceValue = source[key];
            const targetValue = target[key];

            if (
                sourceValue &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                targetValue &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue)
            ) {
                target[key] = deepMerge(
                    targetValue as Record<string, unknown>,
                    sourceValue as Record<string, unknown>
                ) as T[Extract<keyof T, string>];
            } else if (sourceValue !== undefined) {
                target[key] = sourceValue as T[Extract<keyof T, string>];
            }
        }
    }

    return deepMerge(target, ...sources);
}

// ==================== FORMATAGE ====================

/**
 * Formate un nombre en notation avec séparateurs de milliers
 */
export function formatNumber(num: number, decimals: number = 0): string {
    return num.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Formate une taille de fichier en unités lisibles
 */
export function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Tronque une chaîne avec ellipse
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
}

// ==================== DEBOUNCE & THROTTLE ====================

/**
 * Debounce une fonction
 */
export function debounce<T extends (...args: never[]) => void>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle une fonction
 */
export function throttle<T extends (...args: never[]) => void>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ==================== UTILS SPÉCIFIQUES AU PROJET ====================

/**
 * Calcule le GPA moyen d'un groupe d'étudiants
 */
export function calculateAverageGPA<T extends { gpa: number }>(students: T[]): number {
    return average(students, 'gpa');
}

/**
 * Filtre les résultats par statut
 */
export function filterResultsByStatus<T extends { status: string }>(
    results: T[],
    status: string
): T[] {
    return results.filter(r => r.status === status);
}

/**
 * Groupe les cours par semestre
 */
export function groupCoursesBySemester<T extends { semester: string }>(courses: T[]) {
    return groupBy(courses, 'semester');
}

/**
 * Calcule le taux de réussite
 */
export function calculateSuccessRate<T extends { status: string }>(results: T[]): number {
    if (results.length === 0) return 0;
    const passed = countIf(results, r => r.status === 'passed');
    return (passed / results.length) * 100;
}
