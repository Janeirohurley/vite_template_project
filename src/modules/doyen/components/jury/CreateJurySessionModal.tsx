/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { useStudentGroups, useTeachers } from '../../hooks';
import type { CreateJurySessionData } from '../../types/juryTypes';
import { Input } from '@/components/ui/input';

interface CreateJurySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJurySessionData) => void;
  isSubmitting: boolean;
}

export function CreateJurySessionModal({ isOpen, onClose, onSubmit, isSubmitting }: CreateJurySessionModalProps) {
  const [formData, setFormData] = useState<Partial<CreateJurySessionData>>({
    jury_members: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: groupsData } = useStudentGroups({ pagination: false });
  const { data: teachersData } = useTeachers({ pagination: false });

  const groups = groupsData?.results || [];
  const teachers = teachersData?.results || [];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.session_name) newErrors.session_name = 'Nom de session requis';
    if (!formData.class_group) newErrors.class_group = 'Groupe requis';
    if (!formData.session_date) newErrors.session_date = 'Date requise';
    if (!formData.jury_members || formData.jury_members.length === 0) {
      newErrors.jury_members = 'Au moins un membre du jury requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as CreateJurySessionData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold">Créer une Session de Jury</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <SingleSelectDropdown
            label="Groupe de Classe"
            required
            options={groups.map(g => ({ id: g.id, label: `${g.class_name} - ${g.group_name}` }))}
            value={formData.class_group || ''}
            onChange={(value) => handleChange('class_group', value)}
            placeholder="Sélectionner un groupe"
            searchPlaceholder="Rechercher un groupe..."
          />
          {errors.class_group && <p className="text-red-500 text-xs">{errors.class_group}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Nom de Session *</label>
            <Input
              value={formData.session_name || ''}
              onChange={(e) => handleChange('session_name', e.target.value)}
              placeholder="Ex: Délibération Semestre 1"
            />
            {errors.session_name && <p className="text-red-500 text-xs">{errors.session_name}</p>}
          </div>

          <CustomDatePicker
            label="Date de Session"
            required
            value={formData.session_date || ''}
            onChange={(value) => handleChange('session_date', value)}
            placeholder="Sélectionner la date"
          />
          {errors.session_date && <p className="text-red-500 text-xs">{errors.session_date}</p>}

          <MultiSelectDropdown
            label="Membres du Jury"
            required
            options={teachers.map(t => ({ id: t.id, label: `${t.user_obj.first_name} ${t.user_obj.last_name}` }))}
            values={formData.jury_members || []}
            onChange={(values) => handleChange('jury_members', values)}
            placeholder="Sélectionner les membres"
            searchPlaceholder="Rechercher un enseignant..."
          />
          {errors.jury_members && <p className="text-red-500 text-xs">{errors.jury_members}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
