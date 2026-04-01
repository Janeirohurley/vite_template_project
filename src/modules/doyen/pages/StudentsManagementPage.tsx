/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useDeanStudents, useStudentGroups, useDeleteStudentGroup, useAssignStudentsToGroup } from '../hooks';
import { Mail, Phone, Users, GraduationCap, BookOpen, UserCheck, Plus, Edit2 } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import { useAppStore, notify } from '@/lib';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { StudentFilters, type FilterValues } from '../components/StudentFilters';
import { GroupManagementModal } from '../components/GroupManagementModal';
import { AssignGroupModal } from '../components/AssignGroupModal';
 
import type { DeanStudent, StudentGroup } from '../types';
import type { ApiError } from '@/types';
import { UserAvatar } from '@/components/common/UserAvatar';

type EntityType = 'students' | 'groups';

export function StudentsManagementPage() {
  const { selectedAcademicYear } = useAppStore();
  const [currentPage, setCurrentPage] = useState<Record<EntityType, number>>({
    students: 1,
    groups: 1
  });
  const [itemsPerPage, setItemsPerPage] = useState<Record<EntityType, number>>({
    students: 10,
    groups: 10
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EntityType>('students');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudentGroup | null>(null);
  const [isAssignGroupModalOpen, setIsAssignGroupModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const { data: studentsData, isLoading: loadingStudents } = useDeanStudents({
    academic_year_id: selectedAcademicYear?.id,
    pagination: true,
    page: currentPage.students,
    page_size: itemsPerPage.students,
    search: searchTerm || undefined,
    ...filters,
  });

  const { data: groupsData, isLoading: loadingGroups } = useStudentGroups({
    academic_year_id: selectedAcademicYear?.id,
    pagination: true,
    page: currentPage.groups,
    page_size: itemsPerPage.groups,
    class_id: filters.class_id,
  });

  const deleteGroupMutation = useDeleteStudentGroup();
  const assigngroupe = useAssignStudentsToGroup()

  const students = studentsData?.results || [];



  // Calculer les statistiques
  const activeStudents = students.filter(
    s => s.inscription_status === 'Active'
  ).length;

  const inactiveStudents = students.filter(
    s => s.inscription_status === 'Inactive'
  ).length;

  const stats = [
    {
      label: 'Total Étudiants',
      value: studentsData?.count || 0,
      change: 'inscrits',
      icon: Users,
      color: 'blue' as const
    },
    {
      label: 'Actifs',
      value: activeStudents,
      change: 'en cours',
      icon: UserCheck,
      color: 'green' as const
    },
    {
      label: 'Groupes',
      value: groupsData?.count || 0,
      change: 'créés',
      icon: BookOpen,
      color: 'purple' as const
    },
    {
      label: 'Inactifs',
      value: inactiveStudents,
      change: 'retirés',
      icon: GraduationCap,
      color: 'yellow' as const
    },
  ];

  const tabs = [
    { id: 'students' as EntityType, label: 'Étudiants' },
    { id: 'groups' as EntityType, label: 'Groupes' },
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'Suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStudentColumns = () => [
    {
      key: "profile_picture",
      label: "Photo",
      render: (row: DeanStudent) => (
        <UserAvatar
          size="sm"
          fullName={ row.user_obj.first_name + ' ' + row.user_obj.last_name }
          imageUrl={row.user_obj.profile_picture}
          
        />  
      ),
      editable: false,
      sortable: false 
    },
    {
      key: "matricule",
      label: "Matricule",
      editable: false,
      sortable: true
    },
    {
      key: "name",
      label: "Nom Complet",
      render: (row: DeanStudent) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {row.user_obj.first_name} {row.user_obj.last_name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.user_obj.gender === 'M' ? 'Masculin' : 'Féminin'}
          </span>
        </div>
      ),
      editable: false,
      sortable: false
    },
    {
      key: "contact",
      label: "Contact",
      render: (row: DeanStudent) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail size={14} />
            {row.user_obj.email}
          </div>
          {row.user_obj.phone_number && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone size={14} />
              {row.user_obj.phone_number}
            </div>
          )}
        </div>
      ),
      editable: false,
      sortable: false
    },
    {
      key: "class",
      label: "Classe",
      render: (row: DeanStudent) => (
        <span className="text-sm">
          {row.current_class?.class_name || '-'}
        </span>
      ),
      editable: false,
      sortable: false
    },
    {
      key: "groups",
      label: "Groupe",
      render: (row: DeanStudent) => {
        if (!row.student_group || row.student_group.name === null) {
          return <span className="text-sm text-gray-400">Aucun groupe</span>;
        }
        return (
          <span
            className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full"
          >
            {row.student_group.name}
          </span>
        );
      },
      editable: false,
      sortable: false
    },
    {
      key: "colline",
      label: "Colline",
      render: (row: DeanStudent) => (
        <span className="text-sm">
          {row.colline?.map((c)=>c.colline_name) || '-'}
        </span>
      ),
      editable: false,
      sortable: false
    },
    {
      key: "status",
      label: "Statut",
      render: (row: DeanStudent) => {
        const status = row.inscription_status || 'Non inscrit';
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
      editable: false,
      sortable: false
    },
  ];

  const getGroupColumns = () => [
    {
      key: "group_name",
      label: "Nom du groupe",
      editable: false,
      sortable: true
    },
    {
      key: "class_name",
      label: "Classe",
      editable: false,
      sortable: true
    },
    {
      key: "department_name",
      label: "Departement",
      editable: false,
      sortable: true
    },
    {
      key: "student_count",
      label: "Nombre d'étudiants",
      render: (row: StudentGroup) => (
        <span className="inline-flex items-center gap-1">
          <Users size={14} />
          {row.student_count || 0}
        </span>
      ),
      editable: false,
      sortable: true
    },
    {
      key: "academic_year_name",
      label: "Année académique",
      editable: false,
      sortable: false,
      render:()=>(
        <span>{selectedAcademicYear?.academic_year}</span>
      )
    },
    {
      key: "created_date",
      label: "Date de création",
      render: (row: StudentGroup) => {
        return new Date(row.created_date).toLocaleDateString('fr-FR');
      },
      editable: false,
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: StudentGroup) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedGroup(row);
              setIsGroupModalOpen(true);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="Modifier"
          >
            <Edit2 size={16} />
          </button>
          
        </div>
      ),
      editable: false,
      sortable: false
    }
  ];

  const handleDeleteGroup = (row: any) => {
      const onError = (err: any) => {
        const apiError = err.formattedError as ApiError;
        setError(apiError?.message || 'Erreur lors de la suppression du groupe');
      };
    deleteGroupMutation.mutate(row.id, { onError });
    
  };

  const isLoading = () => {
    switch (activeTab) {
      case 'students':
        return loadingStudents;
      case 'groups':
        return loadingGroups;
      default:
        return false;
    }
  };



  const getCurrentData = () => {
    switch (activeTab) {
      case 'students':
        return studentsData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
      case 'groups':
        return groupsData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
      default:
        return { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
    }
  };

  const getColumns = () => {
    switch (activeTab) {
      case 'students':
        return getStudentColumns();
      case 'groups':
        return getGroupColumns();
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Étudiants 
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérer les étudiants et les groupes de votre faculté
          </p>
        </div>
        {activeTab === 'groups' && (
          <Button
            onClick={() => {
              setSelectedGroup(null);
              setIsGroupModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Créer un groupe
          </Button>
        )}
      </div>

      <StatsGridLoader
        isPending={loadingStudents}
        data={stats}
        renderItem={(stat, index) => <StatsCard key={stat.label} {...stat} delay={index * 0.1} />}
      />

      {/* Filtres */}
      {activeTab === 'students' && (
        <StudentFilters
          onFilterChange={(newFilters) => setFilters(newFilters)}
          onClearFilters={() => setFilters({})}
        />
      )}

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm("");
                setError(null);
              }}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <DataTable<any>
        key={activeTab}
        tableId={`dean-${activeTab}-table`}
        columns={getColumns() as any}
        data={getCurrentData()}
        onSearchChange={setSearchTerm}
        currentPage={currentPage[activeTab]}
        setCurrentPage={(page: number | ((prev: number) => number)) => setCurrentPage(prev => ({ ...prev, [activeTab]: typeof page === 'function' ? page(prev[activeTab]) : page }))}
        itemsPerPage={itemsPerPage[activeTab]}
        setItemsPerPage={(items: number | ((prev: number) => number)) => setItemsPerPage(prev => ({ ...prev, [activeTab]: typeof items === 'function' ? items(prev[activeTab]) : items }))}
        getRowId={(row: any) => row.id}
        isLoading={isLoading()}
        error={error}
        onDeleteRow={activeTab === 'students' ? () => {
          setError("La suppression d'étudiants n'est pas autorisée pour les doyens");
        } : handleDeleteGroup}
        bulkActions={activeTab === 'students' ? [
          {
            key: 'assign-group',
            label: 'Mettre dans un groupe',
            icon: <Users size={16} />, // icône Lucide
            color: 'bg-purple-600 hover:bg-purple-700 text-white',
            onClick: (selectedIds) => {
              setSelectedStudentIds(Array.from(selectedIds));
              setIsAssignGroupModalOpen(true);
            },
            title: 'Assigner à un groupe',
          },
        ] : undefined}
        isPaginated={true}
          
           
      />

      {/* Modal de gestion des groupes */}
      <GroupManagementModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
        onSuccess={() => {
          setError(null);
        }}
      /> 
      
      <AssignGroupModal
              isOpen={isAssignGroupModalOpen}
              onClose={() => {
                setIsAssignGroupModalOpen(false);
                setSelectedStudentIds([]);
              }}
              students={students.filter(s => selectedStudentIds.includes(s.id))}
              groups={groupsData?.results || []}
              isLoading={assigngroupe.isPending}
              onAssign={(groupId, studentIds, mode) => {
                if(mode === "assign"){
                  assigngroupe.mutate(
                    {group_id:groupId,student_ids:studentIds},
                    {
                      onSuccess: () => {
                        notify.success(`${studentIds.length} étudiant(s) assigné(s) avec succès`);
                        setIsAssignGroupModalOpen(false);
                        setSelectedStudentIds([]);
                      },
                      onError: (err: ApiError) => {
                        const apiError = err ;
                        notify.error(apiError?.message || 'Erreur lors de l\'assignation');
                      }
                    }
                  );
                }
              }}
              onStudentsChange={(studentIds) => {
                setSelectedStudentIds(studentIds);
              }}
            />
    </div>
  );
}
