import { useState } from 'react';
import { useCourseProgress } from '../hooks';
import { useDoyenStore } from '../store/doyenStore';
import { StatsCard } from '../components';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import DataTable from '@/components/ui/DataTable';
import type { CourseProgress } from '../types';




export function CourseProgressPage() {
  const { selectedAcademicYear, selectedClass } = useDoyenStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'En retard' | 'Dans les délais' | 'Avance' | ''>('');

  const { data, isLoading } = useCourseProgress({
    academic_year: selectedAcademicYear || undefined,
    class_fk: selectedClass || undefined,
    status: statusFilter || undefined,
    search: searchTerm || undefined,
  });

  const progress = data?.results || [];


  const stats = [
    { label: 'Total Cours', value: data?.count || 0, change: 'actifs', icon: TrendingUp, color: 'blue' as const },
    { label: 'En Retard', value: progress.filter((p) => p.status === 'En retard').length, change: 'cours', icon: AlertTriangle, color: 'red' as const },
    { label: 'Dans les Délais', value: progress.filter((p) => p.status === 'Dans les délais').length, change: 'cours', icon: CheckCircle, color: 'green' as const },
    { label: 'En Avance', value: progress.filter((p) => p.status === 'Avance').length, change: 'cours', icon: Clock, color: 'purple' as const },
  ];

  const columns = [ 
    {
      key: 'teacher_name',
      label: 'Enseignant',
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
      key: 'class_name',
      label: 'Classe',
      sortable: true,
      editable: false,
    },
    {
      key: 'progress_percentage',
      label: 'Progression',
      render: (row: CourseProgress) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 max-w-[150px]">
            <div
              className={`h-2 rounded-full ${
                row.status === 'En retard'
                  ? 'bg-red-600'
                  : row.status === 'Dans les délais'
                  ? 'bg-green-600'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${row.progress_percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {row.progress_percentage}%
          </span>
        </div>
      ),
      sortable: false,
      editable: false,
    },
    {
      key: 'last_updated',
      label: 'Derniere mise a jour',
      render: (row: CourseProgress) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold space-x-1`}
        >
          {new Date(row.last_updated).toLocaleDateString()} 
          {" "}
          {new Date(row.last_updated).toLocaleTimeString() }
        </span>
      ),
      sortable: true,
      editable: false,
    },
  ];



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Suivi de Progression des Cours
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Suivre le déroulement des enseignements
        </p>
      </div>

      <StatsGridLoader
        isPending={isLoading}
        data={stats}
        renderItem={(stat, index) => <StatsCard key={stat.label} {...stat} delay={index * 0.1} />}
      />


      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as typeof statusFilter);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les statuts</option>
          <option value="En retard">En retard</option>
          <option value="Dans les délais">Dans les délais</option>
          <option value="Avance">En avance</option>
        </select>
      </div>

      <DataTable<CourseProgress>
        tableId="course-progress-table"
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
