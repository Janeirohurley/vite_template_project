// ==================== SLOT DETAIL MODAL COMPONENT ====================

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, BookOpen, Calendar, Clock, FileText, MapPin, Users, X } from "lucide-react";
import type { SlotWithTimetable } from "../../pages/SchedulesPageNew";

interface SlotDetailModalProps {
    slot: SlotWithTimetable | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function SlotDetailModal({ slot, isOpen, onClose }: SlotDetailModalProps) {
    if (!slot || !isOpen) return null;

    const timetable = slot.timetableInfo;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div
                    className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                Détails du Créneau
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            aria-label="Fermer"
                        >
                            <X size={16} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-3">
                        {/* Main Info Card */}
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                {timetable.course_name || slot.schedule_name || 'Séance sans titre'}
                            </h3>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400">
                                        <Calendar size={12} />
                                        <span className="font-medium">Jour</span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white pl-4">
                                        {slot.day_of_week}
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400">
                                        <Clock size={12} />
                                        <span className="font-medium">Horaire</span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white pl-4">
                                        {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Teacher Details */}
                        {timetable.teacher_name && (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <BookOpen size={12} className="text-purple-600" />
                                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Enseignant</h4>
                                </div>
                                <p className="text-[10px] text-gray-700 dark:text-gray-300 pl-4">
                                    {timetable.teacher_name}
                                </p>
                            </div>
                        )}

                        {/* Room Details */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <MapPin size={12} className="text-orange-600" />
                                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Salle</h4>
                            </div>
                            <p className="text-[10px] text-gray-700 dark:text-gray-300 pl-4">
                                {timetable.room_name}
                            </p>
                        </div>

                        {/* Class Group */}
                        {(timetable.class_name || timetable.class_group_name) && (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Users size={12} className="text-blue-600" />
                                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Classe</h4>
                                </div>
                                <p className="text-[10px] text-gray-700 dark:text-gray-300 pl-4">
                                    {timetable.class_name} {timetable.class_group_name ? `- ${timetable.class_group_name}` : ''}
                                </p>
                            </div>
                        )}

                        {/* Period Information */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Calendar size={12} className="text-purple-600" />
                                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Période</h4>
                            </div>
                            <div className="space-y-1 pl-4">
                                <div className="flex items-center gap-1.5 text-[10px]">
                                    <span className="text-gray-600 dark:text-gray-400">Du:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {new Date(timetable.start_date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                    <span className="text-gray-600 dark:text-gray-400">Au:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {new Date(timetable.end_date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <AlertCircle size={12} className="text-gray-600" />
                                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Statut</h4>
                            </div>
                            <div className="pl-4">
                                <Badge
                                    variant={timetable.published_date ? "default" : "secondary"}
                                    className={`text-[10px] ${timetable.published_date ? "bg-green-600 hover:bg-green-700" : ""}`}
                                >
                                    {timetable.published_date ? 'Publié' : timetable.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-3 py-2 flex justify-end">
                        <Button onClick={onClose} variant="outline" size="sm" className="text-xs">
                            Fermer
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}