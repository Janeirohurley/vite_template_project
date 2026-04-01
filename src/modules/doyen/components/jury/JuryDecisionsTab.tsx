/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import { useJuryDecisions } from '../../hooks/useJury';
import { useDoyenStore } from '../../store/doyenStore';
import type { JuryDecision } from '../../types/juryTypes';
import { StatsCard } from '@/components/ui/StatsCard';

export function JuryDecisionsTab() {
  const { selectedAcademicYear, selectedClass, selectedSemester } = useDoyenStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useJuryDecisions({
    academic_year: selectedAcademicYear || undefined,
    class_fk: selectedClass || undefined,
    semester: selectedSemester || undefined,
    search: searchTerm || undefined,
  });

  const decisions = data?.results || [];

  const stats = [
    { label: 'Total Décisions', value: data?.count || 0, change: 'décisions', icon: CheckCircle, color: 'purple' as const },
    { label: 'Admis', value: decisions.filter(d => d.decision === 'Admis').length, change: 'réussis', icon: CheckCircle, color: 'green' as const },
    { label: 'Ajournés', value: decisions.filter(d => d.decision === 'Ajourné').length, change: 'en attente', icon: AlertCircle, color: 'yellow' as const },
    { label: 'Redoublement', value: decisions.filter(d => d.decision === 'Redoublement').length, change: 'à refaire', icon: XCircle, color: 'red' as const },
  ];

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Admis': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Ajourné': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Redoublement': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const columns = [
    { key: 'student_matricule', label: 'Matricule', sortable: true, editable: false },
    { key: 'student_name', label: 'Étudiant', sortable: true, editable: false },
    {
      key: 'average_score',
      label: 'Moyenne',
      sortable: true,
      editable: false,
      render: (row: JuryDecision) => <span>{row.average_score.toFixed(2)}/20</span>,
    },
    {
      key: 'total_credits_obtained',
      label: 'Crédits',
      sortable: true,
      editable: false,
      render: (row: JuryDecision) => <span>{row.total_credits_obtained} ECTS</span>,
    },
    {
      key: 'decision',
      label: 'Décision',
      sortable: true,
      editable: false,
      render: (row: JuryDecision) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDecisionColor(row.decision)}`}>
          {row.decision}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Décisions de Jury</h3>

      <StatsGridLoader
        isPending={isLoading}
        data={stats}
        renderItem={(stat, index) => <StatsCard key={stat.label} {...stat} delay={index * 0.1} />}
      />

      <DataTable<JuryDecision>
        tableId="jury-decisions-table"
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
