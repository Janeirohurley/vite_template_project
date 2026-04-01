import { useState, useEffect } from 'react';
import type { Module, CreateModuleData, UpdateModuleData } from '../../types/academicTypes';
import { useClasses, useSemesters } from '../../hooks/useAcademicEntities';
import { Input } from '@/components/ui/input';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';

interface ModuleFormProps {
    moduleData?: Module;
    onSubmit: (data: CreateModuleData | UpdateModuleData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ModuleForm({ moduleData, onSubmit, onCancel, isLoading }: ModuleFormProps) {
    const [formData, setFormData] = useState<CreateModuleData>({
        class_fk_id: typeof moduleData?.class_fk === 'object' ? moduleData.class_fk.id : '',
        module_name: moduleData?.module_name || '',
        code: moduleData?.code || '',
        semester_id: moduleData?.semester.id || '',
    });

    const { data: classesData } = useClasses();
    const classes = classesData?.results || [];

    const { data: semestersData } = useSemesters();
    const semesters = semestersData?.results || [];

    useEffect(() => {
        if (moduleData) {
            setFormData({
                class_fk_id: typeof moduleData.class_fk === 'object' ? moduleData.class_fk.id : '',
                module_name: moduleData.module_name,
                code: moduleData.code,
                semester_id: moduleData.semester.id,
            });
        }
    }, [moduleData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du module
                </label>
                <Input
                    type="text"
                    value={formData.module_name || ''}
                    onChange={(e) => setFormData({ ...formData, module_name: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder='Nom du module'
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code
                </label>
                <Input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder='Un code Module'
                />
            </div>
            <SingleSelectDropdown
                label="Classe"
                value={formData.class_fk_id}
                onChange={(value) => setFormData({ ...formData, class_fk_id: value })}
                options={classes.map(cls => ({
                    id: cls.id,
                    value: cls.id,
                     label: `${cls.class_name} - ${cls.department?.department_name || ''} - ${cls.department?.faculty?.faculty_abreviation || ''}`
                }))}
                placeholder="Sélectionnez une classe"
                required
            />

            <SingleSelectDropdown
                label="Semestre"
                value={formData.semester_id}
                onChange={(value) => setFormData({ ...formData, semester_id: value })}
                options={semesters.map(sem => ({ id: sem.id, value: sem.id, label: sem.name || `Semestre ${sem.number}` }))}
                placeholder="Sélectionnez un semestre"
                required
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
                    {isLoading ? 'En cours...' : moduleData ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}
