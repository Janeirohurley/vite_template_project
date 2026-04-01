import { useState } from "react";
import type { SlotWithTimetable } from "../../pages/SchedulesPageNew";
import type { ScheduleSlot, Timetable } from "../../types/backend";
import getStatusInfo from "./getStatusInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Grid, X } from "lucide-react";
import TimetableGrid from "./TimetableGrid";
import { AnimatePresence, motion } from "framer-motion";
import SlotDetailModal from "./SlotDetailModal";

interface TimetableDetailViewProps {
    timetable: Timetable | null | undefined;
    slots: ScheduleSlot[];
    onClose: () => void;
    isOpen: boolean;
}


export default function TimetableDetailView({ timetable, slots, onClose, isOpen }: TimetableDetailViewProps) {
    const [selectedSlot, setSelectedSlot] = useState<SlotWithTimetable | null>(null);

    if (!slots || !isOpen || !timetable) return null;

    const statusInfo = getStatusInfo(timetable.status, timetable.published_date);

    const availableSlots = timetable.slot_details || slots;

    const timetableSlots = availableSlots
        .filter(slot => timetable.slots.includes(slot.id))
        .map(slot => ({ ...slot, timetableInfo: timetable }));
        console.log(timetable);
        

    return (
        <AnimatePresence initial={true}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Modal wrapper */}
            <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "keyframes", visualDuration: 0.4, bounce: 0.5 },
                }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
                <div
                    className="relative w-full max-w-[95vw] max-h-[90vh] "
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className={`border ${statusInfo.borderColor}`}>
                        {/* Header Section */}
                        <CardHeader className={`${statusInfo.bgColor} border-b ${statusInfo.borderColor}`}>
                            <div className="flex items-center justify-between p-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className={statusInfo.color}>
                                            {statusInfo.icon}
                                        </div>
                                        <CardTitle className="text-md">{statusInfo.label} du {timetable.start_date
                                            } au {timetable.end_date}</CardTitle>
                                    </div>
                                </div>

                                {statusInfo.badge}
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 rounded-lg transition-colors absolute -right-1 -top-2"
                                    aria-label="Fermer"
                                >
                                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {/* Information Summary Section */}
                            <div className="space-y-6">
                               

                                {/* Timetable Grid */}
                                {timetableSlots.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <Grid size={16} />
                                            Grille des Horaires
                                        </h3>
                                        <TimetableGrid
                                            slots={timetableSlots}
                                            onSlotClick={setSelectedSlot}
                                        />
                                    </div>
                                )}

                                {/* Status Information */}
                                <div className={`border-t ${statusInfo.borderColor} pt-4`}>
                                    <div className="flex items-start gap-3">
                                        <div className={statusInfo.color}>
                                            <AlertCircle size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                État de l'emploi du temps
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {timetable.published_date
                                                    ? "Cet emploi du temps est publié et visible par les étudiants et enseignants."
                                                    : "Cet emploi du temps est en mode brouillon. Publiez-le pour le rendre visible."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Slot Detail Modal */}
                    <SlotDetailModal
                        slot={selectedSlot}
                        isOpen={!!selectedSlot}
                        onClose={() => setSelectedSlot(null)}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
