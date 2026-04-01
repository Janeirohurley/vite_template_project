import { useState, useEffect } from 'react';
import type { Faculty, CreateFacultyData, UpdateFacultyData } from '../../types/academicTypes';
import { useTypeFormations } from '../../hooks/useAcademicEntities';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';

interface FacultyFormProps {
    faculty?: Faculty;
    onSubmit: (data: CreateFacultyData | UpdateFacultyData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function FacultyForm({ faculty, onSubmit, onCancel, isLoading }: FacultyFormProps) {
    const [formData, setFormData] = useState<CreateFacultyData>({
        faculty_name: faculty?.faculty_name || '',
        faculty_abreviation: faculty?.faculty_abreviation || '',
        types_id: faculty?.types.id || '',
        university: faculty?.university.id
    });

    const { data: typeFormationsData } = useTypeFormations();
    const typeFormations = typeFormationsData?.results || [];

    useEffect(() => {
        if (faculty) {
            setFormData({
                faculty_name: faculty.faculty_name,
                faculty_abreviation: faculty.faculty_abreviation,
                types_id: faculty.types.id,
                university: faculty.university.id,
            });
        }
    }, [faculty]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du programme *
                </label>
                <input
                    type="text"
                    value={formData.faculty_name}
                    onChange={(e) => setFormData({ ...formData, faculty_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Abréviation
                </label>
                <input
                    type="text"
                    value={formData.faculty_abreviation || ''}
                    onChange={(e) => setFormData({ ...formData, faculty_abreviation: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
            </div>
            <SingleSelectDropdown
                label='  Type de formation'
                required
                value={formData.types_id}
                options={typeFormations.map(t => ({
                    id: t.name,
                    value: t.name,
                    label: `${t.name}- ${t.code}`
                }))}
                onChange={(e) => setFormData({ ...formData, types_id: e })}
            />

            <div className="flex justify-end gap-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    disabled={isLoading}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'En cours...' : faculty ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}
