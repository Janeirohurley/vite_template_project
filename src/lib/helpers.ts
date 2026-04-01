// src/lib/helpers.ts
export const formatDate = (date?: string | Date) =>
    date ? new Date(date).toLocaleDateString() : "-";

export const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

export const isEmpty = (val: never) =>
    val === null || val === undefined || val === "";

export function englishDayToFrench(day: string): string {
    const daysMap: Record<string, string> = {
        monday: 'lundi',
        tuesday: 'mardi',
        wednesday: 'mercredi',
        thursday: 'jeudi',
        friday: 'vendredi',
        saturday: 'samedi',
        sunday: 'dimanche',
    };

    return daysMap[day.toLowerCase()] ?? 'jour inconnu';
}

