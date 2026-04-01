/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Plus, Calendar, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import { CreateJurySessionModal } from './CreateJurySessionModal';
import { useJurySessions, useCreateJurySession } from '../../hooks/useJury';
import { notify } from '@/lib';
import type { JurySession, CreateJurySessionData } from '../../types/juryTypes';
import { StatsCard } from '@/components/ui/StatsCard';

export function JurySessionsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useJurySessions({
    search: searchTerm || undefined,
  });

  const createMutation = useCreateJurySession();

  const handleCreate = (data: CreateJurySessionData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        notify.success('Session de jury créée avec succès');
        setIsCreateModalOpen(false);
      },
      onError: (error: any) => {
        notify.error(error?.message || 'Erreur lors de la création');
      },
    });
  };

  const sessions = data?.results || [];

  const stats = [
    { label: 'Total Sessions', value: data?.count || 0, change: 'sessions', icon: FileText, color: 'purple' as const },
    { label: 'Planifiées', value: sessions.filter(s => s.status === 'scheduled').length, change: 'à venir', icon: Calendar, color: 'blue' as const },
    { label: 'En Cours', value: sessions.filter(s => s.status === 'in_progress').length, change: 'actives', icon: Users, color: 'yellow' as const },
    { label: 'Terminées', value: sessions.filter(s => s.status === 'completed').length, change: 'complétées', icon: FileText, color: 'green' as const },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'in_progress': return 'En Cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const columns = [
    { key: 'session_name', label: 'Nom de Session', sortable: true, editable: false },
    { key: 'class_group_name', label: 'Groupe', sortable: true, editable: false },
    { key: 'class_name', label: 'Classe', sortable: true, editable: false },
    {
      key: 'session_date',
      label: 'Date',
      sortable: true,
      editable: false,
      render: (row: JurySession) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{new Date(row.session_date).toLocaleDateString('fr-FR')}</span>
        </div>
      ),
    },
    {
      key: 'jury_members',
      label: 'Membres du Jury',
      sortable: false,
      editable: false,
      render: (row: JurySession) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-400" />
          <span>{row.jury_members.length} membre(s)</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      editable: false,
      render: (row: JurySession) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
          {getStatusLabel(row.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Sessions de Jury</h3>
        <Button variant="link" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Créer Session
        </Button>
      </div>

      <StatsGridLoader
        isPending={isLoading}
        data={stats}
        renderItem={(stat, index) => <StatsCard key={stat.label} {...stat} delay={index * 0.1} />}
      />

      <DataTable<JurySession>
        tableId="jury-sessions-table"
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

      <CreateJurySessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
