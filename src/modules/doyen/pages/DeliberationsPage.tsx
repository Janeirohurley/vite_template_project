/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useDeliberations, useDeliberation, useCreateDeliberation, useTeachers, useDeanClasses } from '../hooks';
import { useDoyenStore } from '../store/doyenStore';
import { Plus, Eye, Calendar, Users, CheckCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import { StatsCard } from '../components';
import { CreateDeliberationModal } from '../components/CreateDeliberationModal';
import type { Deliberation, DeliberationDecision, CreateDeliberationData } from '../types';
import { notify } from '@/lib';
import { useAcademicYears } from '@/modules/admin/hooks/useAcademicEntities';

export function DeliberationsPage() {
  const { selectedAcademicYear, selectedClass, selectedSemester } = useDoyenStore();
  const { data: academicYearsData } = useAcademicYears();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'Planifiée' | 'En cours' | 'Terminée' | ''>('');
  const [selectedDeliberation, setSelectedDeliberation] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useDeliberations({
    academic_year: selectedAcademicYear || undefined,
    class_fk: selectedClass || undefined,
    semester: selectedSemester || undefined,
    status: statusFilter || undefined,
    search: searchTerm || undefined,
  });

  const { data: deliberationDetail, isLoading: detailLoading } = useDeliberation(
    selectedDeliberation || ''
  );

  const { data: teachersData } = useTeachers({ pagination: false });
  const { data: classesData } = useDeanClasses();
  const createDeliberationMutation = useCreateDeliberation();

  const handleCreateDeliberation = (data: CreateDeliberationData) => {
    createDeliberationMutation.mutate(data, {
      onSuccess: () => {
        notify.success('Délibération créée avec succès');
        setIsCreateModalOpen(false);
      },
      onError: (error: any) => {
        notify.error(error?.formattedError?.message || 'Erreur lors de la création');
      },
    });
  };

  const deliberations = data?.results || [];

  const stats = [
    { 
      label: 'Total', 
      value: data?.count || 0, 
      change: 'délibérations', 
      icon: FileText, 
      color: 'purple' as const 
    },
    { 
      label: 'Planifiées', 
      value: deliberations.filter((d) => d.status === 'Planifiée').length, 
      change: 'à venir', 
      icon: Calendar, 
      color: 'blue' as const 
    },
    { 
      label: 'En Cours', 
      value: deliberations.filter((d) => d.status === 'En cours').length, 
      change: 'actives', 
      icon: Clock, 
      color: 'yellow' as const 
    },
    { 
      label: 'Terminées', 
      value: deliberations.filter((d) => d.status === 'Terminée').length, 
      change: 'complétées', 
      icon: CheckCircle, 
      color: 'green' as const 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Terminée':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Admis':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Ajourné':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Redoublement':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const deliberationColumns = [
    {
      key: 'class_name',
      label: 'Classe',
      sortable: true,
      editable: false,
    },
    {
      key: 'semester',
      label: 'Semestre',
      sortable: true,
      editable: false,
      render: (row: Deliberation) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Semestre {row.semester}
        </span>
      ),
    },
    {
      key: 'deliberation_date',
      label: 'Date',
      sortable: true,
      editable: false,
      render: (row: Deliberation) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(row.deliberation_date).toLocaleDateString('fr-FR')}
          </span>
        </div>
      ),
    },
    {
      key: 'decisions_count',
      label: 'Décisions',
      sortable: false,
      editable: false,
      render: (row: Deliberation) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.decisions.length} décision(s)
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      editable: false,
      render: (row: Deliberation) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const decisionColumns = [
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
      key: 'average_score',
      label: 'Moyenne',
      sortable: true,
      editable: false,
      render: (row: DeliberationDecision) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.average_score.toFixed(2)}/20
        </span>
      ),
    },
    {
      key: 'total_credits_obtained',
      label: 'Crédits',
      sortable: true,
      editable: false,
      render: (row: DeliberationDecision) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.total_credits_obtained} ECTS
        </span>
      ),
    },
    {
      key: 'decision',
      label: 'Décision',
      sortable: true,
      editable: false,
      render: (row: DeliberationDecision) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDecisionColor(row.decision)}`}>
          {row.decision}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Délibérations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérer les jurys de délibération et valider les décisions
          </p>
        </div>
        <Button variant="link" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Créer Délibération
        </Button>
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
          <option value="Planifiée">Planifiée</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
        </select>
      </div>

      <DataTable<Deliberation>
        tableId="deliberations-list-table"
        columns={deliberationColumns}
        data={data?.results || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 }}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isPaginated={true}
        renderActions={(row) => (
          <button
            onClick={() => setSelectedDeliberation(row.id)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Voir détails"
          >
            <Eye size={16} className="text-blue-600 dark:text-blue-400" />
          </button>
        )}
      />

      {/* Modal de détails */}
      {selectedDeliberation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {detailLoading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : deliberationDetail ? (
              <>
                {/* Header */}
                <div className="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {deliberationDetail.class_name} - Semestre {deliberationDetail.semester}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Date: {new Date(deliberationDetail.deliberation_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(deliberationDetail.status)}`}>
                        {deliberationDetail.status}
                      </span>
                      <button
                        onClick={() => setSelectedDeliberation(null)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span className="text-2xl text-gray-500 dark:text-gray-400">&times;</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Membres du Jury
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {deliberationDetail.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg"
                        >
                          <Users size={14} className="text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {member.teacher_name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({member.role})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Décisions ({deliberationDetail.decisions.length})
                  </h4>
                  <DataTable<DeliberationDecision>
                    tableId="deliberation-decisions-table"
                    columns={decisionColumns}
                    data={deliberationDetail.decisions}
                      onSearchChange={setSearchTerm}
                    currentPage={1}
                    setCurrentPage={() => {}}
                    itemsPerPage={deliberationDetail.decisions.length}
                    getRowId={(row) => row.id}
                    isLoading={false}
                    isPaginated={false}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal de création */}
      <CreateDeliberationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDeliberation}
        isLoading={createDeliberationMutation.isPending}
        teachers={teachersData?.results || []}
        classes={classesData?.results || []}
        academicYears={academicYearsData?.results || []}
      />
    </div>
  );
}
