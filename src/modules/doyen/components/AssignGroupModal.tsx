import React, { useState, useEffect } from 'react';
import type { DeanStudent, StudentGroup } from '../types';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';

interface AssignGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: DeanStudent[];
  groups: StudentGroup[];
  onAssign: (groupId: string, studentIds: string[], mode: 'assign' | 'change' | 'remove') => void;
  onStudentsChange?: (studentIds: string[]) => void;
  isLoading?: boolean;
}

export function AssignGroupModal({ isOpen, onClose, students, groups, onAssign, onStudentsChange, isLoading = false }: AssignGroupModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [mode, setMode] = useState<'assign' | 'change' | 'remove'>('assign');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Mettre à jour selectedStudents quand students change
  useEffect(() => {
    setSelectedStudents(students.map(s => s.id));
  }, [students]);

  // Catégoriser les étudiants
  const studentsWithGroup = students.filter(s => s.student_group && s.student_group.name);
  const studentsWithoutGroup = students.filter(s => !s.student_group || !s.student_group.name);
  
  // Détecter les doublons (même groupe)
  const groupCounts = studentsWithGroup.reduce((acc, s) => {
    const groupId = s.student_group?.id || '';
    acc[groupId] = (acc[groupId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasDuplicates = Object.values(groupCounts).some(count => count > 1);

  const removeStudent = (studentId: string) => {
    const newSelection = selectedStudents.filter(id => id !== studentId);
    setSelectedStudents(newSelection);
    if (onStudentsChange) {
      onStudentsChange(newSelection);
    }
    // Fermer et rouvrir le modal pour forcer la resynchronisation
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assigner à un groupe</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Liste des étudiants */}
          <div>
            <div 
              className="mb-3 font-semibold text-gray-900 dark:text-white flex items-center justify-between cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <span>Élèves sélectionnés ({selectedStudents.length}/{students.length})</span>
              <svg 
                className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                {students.filter(s => selectedStudents.includes(s.id)).map(s => {
                  const hasGroup = s.student_group && s.student_group.name;
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center justify-between p-2 rounded transition-all ${
                        hasGroup
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {hasGroup ? (
                          <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {s.user_obj.first_name} {s.user_obj.last_name}
                          </div>
                          {s.matricule && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {s.matricule}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasGroup && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {s.student_group?.name}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeStudent(s.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Retirer de la sélection"
                        >
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">Sans groupe</div>
              <div className="text-blue-900 dark:text-blue-100 text-lg font-bold">{studentsWithoutGroup.length}</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold">Avec groupe</div>
              <div className="text-yellow-900 dark:text-yellow-100 text-lg font-bold">{studentsWithGroup.length}</div>
            </div>
          </div>

          {/* Alertes */}
          {hasDuplicates && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400">⚠️</span>
                <div className="text-orange-800 dark:text-orange-200">
                  <strong>Attention :</strong> Plusieurs élèves appartiennent au même groupe.
                </div>
              </div>
            </div>
          )}

          {studentsWithGroup.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
              <div className="text-yellow-800 dark:text-yellow-200 text-xs font-semibold mb-2">
                {studentsWithGroup.length} élève(s) ont déjà un groupe. Action :
              </div>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={mode === 'assign'}
                    onChange={() => setMode('assign')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ignorer (garder leur groupe actuel)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={mode === 'change'}
                    onChange={() => setMode('change')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Changer de groupe</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={mode === 'remove'}
                    onChange={() => setMode('remove')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Retirer du groupe</span>
                </label>
              </div>
            </div>
          )}
          
          <SingleSelectDropdown
            className='flex-1'
            options={groups.map((gr) => ({
              id: gr.id,
              value: gr.id,
              label: `${gr.group_name}-->(${gr.class_name})`
            }))}
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e)}
            placeholder={'Choisir un groupe'}
            searchPlaceholder="Rechercher..."
            required
            
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onAssign(selectedGroupId, selectedStudents, mode);
              }}
              disabled={(mode !== 'remove' && !selectedGroupId) || selectedStudents.length === 0 || isLoading}
              className={`px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 ${(mode !== 'remove' && !selectedGroupId) || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Assignation...' : mode === 'remove' ? 'Retirer du groupe' : mode === 'change' ? 'Changer de groupe' : 'Assigner au groupe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
