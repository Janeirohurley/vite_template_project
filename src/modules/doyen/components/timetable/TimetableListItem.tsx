/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, Calendar, CalendarArrowUp, CalendarCog, CalendarX2, Clock, Columns2, ContactRound, Scaling, School, Merge, Plus, X } from "lucide-react";
import type { Timetable } from "../../types/backend";
import type getStatusInfo from "./getStatusInfo";
import { Tooltip } from "@/components/ui/Tooltip";


interface TimetableListItemProps {
    timetable: Timetable;
    statusInfo: ReturnType<typeof getStatusInfo>;
    isSelected: boolean;
    isMultiSelected?: boolean;
    isMerged?: boolean;
    mergeNames?: string[];
    merges?: any[];
    isShared?: boolean;
    sharedGroups?: Array<{
        id: string;
        group_name: string;
        class_name: string;
        department_abreviation: string;
    }>;
    onSelect: (ctrlKey: boolean) => void;
    onEdit: () => void
    onPublish: (id: string) => void;
    onDelete: (id: string) => void;
    onAddToMerge?: (timetableId: string, mergeId: string) => void;
    onRemoveFromMerge?: (timetableId: string, mergeId: string) => void;
    onViewMerge?: (mergeId: string) => void;
    onShare?: (timetableId: string) => void;
    onUnshare?: (timetableId: string, groupId: string) => void;
    isPublishing: boolean;
    isDeleting: boolean;
}
export default function TimetableListItem({
    timetable,
    statusInfo,
    isSelected,
    isMultiSelected = false,
    isMerged = false,
    mergeNames = [],
    merges = [],
    isShared = false,
    sharedGroups = [],
    onSelect,
    onPublish,
    onDelete,
    onAddToMerge,
    onRemoveFromMerge,
    onShare,
    onUnshare,
    isPublishing,
    isDeleting,
    onEdit,
    onViewMerge
}: TimetableListItemProps) {
    return (
        <div
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition border rounded-md relative ${isMultiSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-0.5 ring-blue-500'
                    : isSelected
                        ? `${statusInfo.bgColor} border-gray-200 dark:border-blue-900`
                        : 'border-gray-200 dark:border-blue-900'
                }`}
            onClick={(e) => onSelect(e.ctrlKey || e.metaKey)}
        >
            <div className="space-y-3">
                {/* Indicateur de sélection multiple */}



                {/* Header with Badge */}
                <div className="flex items-center justify-between">
                    {statusInfo.badge}
                    <div className="flex items-center gap-1">
                        {/* Indicateur de fusion */}
                        {isMerged && (
                            <div className="">
                                <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-md">
                                    <Merge size={12} className="text-purple-600 dark:text-purple-400" />
                                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                        {mergeNames.length}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Bouton ajouter à une fusion */}
                        {onAddToMerge && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToMerge(timetable.id, '');
                                }}
                                className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded transition"
                                title="Ajouter à une fusion"
                            >
                                <Plus size={14} className="text-purple-600 dark:text-purple-400" />
                            </button>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(false);
                            }}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                            title="Voir les détails"
                        >
                            <Scaling size={14} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                            title="Voir les détails"
                        >
                            <CalendarCog size={14} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        {!timetable.published_date && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPublish(timetable.id);
                                }}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                                title="Publier"
                                disabled={isPublishing}
                            >
                                <CalendarArrowUp size={14} className="text-green-600 dark:text-green-400" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(timetable.id);
                            }}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                            title="Supprimer"
                            disabled={isDeleting}
                        >
                            <CalendarX2 size={14} className="text-red-600 dark:text-red-400" />
                        </button>
                    </div>
                </div>

                {/* Period */}
                <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(timetable.start_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                        {' → '}
                        {new Date(timetable.end_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>

                {/* Slots count */}
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Clock size={12} />
                    <span>{timetable.slots.length} séance{timetable.slots.length > 1 ? 's' : ''} programmée{timetable.slots.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <BookOpen size={12} />
                    <span>{timetable.course_name}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <School size={12} />
                    <span>Dans la classe de {timetable.class_name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Columns2 size={12} />
                    <span>{timetable.class_group_name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <ContactRound size={12} />
                    <span>{timetable.teacher_name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Clock size={12} />
                    <span>{timetable.room_name}</span>
                </div>

                {/* Afficher les noms des fusions */}
                {isMerged && mergeNames.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300">
                            <Merge size={10} />
                            <span className="font-medium">Inclus dans:</span>
                        </div>
                        <ul className="mt-1 space-y-1">
                            {merges.map((merge) => (
                                <li key={merge.id} className="flex items-center justify-between text-xs bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                                    <span 
                                        className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewMerge?.(merge.id);
                                        }}
                                    >
                                        • {merge.name}
                                    </span>
                                    <Tooltip
                                        content='Retirer de cette fusion'
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveFromMerge?.(timetable.id, merge.id);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                                            
                                        >

                                            <X size={16} />

                                        </button>
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Afficher les groupes partagés */}
                {(isShared || onShare) && (
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300">
                                <Columns2 size={10} />
                                <span className="font-medium">{isShared ? 'Partagé avec:' : 'Partager avec d\'autres groupes'}</span>
                            </div>
                            {onShare && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShare(timetable.id);
                                    }}
                                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition"
                                    title="Partager avec d'autres groupes"
                                >
                                    <Plus size={12} className="text-blue-600 dark:text-blue-400" />
                                </button>
                            )}
                        </div>
                        {isShared && sharedGroups.length > 0 && (
                            <ul className="mt-1 space-y-1">
                                {sharedGroups.map((group) => (
                                    <li key={group.id} className="flex items-center justify-between text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                        <span className="text-blue-600 dark:text-blue-400">
                                            • {group.group_name} ({group.class_name} - {group.department_abreviation})
                                        </span>
                                        <Tooltip content='Retirer le partage'>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUnshare?.(timetable.id, group.id);
                                                }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <X size={16} />
                                            </button>
                                        </Tooltip>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}