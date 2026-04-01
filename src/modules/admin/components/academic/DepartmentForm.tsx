import { useState, useEffect } from 'react';
import type { Department, CreateDepartmentData, UpdateDepartmentData } from '../../types/academicTypes';
import { useFaculties } from '../../hooks/useAcademicEntities';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { Input } from '@/components/ui/input';

interface DepartmentFormProps {
    department?: Department;
    onSubmit: (data: CreateDepartmentData | UpdateDepartmentData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function DepartmentForm({ department, onSubmit, onCancel, isLoading }: DepartmentFormProps) {
    const [formData, setFormData] = useState<CreateDepartmentData>({
        department_name: department?.department_name || '',
        abreviation: department?.abreviation || '',
        faculty_id: department?.faculty?.id || '',
    });

    const { data: facultiesData } = useFaculties();
    const faculties = facultiesData?.results || [];

    useEffect(() => {
        if (department && department.faculty) {
            setFormData({
                department_name: department.department_name,
                abreviation: department.abreviation,
                faculty_id: department.faculty.id,
            });
        }
    }, [department]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du département *
                </label>
                <Input
                    type="text"
                    value={formData.department_name}
                    onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                    placeholder='Nom du département'
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Abréviation *
                </label>
                <Input
                    type="text"
                    value={formData.abreviation}
                    onChange={(e) => setFormData({ ...formData, abreviation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                    placeholder='Abreviation'
                />
            </div>
            <SingleSelectDropdown
                label='Programme'
                required
                options={faculties.map(faculty => ({
                    id: faculty.id, value: faculty.id,
                    label: `${faculty.faculty_name} ${faculty.faculty_abreviation ? `(${faculty.faculty_abreviation})` : ''}`
                }))}
                value={formData.faculty_id}
                onChange={(value) => setFormData({ ...formData, faculty_id: value })}
                placeholder="Sélectionnez un programme"
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
                    {isLoading ? 'En cours...' : department ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}
