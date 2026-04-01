import { useState } from 'react';
import { useAcademicResults } from '../hooks';
import { useDoyenStore } from '../store/doyenStore';
import DataTable from '@/components/ui/DataTable';
import type { AcademicResult } from '../types';

export function AcademicResultsPage() {
  const { selectedAcademicYear, selectedSemester } = useDoyenStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<boolean | ''>('');

  const { data, isLoading } = useAcademicResults({
    academic_year: selectedAcademicYear || undefined,
    semester: selectedSemester || undefined,
    is_passed: statusFilter === '' ? undefined : statusFilter,
    search: searchTerm || undefined,
  });




  const columns = [
    {
      key: 'student_matricule',
      label: 'Matricule',
      sortable: true,
      editable: false,
    },
    {
      key: 'student_name',
      label: 'Étudiant',
      sortable: true,
      editable: false,
    },
    {
      key: 'course_name',
      label: 'Cours',
      sortable: true,
      editable: false,
    },
    {
      key: 'session_name',
      label: 'session',
      type: 'text' as const,
      sortable: true,
      editable: false,
    },
    {
      key: 'mark',
      label: 'Points',
      type: 'number' as const,
      sortable: true,
      editable: false,
      render: (row: AcademicResult) => (
        <span className="text-gray-900 dark:text-white">
          {row.mark ?? '-'}/20
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Résultats Académiques
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Examiner et gérer les résultats des étudiants
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <select
          value={statusFilter === '' ? '' : statusFilter ? 'true' : 'false'}
          onChange={(e) => {
            setStatusFilter(e.target.value === '' ? '' : e.target.value === 'true');
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les résultats</option>
          <option value="true">Admis uniquement</option>
          <option value="false">Échecs uniquement</option>
        </select>
      </div>

      <DataTable<AcademicResult>
        tableId="academic-results-table"
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
