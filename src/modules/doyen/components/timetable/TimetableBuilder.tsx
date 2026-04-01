/**
 * TimetableBuilder - Éditeur pour créer OU éditer un emploi du temps (bulk selection de slots)
 * Version sans composants Shadcn/UI Select (utilise des select natifs stylisés)
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClasses, useClassGroups, useScheduleSlots } from '../../hooks/useTimetable';
import type { ScheduleSlot, Timetable } from '../../types/backend';
import TimetableCell from './TimetableCell';
import EventDrawer from './EventDrawer';
import SlotCreatorModal from './SlotCreatorModal';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';

interface TimetableBuilderProps {
  timetableToEdit?: Timetable | null;
  onEditComplete?: () => void;
}

const TimetableBuilder: React.FC<TimetableBuilderProps> = ({
  timetableToEdit,
  onEditComplete
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(timetableToEdit?.class_id || '');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const { data: groupsData, isLoading: loadingGroups } = useClassGroups({ class_id: selectedClassId }, {
    enabled: !!selectedClassId
  });

  const classes = classesData?.results || [];
  const groups = groupsData?.results || [];

  const { data: slotsData, isLoading: loadingSlots } = useScheduleSlots({ pagination: false });
  const slots = useMemo(() => slotsData?.results ?? [], [slotsData]);

  const [selectedSlots, setSelectedSlots] = useState<ScheduleSlot[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  // Pré-remplir les champs si on édite un timetable existant
  useEffect(() => {
    if (timetableToEdit && slots.length > 0) {
      // Pré-sélectionner le groupe de classe
      if (timetableToEdit.class_group) {
        setSelectedGroupId(timetableToEdit.class_group);
      }
      if (timetableToEdit.class_id) {
        setSelectedClassId(timetableToEdit.class_id);
        alert(timetableToEdit.class_id)
      }

      // Pré-sélectionner les slots utilisés par ce timetable
      const availableSlots = timetableToEdit.slot_details || slots;
      const preSelectedSlots = availableSlots.filter(slot =>
        timetableToEdit.slots.includes(slot.id)
      );
      setSelectedSlots(preSelectedSlots);

      // Ouvrir le drawer automatiquement en mode édition
      if (preSelectedSlots.length > 0 && timetableToEdit.class_group) {
        setIsDrawerOpen(true);
      }
    }
  }, [timetableToEdit, slots]);

  const toggleSlotSelection = (slot: ScheduleSlot) => {
    setSelectedSlots(prev => {
      const exists = prev.some(s => s.id === slot.id);
      if (exists) {
        return prev.filter(s => s.id !== slot.id);
      }
      return [...prev, slot];
    });
  };

  // Calculer les dates min/max basées sur les créneaux sélectionnés
  const getDateRangeFromSlots = (slots: ScheduleSlot[]) => {
    if (slots.length === 0) return { minDate: null, maxDate: null };

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const selectedDays = slots.map(s => dayOrder.indexOf(s.day_of_week)).filter(i => i !== -1).sort((a, b) => a - b);
    
    if (selectedDays.length === 0) return { minDate: null, maxDate: null };

    const today = new Date();
    const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1;
    
    const firstDay = selectedDays[0];
    const daysUntilFirst = (firstDay - currentDay + 7) % 7;
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + daysUntilFirst);
    
    const lastDay = selectedDays[selectedDays.length - 1];
    const daysUntilLast = (lastDay - currentDay + 7) % 7 || 7;
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + daysUntilLast);
    
    return { minDate, maxDate };
  };

  const handleNext = () => {
    if (selectedSlots.length > 0 && selectedGroupId) {
      setIsDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Si on était en mode édition et que l'utilisateur a terminé, appeler le callback
    // if (timetableToEdit && onEditComplete) {
    //   onEditComplete();
    // }
  };

  const slotsByDay = useMemo(() => {
    const grouped: { [key: string]: ScheduleSlot[] } = {};
    slots.forEach(slot => {
      if (!grouped[slot.day_of_week]) grouped[slot.day_of_week] = [];
      grouped[slot.day_of_week].push(slot);
    });
    Object.keys(grouped).forEach(day =>
      grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time))
    );
    return grouped;
  }, [slots]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayLabels: { [key: string]: string } = {
    Monday: 'Lundi',
    Tuesday: 'Mardi',
    Wednesday: 'Mercredi',
    Thursday: 'Jeudi',
    Friday: 'Vendredi',
    Saturday: 'Samedi',
    Sunday: 'Dimanche',
  };

  if (loadingClasses || loadingSlots) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">

        {/* Titre principal */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            {timetableToEdit ? 'Modification de l\'horaire' : 'Création d\'un nouvel horaire'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {timetableToEdit
              ? 'Modifiez les créneaux et les informations du cours'
              : 'Sélectionnez une classe, un groupe, puis les créneaux souhaités'
            }
          </p>
        </div>

        {/* Sélecteurs classe/groupe + Bouton créer créneau */}
        <div className="mb-10 flex flex-col lg:flex-row gap-4 items-end max-w-4xl mx-auto">
          {/* Sélecteur Classe */}


          <SingleSelectDropdown
            className='flex-1'
            options={classes.map((cl) => ({
              id: cl.id,
              value: cl.id,
              label: `${cl.class_name}-->(${cl.department_name})`
            }))}
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e)}
            placeholder={loadingClasses ? 'Chargement...' : 'Choisir une classe'}
            searchPlaceholder="Rechercher..."
            required

          />


          <SingleSelectDropdown
            className='flex-1'
            options={groups.map((gr) => ({
              id: gr.id,
              value: gr.id,
              label: `${gr.group_name}-->(${gr.class_name})`
            }))}
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e)}
            placeholder={loadingGroups ? 'Chargement...' : 'Choisir un groupe'}
            searchPlaceholder="Rechercher..."
            required
            disabled={!selectedClassId || loadingGroups}
          />

          {/* Bouton créer créneau */}
          <Button
            onClick={() => setIsSlotModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Créer un créneau
          </Button>
        </div>

        {/* Grille de sélection des slots */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 gap-0 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                {days.map((day) => (
                  <div
                    key={day}
                    className="px-4 py-5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {dayLabels[day]}
                  </div>
                ))}
              </div>

              {/* Corps de la grille - Une ligne par "tranche horaire" implicite */}
              <div className="bg-white dark:bg-gray-800">
                {Object.keys(slotsByDay).length > 0 ? (
                  <div className="grid grid-cols-7 gap-0 border-t border-gray-200 dark:border-gray-700">
                    {days.map((day, dayIdx) => {
                      const daySlots = slotsByDay[day] || [];

                      return (
                        <motion.div
                          key={day}
                          className="border-r border-gray-200 dark:border-gray-600 last:border-r-0 min-h-[140px] flex flex-col"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: dayIdx * 0.08 }}
                        >
                          {/* Padding interne + espacement vertical des cellules */}
                          <div className="p-3 flex-1 flex flex-col justify-start space-y-3">
                            {daySlots.length > 0 ? (
                              daySlots.map((slot) => {
                                const isSelected = selectedSlots.some((s) => s.id === slot.id);
                                return (
                                  <TimetableCell
                                    key={slot.id}
                                    slot={slot}
                                    timetables={[]}
                                    onClick={() => toggleSlotSelection(slot)}
                                    isSelected={isSelected}
                                    selectionMode={true}
                                  />
                                );
                              })
                            ) : (
                              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                                Aucun créneau
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <p className="text-lg">Aucun créneau horaire défini</p>
                    <p className="text-sm mt-2">
                      Commencez par en créer via le bouton ci-dessus
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compteur et bouton Suivant */}
        {selectedSlots.length > 0 && selectedGroupId && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>{selectedSlots.length}</strong> créneau{selectedSlots.length > 1 ? 'x' : ''} sélectionné{selectedSlots.length > 1 ? 's' : ''}
            </p>
            <Button size="lg" onClick={handleNext}>
              Suivant → Configurer le cours
            </Button>
          </div>
        )}

        {/* EventDrawer - Bulk creation/edition */}
        <AnimatePresence>
          {isDrawerOpen && (
            <EventDrawer
              isOpen={isDrawerOpen}
              onClose={handleCloseDrawer}
              selectedSlots={selectedSlots}
              groupId={selectedGroupId}
              timetableToEdit={timetableToEdit}
              onEditComplete={onEditComplete}
              classId={selectedClassId}
              dateRange={getDateRangeFromSlots(selectedSlots)}
            />
          )}
        </AnimatePresence>

        {/* Modal création de créneau */}
        <AnimatePresence>
          {isSlotModalOpen && (
            <SlotCreatorModal
              isOpen={isSlotModalOpen}
              onClose={() => setIsSlotModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimetableBuilder;