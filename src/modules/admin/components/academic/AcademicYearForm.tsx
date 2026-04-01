import { useState, useEffect } from 'react';
import type { AcademicYear, CreateAcademicYearData, UpdateAcademicYearData } from '../../types/academicTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

interface AcademicYearFormProps {
    academicYear?: AcademicYear;
    onSubmit: (data: CreateAcademicYearData | UpdateAcademicYearData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function AcademicYearForm({ academicYear, onSubmit, onCancel, isLoading }: AcademicYearFormProps) {
    const [formData, setFormData] = useState<CreateAcademicYearData>({
        academic_year: academicYear?.academic_year || '',
        description: academicYear?.description || '',
        civil_year: academicYear?.civil_year || new Date().getFullYear().toString(),
        start_date: academicYear?.start_date || '',
        end_date: academicYear?.end_date || '',
    });

    useEffect(() => {
        if (academicYear) {
            setFormData({
                academic_year: academicYear.academic_year,
                description: academicYear.description,
                civil_year: academicYear.civil_year,
                start_date: academicYear.start_date,
                end_date: academicYear.end_date,
            });
        }
    }, [academicYear]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Année Académique *
                </label>
                <Input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: 2023/2024"
                    required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: YYYY/YYYY
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Année Civile *
                </label>
                <Input
                    type="text"
                    value={formData.civil_year}
                    onChange={(e) => setFormData({ ...formData, civil_year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: 2024"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                </label>
                <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Description de l'année académique..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomDatePicker
                    label="Date de début"
                    value={formData.start_date}
                    onChange={(date) => setFormData({ ...formData, start_date: date })}
                    placeholder="Sélectionner la date de début"
                    required
                    allowManualInput={true}
                />

                <CustomDatePicker
                    label="Date de fin"
                    value={formData.end_date}
                    onChange={(date) => setFormData({ ...formData, end_date: date })}
                    placeholder="Sélectionner la date de fin"
                    required
                    allowManualInput={true}
                />
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
                    {isLoading ? 'En cours...' : academicYear ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}
