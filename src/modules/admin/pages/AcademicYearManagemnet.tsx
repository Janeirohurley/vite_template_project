import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import DataTable from '@/components/ui/DataTable';
import {
    useAcademicYears,
    useCreateAcademicYear,
    useUpdateAcademicYear,
    useDeleteAcademicYear,
} from '@/modules/admin/hooks/useAcademicEntities';
import type {
    AcademicYear,
    AcademicYearTableRow,
    CreateAcademicYearData,
    UpdateAcademicYearData,
} from '@/modules/admin/types/academicTypes';
import { mapAcademicYearToTableRow } from '@/modules/admin/types/academicTypes';
import { AcademicYearForm } from '@/modules/admin/components/academic/AcademicYearForm';
import { Modal } from '@/modules/admin/components/academic/Modal';
import { notify } from '@/lib';

export function AcademicYearManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    const itemsPerPage = 10;

    const queryClient = useQueryClient();
    const { data: academicYearsData, isLoading: academicYearsLoading, error: academicYearsError } = useAcademicYears({
        search: searchTerm
    });
    const createMutation = useCreateAcademicYear();
    const updateMutation = useUpdateAcademicYear();
    const deleteMutation = useDeleteAcademicYear();

    const academicYears = academicYearsData?.results || [];
    const tableData = academicYears.map(mapAcademicYearToTableRow);

    const yearsColumns = [
        { key: 'academic_year', label: 'Année Académique', sortable: true, editable: true, type: 'text' as const },
        { key: 'civil_year', label: 'Année Civile', sortable: true, editable: true, type: 'text' as const },
        { key: 'description', label: 'Description', sortable: false, editable: true, type: 'text' as const },
        { key: 'duration_display', label: 'Période', sortable: false, editable: false },
        { key: 'status_display', label: 'Statut', sortable: true, editable: false },
        { key: 'start_date', label: 'Date de début', sortable: true, editable: true, type: 'date' as const },
        { key: 'end_date', label: 'Date de fin', sortable: true, editable: true, type: 'date' as const },
    ];

    const handleEdit = (item: AcademicYearTableRow) => {
        const yearToEdit = academicYears.find(y => y.id === item.id);
        if (yearToEdit) {
            setEditingYear(yearToEdit);
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (item: AcademicYearTableRow) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'année académique "${item.academic_year}" ?`)) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(item.id);
            notify.success('Année académique supprimée avec succès');
        } catch (error) {
            notify.error('Erreur lors de la suppression de l\'année académique');
            console.error('Delete error:', error);
        }
    };

    const handleAdd = () => {
        setEditingYear(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: CreateAcademicYearData | UpdateAcademicYearData) => {
        try {
            if (editingYear) {
                await updateMutation.mutateAsync({
                    id: editingYear.id,
                    data: data as UpdateAcademicYearData,
                });
                notify.success('Année académique modifiée avec succès');
            } else {
                await createMutation.mutateAsync(data as CreateAcademicYearData);
                notify.success('Année académique créée avec succès');
            }
            setIsModalOpen(false);
            setEditingYear(null);
            queryClient.invalidateQueries({ queryKey: ['academicYears'] });
        } catch (error) {
            notify.error(editingYear
                ? 'Erreur lors de la modification de l\'année académique'
                : 'Erreur lors de la création de l\'année académique'
            );
            console.error('Submit error:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingYear(null);
    };

    const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
        const yearToUpdate = academicYears.find(y => y.id === rowId);
        if (!yearToUpdate) return;

        try {
            const updateData: UpdateAcademicYearData = {
                [columnKey]: newValue,
            };

            await updateMutation.mutateAsync({
                id: yearToUpdate.id,
                data: updateData,
            });

            notify.success('Année académique mise à jour avec succès');
            queryClient.invalidateQueries({ queryKey: ['academicYears'] });
        } catch (error) {
            notify.error('Erreur lors de la mise à jour de l\'année académique');
            console.error('Cell edit error:', error);
            throw error; // Re-throw to let DataTable handle the error state
        }
    };

    const isLoading = academicYearsLoading

    return (
        <div className="">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gestion des Années Académiques
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Gérez les années académiques de l'université
                </p>
            </div>

            <DataTable<AcademicYearTableRow>
                tableId="academic-years-table"
                data={tableData}
                columns={yearsColumns}
                getRowId={(row) => row.id}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onSearchChange={setSearchTerm}
                onEditRow={handleEdit}
                onDeleteRow={handleDelete}
                onAddRow={handleAdd}
                onCellEdit={handleCellEdit}
                isLoading={isLoading}
                error={academicYearsError ? 'Erreur lors du chargement des années académiques' : null}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCancel}
                title={editingYear ? 'Modifier l\'année académique' : 'Nouvelle année académique'}
            >
                <AcademicYearForm
                    academicYear={editingYear || undefined}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </div>
    );
}