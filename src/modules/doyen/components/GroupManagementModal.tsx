/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, Save, Users as UsersIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateStudentGroup, useUpdateStudentGroup, useDeanClasses } from '../hooks';
import { notify, useAppStore } from '@/lib';
import type { StudentGroup } from '../types';
import type { ApiError } from '@/types';

interface GroupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: StudentGroup | null;
  onSuccess?: () => void;
}

export function GroupManagementModal({
  isOpen,
  onClose,
  group,
  onSuccess,
}: GroupManagementModalProps) {
  const { selectedAcademicYear } = useAppStore();
  const [formData, setFormData] = useState({
    group_name: '',
    class_fk: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: classesData } = useDeanClasses({
    pagination: false,
  });

  const classes = classesData?.results || [];

  const createGroupMutation = useCreateStudentGroup();
  const updateGroupMutation = useUpdateStudentGroup();

  useEffect(() => {
    if (group) {
      setFormData({
        group_name: group.group_name,
        class_fk: group.class_fk,
      });
    } else {
      setFormData({
        group_name: '',
        class_fk: '',
      });
    }
    setError(null);
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.group_name.trim()) {
      setError('Le nom du groupe est requis');
      return;
    }

    if (!formData.class_fk) {
      setError('Veuillez sélectionner une classe');
      return;
    }

    if (!selectedAcademicYear) {
      setError('Aucune année académique sélectionnée');
      return;
    }

    const onError = (err: any) => {
      const apiError = err.formattedError as ApiError;
      setError(apiError?.message || 'Une erreur est survenue');
    };

    try {
      if (group) {
        await updateGroupMutation.mutateAsync(
          {
            id: group.id,
            data: {
              group_name: formData.group_name,
              class_fk: formData.class_fk,
            },
          },
          { onError }
        );
      } else {
        await createGroupMutation.mutateAsync(
          {
            group_name: formData.group_name,
            class_fk: formData.class_fk,
            academic_year: selectedAcademicYear.id,
          },
          { onError }
        );
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      // Error handled in onError callback
      notify.error(error?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <UsersIcon size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {group ? 'Modifier le groupe' : 'Créer un groupe'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du groupe *
            </label>
            <input
              type="text"
              value={formData.group_name}
              onChange={(e) =>
                setFormData({ ...formData, group_name: e.target.value })
              }
              placeholder="Ex: Groupe A, Groupe TP1, etc."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Classe *
            </label>
            <select
              value={formData.class_fk}
              onChange={(e) =>
                setFormData({ ...formData, class_fk: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} - {cls.department_name}
                </option>
              ))}
            </select>
          </div>

          {selectedAcademicYear && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Année académique:</span>{' '}
                {selectedAcademicYear.civil_year}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createGroupMutation.isPending || updateGroupMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Enregistrement...
                </>
              ) : (
                <>
                  {group ? <Save size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                  {group ? 'Enregistrer' : 'Créer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
