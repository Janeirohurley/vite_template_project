/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScheduleSlot, Timetable } from "../../types/backend";

export interface MergeConflictError extends Error {
    type: 'SLOT_CONFLICT';
    conflictingSlotIds: string[];
}

function createSlotConflictError(conflictingSlots: string[]): MergeConflictError {
    const error = new Error(
        `Conflit détecté : les slots suivants apparaissent en doublon dans les données fusionnées : ${conflictingSlots.join(', ')}. ` +
        `Cela peut indiquer un double booking ou une erreur dans les données sources.`
    ) as MergeConflictError;
    error.type = 'SLOT_CONFLICT';
    error.conflictingSlotIds = conflictingSlots;
    return error;
}

export interface MergeResult {
    merged: Timetable;
    conflicts?: Array<{
        field: keyof Timetable;
        valuesBySource: Record<string, any>; // timetable.id → valeur
    }>;
}

// Nouveau type pour slot_details avec traçabilité
export interface TracedScheduleSlot {
    origin: string;           // id du Timetable source
    detail: ScheduleSlot;
}

export default function mergeTimetablesWithConflictCheck(
    ...timetables: Partial<Timetable>[]
): MergeResult {
    if (timetables.length === 0) {
        throw new Error("Au moins un Timetable doit être fourni pour le merge");
    }

    const result: any = {};
    const conflicts: MergeResult['conflicts'] = [];

    // Pour détecter les conflits sur slots
    const slotCounts = new Map<string, number>();

    // Pour traçabilité : field → Map<timetable.id, value>
    const fieldValues = new Map<keyof Timetable, Map<string, any>>();

    const keys: (keyof Timetable)[] = [
        'id', 'class_group', 'class_group_name', 'class_name', 'attribution',
        'course_name', 'teacher_name', 'room', 'room_name',
        'start_date', 'end_date', 'status',
        'created_by', 'created_by_name', 'created_date', 'published_date'
    ];

    // Initialisation
    keys.forEach(key => fieldValues.set(key, new Map()));
    result.slots = [];
    result.slot_details = []; // Va contenir des TracedScheduleSlot[]

    // Phase 1 : collecte des données
    for (const tt of timetables) {
        if (!tt.id) {
            throw new Error("Chaque Timetable fourni doit avoir un 'id' pour permettre la traçabilité");
        }

        const sourceId = tt.id; // ← on utilise l'id du timetable comme source

        // Slots : comptage pour conflit + cumul
        if (tt.slots) {
            for (const slotId of tt.slots) {
                slotCounts.set(slotId, (slotCounts.get(slotId) || 0) + 1);
            }
            result.slots = Array.from(new Set([...result.slots, ...tt.slots]));
        }

        // Slot details : cumul avec traçabilité + déduplication par id
        if (tt.slot_details) {
            for (const detail of tt.slot_details) {
                const traced: TracedScheduleSlot = {
                    origin: sourceId,
                    detail
                };

                // Vérifier si on a déjà ce slot (par son id si présent)
                const existingIndex = result.slot_details.findIndex((item: TracedScheduleSlot) =>
                    item.detail.id && detail.id && item.detail.id === detail.id
                );

                if (existingIndex === -1) {
                    // Pas encore présent → on ajoute
                    result.slot_details.push(traced);
                }
                // Sinon : on ignore (déduplication), mais l'origine du premier reste conservée
                // Tu peux changer cette logique si tu veux garder toutes les origines même en doublon
            }
        }

        // Autres champs : stockage avec traçabilité
        for (const key of keys) {
            const value = (tt as any)[key];
            if (value !== undefined && value !== null) {
                fieldValues.get(key)!.set(sourceId, value);
            }
        }
    }

    // Détection conflit slots
    const conflictingSlots = Array.from(slotCounts.entries())
        .filter(([, count]) => count > 1)
        .map(([slotId]) => slotId);

    if (conflictingSlots.length > 0) {
        throw createSlotConflictError(conflictingSlots);
    }

    result.slots.sort(); // pour lisibilité

    // Phase 2 : merge avec gestion des divergences
    for (const key of keys) {
        const valuesMap = fieldValues.get(key)!;
        if (valuesMap.size === 0) continue;

        const uniqueValues = Array.from(new Set(valuesMap.values()));

        if (uniqueValues.length === 1) {
            result[key] = uniqueValues[0];
        } else {
            const valuesBySource = Object.fromEntries(valuesMap);
            result[key] = valuesBySource;
            conflicts.push({
                field: key,
                valuesBySource
            });
        }
    }

    // Application des règles prioritaires même en cas de conflit
    if (typeof result.status === 'object') {
        const priority: Record<Timetable['status'], number> = {
            'Cancelled': 3,
            'Completed': 2,
            'Planned': 1,
        };
        const entries = Object.entries(result.status as Record<string, Timetable['status']>);
        const best = entries.reduce((a, b) =>
            priority[b[1]] > priority[a[1]] ? b : a
        );
        result.status = best[1];
    }

    if (typeof result.start_date === 'object') {
        const dates = Object.values(result.start_date as Record<string, string>);
        result.start_date = dates.reduce((a, b) => new Date(a) < new Date(b) ? a : b);
    }

    if (typeof result.end_date === 'object') {
        const dates = Object.values(result.end_date as Record<string, string>);
        result.end_date = dates.reduce((a, b) => new Date(a) > new Date(b) ? a : b);
    }

    if (typeof result.created_date === 'object') {
        const dates = Object.values(result.created_date as Record<string, string>);
        result.created_date = dates.reduce((a, b) => new Date(a) > new Date(b) ? a : b);
    }

    if (typeof result.published_date === 'object') {
        const dates = Object.values(result.published_date as Record<string, string>).filter(Boolean);
        if (dates.length > 0) {
            result.published_date = dates.reduce((a, b) => new Date(a) > new Date(b) ? a : b);
        }
    }

    // L'id doit exister (et est unique normalement)
    if (!result.id || typeof result.id === 'object') {
        const allIds = timetables.map(t => t.id).filter(Boolean);
        result.id = allIds[0];
    }

    // Typage final : on expose slot_details avec origine
    const mergedResult = result as Timetable & { slot_details: TracedScheduleSlot[] };

    return {
        merged: mergedResult,
        conflicts: conflicts.length > 0 ? conflicts : undefined
    };
}