import { useState, useEffect } from 'react';
import type { Course, CreateCourseData, UpdateCourseData } from '../../types/academicTypes';
import { useModules } from '../../hooks/useAcademicEntities';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';

interface CourseFormProps {
    course?: Course;
    onSubmit: (data: CreateCourseData | UpdateCourseData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CourseForm({ course, onSubmit, onCancel, isLoading }: CourseFormProps) {
    const [formData, setFormData] = useState<CreateCourseData>({
        module_id: typeof course?.module === 'object' ? course.module.id : '',
        course_name: course?.course_name || '',
        cm: course?.cm || 0,
        td: course?.td || 0,
        tp: course?.tp || 0,
        credits: course?.credits || 0,
    });

    const { data: modulesData } = useModules();
    const modules = modulesData?.results || [];

    useEffect(() => {
        if (course) {
            setFormData({
                module_id: typeof course.module === 'object' ? course.module.id : '',
                course_name: course.course_name,
                cm: course.cm,
                td: course.td,
                tp: course.tp,
                credits: course.credits,
            });
        }
    }, [course]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const totalHours = formData.cm + formData.td + formData.tp;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du cours *
                </label>
                <input
                    type="text"
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                />
            </div>

            <SingleSelectDropdown
                label="Module"
                required
                options={modules.map(mod => ({
                    id: mod.id,
                    value: mod.id,
                    label: `${mod.module_name}- ${mod.code}- ${mod.class_fk.class_name} - ${mod.class_fk.department?.department_name || ''} - ${mod.class_fk.department?.faculty?.faculty_abreviation || ''}`
                }))}
                value={formData.module_id}
                onChange={(value) => setFormData({ ...formData, module_id: value })}
                placeholder="Sélectionnez un module"
            />

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Heures CM *
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.cm}
                        onChange={(e) => setFormData({ ...formData, cm: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Heures TD *
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.td}
                        onChange={(e) => setFormData({ ...formData, td: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Heures TP *
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.tp}
                        onChange={(e) => setFormData({ ...formData, tp: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Crédits *
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total heures
                    </label>
                    <input
                        type="text"
                        value={`${totalHours}h`}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                    />
                </div>
            </div>

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
                    {isLoading ? 'En cours...' : course ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}
