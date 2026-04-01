/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import type { Class, CreateClassData, UpdateClassData, CreateClassGroupData } from '../../types/academicTypes';
import { useDepartments, useAcademicYears, useClassGroupsByClass, useCreateClassGroup, useDeleteClassGroup } from '../../hooks/useAcademicEntities';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { Input } from '@/components/ui/input';

interface ClassFormWithGroupsProps {
    classData?: Class;
    onSubmit: (data: CreateClassData | UpdateClassData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ClassFormWithGroups({ classData, onSubmit, onCancel, isLoading }: ClassFormWithGroupsProps) {
    const [formData, setFormData] = useState<CreateClassData>({
        class_name: classData?.class_name || '',
        department_id: classData?.department?.id || '',
    });

    // Pour la gestion des groupes
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');

    const { data: departmentsData } = useDepartments();
    const departments = departmentsData?.results || [];

    const { data: academicYearsData } = useAcademicYears();
    const academicYears = academicYearsData?.results || [];

    const { data: classGroups, refetch: refetchGroups } = useClassGroupsByClass(classData?.id || '');
    const createGroupMutation = useCreateClassGroup();
    const deleteGroupMutation = useDeleteClassGroup();

    useEffect(() => {
        if (classData && classData.department) {
            setFormData({
                class_name: classData.class_name,
                department_id: classData.department.id,
            });
        }
    }, [classData]);

    useEffect(() => {
        // Sélectionner l'année académique actuelle par défaut
        if (academicYears.length > 0 && !selectedAcademicYear) {
            const currentYear = academicYears.find(y => y.is_current);
            if (currentYear) {
                setSelectedAcademicYear(currentYear.id);
            } else {
                setSelectedAcademicYear(academicYears[0].id);
            }
        }
    }, [academicYears, selectedAcademicYear]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleAddGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!classData?.id || !newGroupName || !selectedAcademicYear) return;

        const groupData: CreateClassGroupData = {
            class_fk: classData.id,
            group_name: newGroupName,
            academic_year: selectedAcademicYear,
        };

        createGroupMutation.mutate(groupData, {
            onSuccess: () => {
                setNewGroupName('');
                refetchGroups();
            },
        });
    };

    const handleDeleteGroup = (groupId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) return;

        deleteGroupMutation.mutate(groupId, {
            onSuccess: () => {
                refetchGroups();
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Formulaire de la classe */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom de la classe *
                    </label>
                    <Input
                        type="text"
                        value={formData.class_name}
                        onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        placeholder='Nom de la classe'
                    />
                </div>
                <SingleSelectDropdown
                    label='Département'
                    required
                    value={formData.department_id}
                    onChange={(value) => setFormData({ ...formData, department_id: value })}
                    options={departments.map(dept => ({
                        id: dept.id,
                        value: dept.id,
                        label: `${dept.department_name} (${dept.faculty.faculty_abreviation})`
                    }))}
                    placeholder="Sélectionnez un département"
                />
                

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                        {isLoading ? 'En cours...' : classData ? 'Modifier' : 'Créer'}
                    </button>
                </div>
            </form>

            {/* Section des groupes - uniquement en mode édition */}
            {classData && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Groupes de la classe
                    </h4>

                    {/* Liste des groupes existants */}
                    {classGroups && classGroups.length > 0 && (
                        <div className="mb-4 space-y-2">
                            {classGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {group.group_name} - {group.academic_year_name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        disabled={deleteGroupMutation.isPending}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Formulaire d'ajout de groupe */}
                    <form onSubmit={handleAddGroup} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nom du groupe
                                </label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="Ex: G1, G2, Groupe A..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Année académique
                                </label>
                                <select
                                    value={selectedAcademicYear}
                                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                >
                                    {academicYears.map((year) => (
                                        <option key={year.id} value={year.id}>
                                            {year.civil_year} {year.is_current && '(Actuelle)'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                            disabled={!newGroupName || !selectedAcademicYear || createGroupMutation.isPending}
                        >
                            {createGroupMutation.isPending ? 'Ajout en cours...' : 'Ajouter un groupe'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
