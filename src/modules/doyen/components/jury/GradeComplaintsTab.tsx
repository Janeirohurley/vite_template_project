/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import StatsGridLoader from '@/components/ui/StatsGridLoader';

import { useGradeComplaints, useUpdateGradeComplaint } from '../../hooks/useJury';
import { useDoyenStore } from '../../store/doyenStore';
import { notify } from '@/lib';
import type { GradeComplaint } from '../../types/juryTypes';
import { StatsCard } from '@/components/ui/StatsCard';

export function GradeComplaintsTab() {
  const { selectedAcademicYear, selectedClass } = useDoyenStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGradeComplaints({
    academic_year: selectedAcademicYear || undefined,
    class_fk: selectedClass || undefined,
    search: searchTerm || undefined,
  });

  const updateMutation = useUpdateGradeComplaint();

  const complaints = data?.results || [];

  const stats = [
    { label: 'Total Réclamations', value: data?.count || 0, change: 'réclamations', icon: AlertCircle, color: 'purple' as const },
    { label: 'En Attente', value: complaints.filter(c => c.status === 'En attente').length, change: 'à traiter', icon: Clock, color: 'yellow' as const },
    { label: 'Acceptées', value: complaints.filter(c => c.status === 'Acceptée').length, change: 'validées', icon: CheckCircle, color: 'green' as const },
    { label: 'Rejetées', value: complaints.filter(c => c.status === 'Rejetée').length, change: 'refusées', icon: XCircle, color: 'red' as const },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Acceptée': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejetée': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate(
      { id, data: { status: status as 'En attente' | 'Acceptée' | 'Rejetée' } },
      {
        onSuccess: () => {
          notify.success('Statut mis à jour avec succès');
        },
        onError: (error: any) => {
          notify.error(error?.message || 'Erreur lors de la mise à jour');
        },
      }
    );
  };

  const columns = [
    { key: 'student_matricule', label: 'Matricule', sortable: true, editable: false },
    { key: 'student_name', label: 'Étudiant', sortable: true, editable: false },
    { key: 'course_name', label: 'Cours', sortable: true, editable: false },
    {
      key: 'complaint_date',
      label: 'Date',
      sortable: true,
      editable: false,
      render: (row: GradeComplaint) => (
        <span>{new Date(row.complaint_date).toLocaleDateString('fr-FR')}</span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      editable: false,
      render: (row: GradeComplaint) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(row.status)}`}
        >
          <option value="En attente">En attente</option>
          <option value="Acceptée">Acceptée</option>
          <option value="Rejetée">Rejetée</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Réclamations de Notes</h3>

      <StatsGridLoader
        isPending={isLoading}
        data={stats}
        renderItem={(stat, index) => <StatsCard key={stat.label} {...stat} delay={index * 0.1} />}
      />

      <DataTable<GradeComplaint>
        tableId="grade-complaints-table"
        columns={columns}
        data={data?.results || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 }}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isPaginated={true}
      />
    </div>
  );
}
