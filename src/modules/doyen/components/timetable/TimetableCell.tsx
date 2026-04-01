/**
 * TimetableCell - Cellule individuelle de l'emploi du temps
 * Adapté pour le mode création (bulk selection) et affichage normal
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { ScheduleSlot, Timetable } from '../../types/backend';

interface TimetableCellProps {
  slot: ScheduleSlot;
  timetables?: Timetable[];
  onClick: (slot: ScheduleSlot, timetable?: Timetable) => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}

const TimetableCell: React.FC<TimetableCellProps> = ({
  slot,
  timetables = [],
  onClick,
  isSelected = false,
  selectionMode = false,
}) => {
  const handleClick = () => {
    if (selectionMode) {
      onClick(slot);
    } else if (timetables.length > 0) {
      onClick(slot, timetables[0]);
    } else {
      onClick(slot);
    }
  };

  // === Mode création / sélection multiple ===
  if (selectionMode) {
    return (
      <motion.div
        className={`relative min-h-20 border-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col ${isSelected
            ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/40 dark:border-blue-500 shadow-lg  ring-blue-400'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* En-tête : heure + checkmark */}
        <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-300 dark:border-gray-600 rounded-t-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              <Clock size={12} />
              <span>{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
            </div>
            
          </div>

          {/* Nom du créneau - tronqué correctement */}
          {slot.schedule_name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate min-w-0">
              {slot.schedule_name}
            </p>
          )}
        </div>

        {/* Contenu central */}
        <div className="flex-1 flex items-center justify-center p-3">
          {isSelected ? (
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Sélectionné
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Cliquer pour sélectionner
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // === Mode affichage normal ===
  const hasTimetable = timetables.length > 0;
  const timetable = timetables[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800';
      case 'Completed':
        return 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800';
      case 'Cancelled':
        return 'bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'text-blue-700 dark:text-blue-300';
      case 'Completed':
        return 'text-green-700 dark:text-green-300';
      case 'Cancelled':
        return 'text-red-700 dark:text-red-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      className={`min-h-20 border rounded-lg cursor-pointer transition-all duration-200 ${hasTimetable
          ? getStatusColor(timetable.status)
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* En-tête : heure */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <Clock size={12} />
          <span>{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
        </div>

        {/* Nom du créneau - tronqué correctement */}
        {slot.schedule_name && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate min-w-0">
            {slot.schedule_name}
          </p>
        )}
      </div>

      {/* Contenu principal */}
      <div className="p-2">
        {hasTimetable ? (
          <div className="space-y-1">
            {/* Statut */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getStatusTextColor(timetable.status)}`}>
                {timetable.status === 'Planned' && 'Planifié'}
                {timetable.status === 'Completed' && 'Terminé'}
                {timetable.status === 'Cancelled' && 'Annulé'}
              </span>
            </div>

            {/* ID cours */}
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate min-w-0">
              ID: {timetable.id.substring(0, 8)}...
            </p>

            {/* Salle */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="truncate min-w-0">
                Salle: {timetable.room_name || 'Non définie'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 text-gray-400 dark:text-gray-500">
            <span className="text-xs">+ Ajouter un cours</span>
          </div>
        )}
      </div>

      {/* Indicateur plusieurs cours */}
      {timetables.length > 1 && (
        <div className="px-2 pb-2 text-center">
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
            +{timetables.length - 1} autre(s)
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default TimetableCell;