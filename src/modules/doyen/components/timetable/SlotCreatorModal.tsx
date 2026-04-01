/**
 * SlotCreatorModal - Modal pour créer des créneaux horaires
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { useCreateScheduleSlot } from '../../hooks/useTimetable';
import type { CreateScheduleSlotData } from '../../types/backend';

interface SlotCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlotCreatorModal: React.FC<SlotCreatorModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateScheduleSlotData>({
    day_of_week: 'Monday',
    start_time: '08:00',
    end_time: '10:00',
    schedule_name: '',
  });

  const createMutation = useCreateScheduleSlot();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.mutateAsync(formData);
      onClose();
      // Reset form
      setFormData({
        day_of_week: 'Monday',
        start_time: '08:00',
        end_time: '10:00',
        schedule_name: '',
      });
    } catch (error) {
      console.error('Error creating slot:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Créer un Créneau Horaire
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day of Week */}
          <div className="space-y-2">
            <SingleSelectDropdown
              label="Jour de la semaine"
              required
              options={[
                { id: 'Monday', label: 'Lundi' },
                { id: 'Tuesday', label: 'Mardi' },
                { id: 'Wednesday', label: 'Mercredi' },
                { id: 'Thursday', label: 'Jeudi' },
                { id: 'Friday', label: 'Vendredi' },
                { id: 'Saturday', label: 'Samedi' },
                { id: 'Sunday', label: 'Dimanche' },
              ]}
              value={formData.day_of_week}
              onChange={(value) => setFormData({ ...formData, day_of_week: value as any })}
              placeholder="Sélectionner un jour"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Heure début *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Heure fin *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Schedule Name (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="schedule_name">Nom du créneau (optionnel)</Label>
            <Input
              id="schedule_name"
              placeholder="Ex: Cours du matin, TD après-midi..."
              value={formData.schedule_name}
              onChange={(e) => setFormData({ ...formData, schedule_name: e.target.value })}
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              💡 Ce créneau sera disponible pour planifier des cours dans l'emploi du temps
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending}
            >
              <Save size={16} className="mr-2" />
              {createMutation.isPending ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default SlotCreatorModal;
