import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreateDeliberationData, CreateDeliberationMemberData, Teacher } from '../types';

interface CreateDeliberationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeliberationData) => void;
  isLoading?: boolean;
  teachers: Teacher[];
  classes: Array<{ id: string; class_name: string }>;
  academicYears: Array<{ id: string; academic_year: string }>;
}

export function CreateDeliberationModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  teachers,
  classes,
  academicYears,
}: CreateDeliberationModalProps) {
  const [formData, setFormData] = useState<CreateDeliberationData>({
    academic_year: '',
    class_fk: '',
    semester: 1,
    deliberation_date: '',
    members: [],
  });

  const [currentMember, setCurrentMember] = useState<CreateDeliberationMemberData>({
    teacher: '',
    role: 'Membre',
  });

  const handleAddMember = () => {
    if (!currentMember.teacher) return;
    
    // Vérifier si l'enseignant est déjà dans la liste
    if (formData.members.some(m => m.teacher === currentMember.teacher)) {
      alert('Cet enseignant est déjà membre du jury');
      return;
    }

    setFormData({
      ...formData,
      members: [...formData.members, currentMember],
    });
    setCurrentMember({ teacher: '', role: 'Membre' });
  };

  const handleRemoveMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.members.length === 0) {
      alert('Veuillez ajouter au moins un membre au jury');
      return;
    }

    onSubmit(formData);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.user_obj.first_name} ${teacher.user_obj.last_name}` : '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Créer une Délibération
              </h2>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
            {/* Année académique */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Année Académique *
              </label>
              <select
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Sélectionner...</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.academic_year}
                  </option>
                ))}
              </select>
            </div>

            {/* Classe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Classe *
              </label>
              <select
                value={formData.class_fk}
                onChange={(e) => setFormData({ ...formData, class_fk: e.target.value })}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Sélectionner...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semestre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Semestre *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) as 1 | 2 })}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value={1}>Semestre 1</option>
                <option value={2}>Semestre 2</option>
              </select>
            </div>

            {/* Date de délibération */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de Délibération *
              </label>
              <Input
                type="date"
                value={formData.deliberation_date}
                onChange={(e) => setFormData({ ...formData, deliberation_date: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            {/* Membres du jury */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Membres du Jury *
              </label>
              
              {/* Ajouter un membre */}
              <div className="flex gap-2 mb-3">
                <select
                  value={currentMember.teacher}
                  onChange={(e) => setCurrentMember({ ...currentMember, teacher: e.target.value })}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner un enseignant...</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.user_obj.first_name} {teacher.user_obj.last_name}
                    </option>
                  ))}
                </select>
                <select
                  value={currentMember.role}
                  onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value as 'Président' | 'Membre' | 'Secrétaire' })}
                  disabled={isLoading}
                  className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Membre">Membre</option>
                  <option value="Président">Président</option>
                  <option value="Secrétaire">Secrétaire</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!currentMember.teacher || isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter
                </button>
              </div>

              {/* Liste des membres */}
              {formData.members.length > 0 && (
                <div className="space-y-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  {formData.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {getTeacherName(member.teacher)}
                        </span>
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {member.role}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        disabled={isLoading}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || formData.members.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création...
                </>
              ) : (
                'Créer la Délibération'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
