// ==================== TIMETABLE GRID COMPONENT ====================

import type { SlotWithTimetable } from "../../pages/SchedulesPageNew";

interface TimetableGridProps {
    slots: SlotWithTimetable[];
    onSlotClick: (slot: SlotWithTimetable) => void;
}

export default function TimetableGrid({ slots, onSlotClick }: TimetableGridProps) {
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const dayMap = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche',
    } as const;

    // Récupération de l'année académique depuis le store
    // (à adapter selon votre store, ici exemple avec useSettings)
    // import { useSettings } from '@/store/settings';
    // const { selectedAcademicYear } = useSettings();
    // Pour démo, valeurs fictives :
    const selectedAcademicYear = {
        start_date: '2025-09-01',
        end_date: '2026-06-30',
        label: '2025-2026'
    };

    // Group slots by day
    const slotsByDay = slots.reduce((acc, slot) => {
        const frenchDay = dayMap[slot.day_of_week.toLowerCase() as keyof typeof dayMap];
        if (!frenchDay) return acc;

        acc[frenchDay] ??= [];
        acc[frenchDay].push(slot);

        return acc;
    }, {} as Record<string, SlotWithTimetable[]>);

    // Get all unique time slots (sorted)
    const timeSlots = Array.from(
        new Set(slots.map(slot => `${slot.start_time}-${slot.end_time}`))
    ).sort();




    // Couleur unique pour tous les slots
    const getSlotColor = () => {
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800/40';
    };

    return (
        <>
   
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Année académique : <span className="font-bold">{selectedAcademicYear.label}</span>
                <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">({new Date(selectedAcademicYear.start_date).toLocaleDateString()} - {new Date(selectedAcademicYear.end_date).toLocaleDateString()})</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
                Nombre de créneaux affichés : <span className="font-bold">{slots.length}</span>
            </div>
        </div>
        <div className="overflow-x-auto  rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 px-1.5 sm:px-2 py-1.5 text-left text-[9px] sm:text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight border-r border-gray-200 dark:border-gray-700 min-w-[60px] sm:min-w-[70px]">
                                Heure
                            </th>
                            {daysOfWeek.map((day) => (
                                <th
                                    key={day}
                                    className="px-1.5 sm:px-2 py-1.5 text-center text-[9px] sm:text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight min-w-20 sm:min-w-[110px]"
                                    title={`Créneaux du ${day}`}
                                >
                                    <span className="hidden sm:inline">{day.substring(0, 4)}</span>
                                    <span className="sm:hidden">{day.substring(0, 3)}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {timeSlots.length === 0 ? (
                            <tr>
                                <td colSpan={daysOfWeek.length + 1} className="text-center py-8 text-gray-400 dark:text-gray-500">
                                    Aucun créneau disponible pour cette période ou ce groupe.
                                </td>
                            </tr>
                        ) : (
                            timeSlots.map((timeSlot, timeIndex) => {
                                const [startTime, endTime] = timeSlot.split('-');
                                return (
                                    <tr key={timeSlot} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-1.5 sm:px-2 py-1.5 whitespace-nowrap text-[9px] sm:text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-col leading-tight">
                                                <span>{startTime.substring(0, 5)}</span>
                                                <span className="text-gray-400 text-[8px] sm:text-[9px]">{endTime.substring(0, 5)}</span>
                                            </div>
                                        </td>
                                        {daysOfWeek.map((day) => {
                                            const daySlots = (slotsByDay[day] || []).filter(
                                                slot => `${slot.start_time}-${slot.end_time}` === timeSlot
                                            );

                                            return (
                                                <td key={`${day}-${timeSlot}`} className="px-0.5 sm:px-1 py-1">
                                                    {daySlots.length > 0 ? (
                                                        <div className="space-y-0.5">
                                                            {daySlots.map((slot, idx) => (
                                                                <button
                                                                    key={slot.id}
                                                                    onClick={() => onSlotClick(slot)}
                                                                    className={`w-full text-left p-2 sm:p-3 rounded border transition-all cursor-pointer min-h-12 sm:min-h-16 flex flex-col justify-center ${getSlotColor()}`}
                                                                    title={`Cours : ${slot.timetableInfo.course_name || slot.schedule_name || 'Sans titre'}\nSalle : ${slot.timetableInfo.room_name || 'Salle'}\nCliquez pour plus d'info`}
                                                                >
                                                                    <div className="text-[10px] sm:text-[12px] font-semibold text-gray-900 dark:text-white truncate leading-tight">
                                                                        {slot.timetableInfo.course_name || slot.schedule_name || 'Sans titre'}
                                                                    </div>
                                                                    <div className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400 truncate mt-1 leading-tight">
                                                                        {slot.timetableInfo.room_name || 'Salle'}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 sm:h-12 flex items-center justify-center">
                                                            <span className="text-[10px] text-gray-300 dark:text-gray-600">—</span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {/* Légende */}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium">Légende :</span>
            <span className="px-2 py-1 rounded border bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">Créneau de cours</span>
        </div>
        </>
    );

}