/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import type { ScheduleSlot, Timetable } from "../../types/backend";
import getStatusInfo from "./getStatusInfo";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Grid, X, AlertTriangle, BookOpen, Merge } from "lucide-react";
import TimetableGrid from "./TimetableGrid";
import SlotDetailModal from "./SlotDetailModal";
import CollapsibleComponent from "@/components/ui/CollapsibleComponent";

// Type pour les slot_details tracés (comme dans ta fonction de merge)
interface TracedScheduleSlot {
    origin: string;
    detail: ScheduleSlot;
}

// Type étendu pour un Timetable mergé (champs peuvent être en conflit → objet)
interface MergedTimetable extends Omit<Timetable, 'slot_details'> {
    slot_details?: TracedScheduleSlot[];
    // Tous les champs peuvent être en conflit (object { [id]: value })
    [key: string]: any;
}

// Type du résultat de mergeTimetablesWithConflictCheck
interface MergeResult {
    merged: MergedTimetable;
    conflicts?: Array<{
        field: keyof Timetable;
        valuesBySource: Record<string, any>;
    }>;
}

interface TimetableMergedDetailViewProps {
    mergedData: MergeResult | null | undefined;
    onClose: () => void;
    isOpen: boolean;
}

export default function TimetableMergedDetailView({
    mergedData,
    onClose,
    isOpen,
}: TimetableMergedDetailViewProps) {
    const [selectedSlot, setSelectedSlot] = useState<any | null>(null);

    // Gérer la touche Escape pour fermer
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    console.log('TimetableMergedDetailView:', { isOpen, mergedData, hasMerged: !!mergedData?.merged });

    if (!isOpen || !mergedData?.merged) return null;

    const timetable = mergedData.merged;
    const conflicts = mergedData.conflicts || [];

    const statusInfo = getStatusInfo(
        typeof timetable.status === "object" ? String(Object.values(timetable.status)[0] || '') : String(timetable.status || ''),
        timetable.published_date
    );

    // Gestion sécurisée des slot_details tracés
    const tracedSlots: TracedScheduleSlot[] = Array.isArray(timetable.slot_details)
        ? timetable.slot_details
        : [];

    const effectiveSlotDetails = tracedSlots.map(ts => ts.detail);

    const timetableSlots = effectiveSlotDetails
        .filter(slot => timetable.slots?.includes(slot.id))
        .map(slot => {
            const origin = tracedSlots.find(ts => ts.detail.id === slot.id)?.origin;

            // Extraire les valeurs spécifiques à ce slot basé sur son origin
            const getValueForOrigin = (field: any) => {
                if (!field) return field;
                if (typeof field === 'object' && !Array.isArray(field) && origin && field[origin]) {
                    return field[origin];
                }
                return field;
            };

            return {
                ...slot,
                origin,
                // Créer un timetableInfo avec les valeurs spécifiques à ce slot
                timetableInfo: {
                    ...timetable,
                    slot_details: effectiveSlotDetails, // Utiliser les slots normaux au lieu des TracedScheduleSlot
                    course_name: getValueForOrigin(timetable.course_name),
                    teacher_name: getValueForOrigin(timetable.teacher_name),
                    room: getValueForOrigin(timetable.room),
                    room_name: getValueForOrigin(timetable.room_name),
                    attribution: getValueForOrigin(timetable.attribution),
                }
            };
        });
    console.log(timetableSlots)

    // Fonction CRITIQUE : empêche l'erreur React en gérant les objets conflits
    const safeRender = (value: any, fieldName?: string): React.ReactNode => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400 dark:text-gray-500 ">Non renseigné</span>;
        }

        // Date JS
        if (value instanceof Date) {
            return (
                <span className="text-gray-900 dark:text-gray-100">
                    {value.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </span>
            );
        }

        // ISO date string
        if (typeof value === "string" && !isNaN(Date.parse(value))) {
            return (
                <span className="text-gray-900 dark:text-gray-100">
                    {new Date(value).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </span>
            );
        }

        // Tableau
        if (Array.isArray(value)) {
            return (
                <ul className="list-disc pl-5 space-y-1">
                    {value.map((v, i) => (
                        <li key={i} className="text-gray-900 dark:text-gray-100">
                            {safeRender(v)}
                        </li>
                    ))}
                </ul>
            );
        }

        // Objet conflit { sourceId: value }
        if (typeof value === "object") {
            return (
                <div className="space-y-2 py-1">
                    {Object.entries(value).map(([sourceId, val]) => (
                        <div key={sourceId} className="flex items-center gap-2 text-sm">
                            <AlertTriangle size={16} className="text-amber-500 dark:text-amber-400 shrink-0" />
                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                {sourceId.substring(0, 8)}:
                            </span>
                            <span className="text-gray-900 dark:text-gray-100">
                                {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </span>
                        </div>
                    ))}
                    {fieldName && (
                        <p className="text-xs text-amber-600 dark:text-amber-400  mt-2">
                            Conflit sur "{fieldName}"
                        </p>
                    )}
                </div>
            );
        }

        // Valeur simple (number, boolean, string)
        return <span className="text-gray-900 dark:text-gray-100">{String(value)}</span>;
    };


    const hasConflicts = conflicts.length > 0;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                <div
                    className="relative w-full h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    <Card className={`border ${statusInfo.borderColor} w-full h-full overflow-hidden flex flex-col`}>
                        <CardHeader className={`${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                            <div className="flex items-center justify-between p-1 sm:p-2">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className={statusInfo.color}>{statusInfo.icon}</div>
                                    <CardTitle className="text-sm sm:text-md truncate">
                                        {statusInfo.label}
                                        {hasConflicts && <span className="ml-2 text-amber-600"> (conflits)</span>}
                                    </CardTitle>
                                </div>
                                {statusInfo.badge}
                                
                            </div>
                            <button
                                    onClick={onClose}
                                    className="p-1.5 sm:p-2 absolute -top-2 -right-2 cursor-pointer hover:bg-gray-100 bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 rounded-lg transition-colors shrink-0"
                                    aria-label="Fermer"
                                >
                                    <X size={18} className="text-gray-500 dark:text-gray-400" />
                                </button>
                        </CardHeader>

                        <CardContent className="pt-3 sm:pt-4 px-2 sm:px-4 overflow-y-auto flex-1">
                            <div className="space-y-4 sm:space-y-6">

                                {/* Informations générales en grid */}
                                <CollapsibleComponent title="Generale" className="">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 p-2 gap-3 sm:gap-6">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Informations générales</h3>
                                            <dl className="space-y-2 sm:space-y-3">
                                                <div>
                                                    <dt className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Groupe</dt>
                                                    <dd className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{safeRender(timetable.class_group_name || timetable.class_group)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Classe</dt>
                                                    <dd className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{safeRender(timetable.class_name)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Statut</dt>
                                                    <dd className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{safeRender(timetable.status)}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div>
                                            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Période</h3>
                                            <dl className="space-y-2 sm:space-y-3">
                                                <div>
                                                    <dt className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Dates</dt>
                                                    <dd className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                                                        du {safeRender(timetable.start_date)} au {safeRender(timetable.end_date)}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Créé par</dt>
                                                    <dd className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{safeRender(timetable.created_by_name || timetable.created_by)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Créé le</dt>
                                                    <dd className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{safeRender(timetable.created_date)}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                    </CollapsibleComponent>

                                    {/* Cours fusionnés */}
                                    {conflicts.length > 0 && (
                                        <CollapsibleComponent title="Cours" className="">
                                            <div className="p-2">
                                                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-gray-900 dark:text-white">
                                                    <Merge size={14} className="text-purple-600 dark:text-purple-400 sm:w-4 sm:h-4" />
                                                    <span className="text-xs sm:text-sm">Cours fusionnés</span>
                                                </h3>
                                                <div className="">
                                                    <p className="text-[10px] sm:text-xs text-purple-900 dark:text-purple-200 mb-2 sm:mb-3">
                                                        {Object.keys(typeof timetable.course_name === 'object' ? timetable.course_name : {}).length} emplois du temps
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                                                        {conflicts
                                                            .filter(c => c.field === 'course_name' || c.field === 'teacher_name')
                                                            .map((conflict) => {
                                                                const entries = Object.entries(conflict.valuesBySource);
                                                                return entries.map(([sourceId]) => {
                                                                    const courseName = typeof timetable.course_name === 'object'
                                                                        ? timetable.course_name[sourceId]
                                                                        : timetable.course_name;
                                                                    const teacherName = typeof timetable.teacher_name === 'object'
                                                                        ? timetable.teacher_name[sourceId]
                                                                        : timetable.teacher_name;
                                                                    const roomName = typeof timetable.room_name === 'object'
                                                                        ? timetable.room_name[sourceId]
                                                                        : timetable.room_name;

                                                                    return (
                                                                        <div key={sourceId} className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 border border-purple-200 dark:border-purple-700 hover:shadow-md transition">
                                                                            <div className="flex items-start gap-1.5 sm:gap-2">
                                                                                <BookOpen size={14} className="text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate leading-tight">{courseName}</p>
                                                                                    <div className="mt-1 sm:mt-1.5 space-y-0.5">
                                                                                        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate leading-tight">
                                                                                            <span className="font-medium">Prof:</span> {teacherName}
                                                                                        </p>
                                                                                        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate leading-tight">
                                                                                            <span className="font-medium">Salle:</span> {roomName}
                                                                                        </p>
                                                                                    </div>
                                                                                    <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-500 mt-1 font-mono truncate">
                                                                                        {sourceId.substring(0, 8)}...
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                });
                                                            })
                                                            .flat()
                                                            .filter((item, index, self) =>
                                                                index === self.findIndex((t) => t.key === item.key)
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </CollapsibleComponent>

                                    )}

                                    {/* Grille des horaires */}
                                    {timetableSlots.length > 0 && (
                                        <div>
                                            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-gray-900 dark:text-white">
                                                <Grid size={14} className="sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm">Horaires ({timetableSlots.length})</span>
                                            </h3>
                                            <div className="overflow-x-auto -mx-3 sm:mx-0">
                                                <TimetableGrid slots={timetableSlots} onSlotClick={setSelectedSlot} />
                                            </div>
                                        </div>
                                    )}



                                    {/* État */}
                                    <div className={`border-t ${statusInfo.borderColor} pt-4 sm:pt-6`}>
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <div className={statusInfo.color}>
                                                <AlertCircle size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                                                    État de l'emploi du temps
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {timetable.published_date
                                                        ? "Publié et visible par tous."
                                                        : "En brouillon – non visible publiquement."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </CardContent>
                    </Card>

                    <SlotDetailModal
                        slot={selectedSlot}
                        isOpen={!!selectedSlot}
                        onClose={() => setSelectedSlot(null)}
                    />
                </div>
            </div>
        </>
    );
}