/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * EventDrawer - Drawer pour créer OU éditer un emploi du temps en bulk (plusieurs créneaux)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, MapPin, BookOpen, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import {
  useCreateTimetable,
  useUpdateTimetable,
  useRooms,
  useCourseAttributionsByClass,
} from '../../hooks/useTimetable';
import type { ScheduleSlot, CreateTimetableData, Timetable } from '../../types/backend';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useSettings } from '@/store/settings';
import { notify } from '@/lib';

interface EventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlots: ScheduleSlot[];
  groupId: string;
  timetableToEdit?: Timetable | null;
  onEditComplete?: () => void;
  classId: string;
  dateRange: { minDate: Date | null; maxDate: Date | null };
}

const EventDrawer: React.FC<EventDrawerProps> = ({
  isOpen,
  onClose,
  selectedSlots,
  groupId,
  timetableToEdit,
  onEditComplete,
  classId,
  dateRange
}) => {
  const isEditMode = !!timetableToEdit;

  const { selectedAcademicYear } = useSettings();

  const [formData, setFormData] = useState<Partial<CreateTimetableData>>({
    slots: selectedSlots.map(s => s.id),
    class_group: groupId,
    status: 'Planned',
  });

  const createMutation = useCreateTimetable();
  const updateMutation = useUpdateTimetable();

  // Fetch données pour les dropdowns
  const { data: roomsData } = useRooms({ pagination: false });
  const { data: attributionsData } = useCourseAttributionsByClass({ class_id: classId, pagination: false });

  const rooms = roomsData?.results || [];
  const attributions = attributionsData?.results || [];

  useEffect(() => {
    // En mode édition, pré-remplir les champs avec les données existantes
    if (isEditMode && timetableToEdit) {
      setFormData({
        slots: selectedSlots.map(s => s.id),
        class_group: groupId,
        attribution: timetableToEdit.attribution,
        room: timetableToEdit.room,
        start_date: timetableToEdit.start_date,
        end_date: timetableToEdit.end_date,
        status: timetableToEdit.status,
      });
    } else {
      // Mode création : initialiser avec les dates calculées
      setFormData(prev => ({
        ...prev,
        slots: selectedSlots.map(s => s.id),
        class_group: groupId,
        start_date: dateRange.minDate ? dateRange.minDate.toISOString().split('T')[0] : prev.start_date,
        end_date: dateRange.maxDate ? dateRange.maxDate.toISOString().split('T')[0] : prev.end_date,
      }));
    }
  }, [selectedSlots, groupId, isEditMode, timetableToEdit, dateRange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.attribution || !formData.room || !formData.start_date || !formData.end_date) {
      notify.info('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation: Vérifier que les dates correspondent aux jours des créneaux
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slotDays = selectedSlots.map(s => dayOrder.indexOf(s.day_of_week));
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();

    if (!slotDays.includes(startDay)) {
      notify.error(`La date de début doit correspondre à un jour de créneau sélectionné (${selectedSlots.map(s => s.day_of_week).join(', ')})`);
      return;
    }

    if (!slotDays.includes(endDay)) {
      notify.error(`La date de fin doit correspondre à un jour de créneau sélectionné (${selectedSlots.map(s => s.day_of_week).join(', ')})`);
      return;
    }

    if (startDate > endDate) {
      notify.error('La date de début doit être antérieure à la date de fin');
      return;
    }

    // Vérification des bornes de l'année académique
    if (selectedAcademicYear) {
      const yearStart = new Date(selectedAcademicYear.start_date);
      const yearEnd = new Date(selectedAcademicYear.end_date);
      if (startDate < yearStart || endDate > yearEnd) {
        notify.error(`Les dates doivent être comprises entre le ${yearStart.toLocaleDateString()} et le ${yearEnd.toLocaleDateString()} de l'année académique.`);
        return;
      }
    }

    try {

      if (isEditMode && timetableToEdit) {
        // Mode édition : mise à jour du timetable existant

        await updateMutation.mutateAsync({
          id: timetableToEdit.id,
          data: {
            slots: formData.slots,
            attribution: formData.attribution,
            room: formData.room,
            start_date: formData.start_date,
            end_date: formData.end_date,
            status: formData.status,
            class_group: formData.class_group,
          },
        });
      } else {
        // Mode création : nouveau timetable
        await createMutation.mutateAsync(formData as CreateTimetableData);
      }
      onClose();
      if (onEditComplete)
        onEditComplete();
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} timetable:`, error);
      notify.error(error?.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'}`);
    }
  };

  if (!isOpen) return null;

  const dayLabels: { [key: string]: string } = {
    Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi',
    Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi', Sunday: 'Dimanche'
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {isEditMode ? (
                <>
                  <Edit size={18} />
                  Modifier l'emploi du temps
                </>
              ) : (
                'Créer un cours récurrent'
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {selectedSlots.length} créneau{selectedSlots.length > 1 ? 'x' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-5">

          {/* Attribution (Cours + Prof) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cours & Professeur *
              </span>
            </div>
            <SingleSelectDropdown
              options={attributions.map((attr: any) => ({
                id: attr.id,
                label: `${attr.course_name} (${attr.principal_teacher_name})`,
              }))}
              value={formData.attribution}
              onChange={(value) => setFormData({ ...formData, attribution: value })}
              placeholder="Choisir le cours"
              searchPlaceholder="Rechercher..."
              required
            />
          </div>

          {/* Salle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Salle *
              </span>
            </div>
            <SingleSelectDropdown
              options={rooms
                .filter((room: any) => room.is_available)
                .map((room: any) => ({
                  id: room.id,
                  label: `${room.room_name} (${room.building_name}) - Capacité: ${room.capacity}`,
                }))}
              value={formData.room}
              onChange={(value) => setFormData({ ...formData, room: value })}
              placeholder="Choisir une salle"
              searchPlaceholder="Rechercher..."
              required
            />
          </div>

          {/* Dates de validité */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <CustomDatePicker
                label="Date début"
                value={formData.start_date || ''}
                onChange={(date) => setFormData({ ...formData, start_date: date })}
                placeholder="JJ/MM/AAAA"
                required
              />
            </div>
            <div className="space-y-2">
              <CustomDatePicker
                label="Date fin"
                value={formData.end_date || ''}
                onChange={(date) => setFormData({ ...formData, end_date: date })}
                placeholder="JJ/MM/AAAA"
                required
              />
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <SingleSelectDropdown
              label="Statut"
              options={[
                { id: 'Planned', label: 'Planifié' },
                { id: 'Completed', label: 'Terminé' },
                { id: 'Cancelled', label: 'Annulé' },
              ]}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as any })}
              placeholder="Statut"
            />
          </div>

          {/* Liste des créneaux sélectionnés */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Créneaux concernés ({selectedSlots.length})
            </p>
            <div className="h-48 rounded-md border border-gray-200 dark:border-gray-700 p-3 overflow-y-auto">
              <div className="space-y-2 text-xs">
                {selectedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {dayLabels[slot.day_of_week] || slot.day_of_week}
                      </span>
                      <span className="ml-2 text-gray-500">
                        {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                      </span>
                    </div>
                    {slot.schedule_name && (
                      <span className="text-gray-500 ">{slot.schedule_name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton Créer */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save size={18} className="mr-2" />
              {isEditMode
                ? (updateMutation.isPending ? 'Modification en cours...' : 'Enregistrer les modifications')
                : (createMutation.isPending ? 'Création en cours...' : `Créer sur ${selectedSlots.length} créneau${selectedSlots.length > 1 ? 'x' : ''}`)
              }
            </Button>
          </div>

          {/* Astuces */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-2">ℹ️ Informations :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Un seul cours sera créé pour tous ces créneaux</li>
              <li>Les dates définissent la période d'application</li>
              <li>Vous pourrez publier l'emploi du temps après</li>
            </ul>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default EventDrawer;