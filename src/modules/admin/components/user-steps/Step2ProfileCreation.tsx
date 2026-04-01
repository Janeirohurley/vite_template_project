/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useFaculties, useRooms } from '@/modules/admin/hooks/useAcademicEntities';
import { notify } from '@/lib/toast';
import type { UserCreationDraft } from '@/lib/userCreationDB';
import { createProfileApi } from '../../api';

interface Step2ProfileCreationProps {
  data: Partial<UserCreationDraft>;
  onNext: (data: UserCreationDraft['profileData']) => void;
  onPrevious: () => void;
  onAutoSave: (data: UserCreationDraft['profileData']) => void;
}

export function Step2ProfileCreation({ data, onNext, onPrevious, onAutoSave }: Step2ProfileCreationProps) {
  const [formData, setFormData] = useState<UserCreationDraft['profileData']>(
    data.profileData || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: facultiesData } = useFaculties();
  const { data: roomsData } = useRooms({ pagination: false });

  const faculties = facultiesData?.results || [];
  const rooms = roomsData?.results || [];

  useEffect(() => {
    console.log('Step2 data.userData:', data.userData);
  }, [data.userData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        onAutoSave(formData);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, onAutoSave]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.position) newErrors.position = 'Poste requis';
    if (!formData.start_date) newErrors.start_date = 'Date de début requise';
    if (!formData.room) newErrors.room = 'Bureau requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(validateForm(), data.userData?.id)
    if (!validateForm() || !data.userData?.id) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        user_id: data.userData!.id!,
        position: formData.position!,
        start_date: formData.start_date!,
        room: formData.room!,
      };

      if (formData.end_date) payload.end_date = formData.end_date;
      if (formData.faculty) payload.faculty = formData.faculty;

      await createProfileApi(payload);

      notify.success('Profil créé avec succès');

      onNext(formData);
    } catch (error: any) {
      notify.error(error.response?.data?.message || 'Erreur lors de la création du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Note:</strong> Si vous créez un profil pour un Doyen ou Délégué Général, veuillez choisir la faculté à laquelle il appartient.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Poste *</label>
          <Input
            value={formData.position || ''}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder="Ex: Professeur, Doyen, Secrétaire"
          />
          {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
        </div>

        <SingleSelectDropdown
          label="Faculté"
          options={faculties.map(f => ({ id: f.id, label: `${f.faculty_name} (${f.faculty_abreviation})` }))}
          value={formData.faculty || ''}
          onChange={(value) => handleChange('faculty', value)}
          placeholder="Sélectionner une faculté..."
          searchPlaceholder="Rechercher une faculté..."
        />

        <SingleSelectDropdown
          label="Bureau"
          required
          options={rooms.map(r => ({ id: r.id, label: `${r.building_name} - ${r.room_name}` }))}
          value={formData.room || ''}
          onChange={(value) => handleChange('room', value)}
          placeholder="Sélectionner un bureau..."
          searchPlaceholder="Rechercher un bureau..."
        />

        <CustomDatePicker
          label="Date de début"
          required
          value={formData.start_date || ''}
          onChange={(value) => handleChange('start_date', value)}
          placeholder="Sélectionner la date de début"
        />

        <CustomDatePicker
          label="Date de fin"
          value={formData.end_date || ''}
          onChange={(value) => handleChange('end_date', value)}
          placeholder="Sélectionner la date de fin"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" onClick={onPrevious} variant="outline" disabled={isSubmitting}>
          Précédent
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer le profil'}
        </Button>
      </div>
    </form>
  );
}
