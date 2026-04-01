/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useTeachers, useDeleteTeacher } from '../hooks';
import { useAttributions, useTeacherWorkloads } from '../hooks/useTimetable';
import { Mail, Phone, BookOpen, Users, Clock, TrendingUp, Check, X } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import { useAppStore } from '@/lib';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import type { ApiError } from '@/types';
import TeacherProposer from '../components/TeacherProposer';

type EntityType = 'teachers' | 'attributions' | 'workload';
export function TeachersPage() {
  const { selectedAcademicYear } = useAppStore();
  const [currentPage, setCurrentPage] = useState<Record<EntityType, number>>({
    teachers: 1,
    attributions: 1,
    workload: 1
  });
  const [itemsPerPage, setItemsPerPage] = useState<Record<EntityType, number>>({
    teachers: 10,
    attributions: 10,
    workload: 10
  });
  const [searchTerm, setSearchTerm] = useState<Record<EntityType, string>>({
    teachers: '',
    attributions: '',
    workload: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EntityType>('teachers');

  const [isOpen, setOpen] = useState(false)

  const { data:teachersData, isLoading: loadingTeachers } = useTeachers({
    academic_year_id: selectedAcademicYear?.id,
    pagination:true,
    page: currentPage.teachers,
    page_size: itemsPerPage.teachers,
    search: searchTerm.teachers || undefined,
  });


  const { data: attributionsData, isLoading: loadingAttributions } = useAttributions({
    academic_year_id: selectedAcademicYear?.id,
    pagination: true,
    page: currentPage.attributions,
    page_size: itemsPerPage.attributions,
    search: searchTerm.attributions || undefined,
  });

  const { data: workloadsData, isLoading: loadingWorkloads } = useTeacherWorkloads({
    academic_year_id: selectedAcademicYear?.id,
    pagination: true,
    page: currentPage.workload,
    page_size: itemsPerPage.workload,
    search: searchTerm.workload || undefined,
  });

  const deleteTeacherMutation = useDeleteTeacher();


  const teachers = teachersData?.results || [];
  const attributions = attributionsData?.results || [];
  const workloads = workloadsData?.results || [];

  const stats = [
    { label: 'Enseignants', value: teachers.length, change: 'actifs', icon: Users, color: 'blue' as const },
    { label: 'Attributions', value: attributions.length, change: 'cours', icon: BookOpen, color: 'green' as const },
    { label: 'Heures Totales', value: workloads.reduce((sum, w) => sum + w.total_hours, 0), change: 'planifiées', icon: Clock, color: 'purple' as const },
    { label: 'Taux Assignation', value: Math.round((workloads.reduce((sum, w) => sum + w.assigned_hours, 0) / workloads.reduce((sum, w) => sum + w.total_hours, 0)) * 100 || 0), change: '%', icon: TrendingUp, color: 'yellow' as const },
  ];

  const tabs = [
    { id: 'teachers' as EntityType, label: 'Enseignants' },
    { id: 'attributions' as EntityType, label: 'Attributions' },
    { id: 'workload' as EntityType, label: ' Charge Horaire' },
  ];


  const getColumns = () => {
    switch (activeTab) {
      case 'teachers':
        return [
          {
            key: "name",
            label: "Nom",
            render: (row: any) => `${row.user_obj.first_name} ${row.user_obj.last_name}`,
            editable: false,
            sortable: false
          },
          {
            key: "speciality",
            label: "Specialite",
            render: (row: any) => row.speciality ? `${row.speciality}` : '-',
            editable: false,
            sortable: false
          },
          {
            key: "teacher_grade",
            label: "Grade",
            editable: false,
            sortable: false
          },
          {
            key: "contact",
            label: "contact",
            render: (row: any) => {
              return (
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
              )
            },
            editable: false,
            sortable: false
          },
          {
            key: "url_cv",
            label: "CV",
            render: (row: any) =>
              row.url_cv ? (
                <a
                  className="text-blue-600 underline"
                  href={row.url_cv}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cliquer pour voir
                </a>
              ) : (
                <span className="text-gray-400">Aucun CV</span>
              ),
            editable: false,
            sortable: false
          }
          ,
          {
            key: "url_diploma",
            label: "Diplôme",
            render: (row: any) =>
              row.url_diploma !== null ? (
                <a
                  className="text-blue-600 underline"
                  href={row.url_diploma}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cliquer pour voir {row.url_diploma}
                </a>
              ) : (
                <span className="text-gray-400">Aucun diplôme</span>
              ),

            editable: false,
            sortable: false
          }



        ]
      case 'attributions':
        return [
          {
            key: "class_name",
            label: "classe",
            sortable: false,
            editable: false
          },
          {
            key: "department_name",
            label: "Departement",
            sortable: false,
            editable: false
          },
          {
            key: "course_name",
            label: "cours",
            sortable: false,
            editable: false
          },
          {
            key: "principal_teacher_name",
            label: "Enseignant principal",
            render: (row: any) => {
              const status = row.status_principal_teacher;

              return (
                <span className="inline-flex items-center gap-2">
                  <span>{row.principal_teacher_name}</span>

                  {status === "Accepted" && (
                    <Check size={16} className="text-green-600" />
                  )}

                  {status === "Pending" && (
                    <Clock size={16} className="text-yellow-500" />
                  )}

                  {status === "Refused" && (
                    <X size={16} className="text-red-600" />
                  )}
                </span>
              );
            },
            sortable: false,
            editable: false,
          },
          {
            key: "substitute_teacher_name",
            label: "Ensignant Suppléant",
            render: (row: any) => {
              const status = row.status_substitute_teacher 
              return (
                <span className="inline-flex items-center gap-2">
                  <span>{row.substitute_teacher_name}</span>

                  {status === "Accepted" && (
                    <Check size={16} className="text-green-600" />
                  )}

                  {status === "Pending" && (
                    <Clock size={16} className="text-yellow-500" />
                  )}

                  {status === "Refused" && (
                    <X size={16} className="text-red-600" />
                  )}
                </span>
              )
            },
            sortable: false,
            editable: false
          },
          {
            key: "date_attribution",
            label: "date d'attribution"
          },
          {
            key: "commentaire",
            label: "commentaire",
          }
        ]
      case 'workload':
        return [
          {
            key: "teacher_name",
            label: "Enseignant",

          },
          {
            key: "teacher_email",
            label: "email",

          },
          {
            key: "type",
            label: "type",
            render: (workload: any) => {
              return (
                <span className={`px-2 py-1 text-xs rounded-full ${workload.is_permanent ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>{workload.is_permanent ? 'Permanent' : 'Visiteur'}</span>
              )
            }

          },
          {
            key: "total_hours",
            label: "Heures Totales",

          },
          {
            key: "assigned_hours",
            label: "Heures Assignées",

          },
          {
            key: "percentage",
            label: "percentage",
            render: (workload: any) => {
              const percentage = Math.round((workload.assigned_hours / workload.total_hours) * 100);
              return (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-12">{percentage}%</span>
                </div>
              )
            }

          },
        ]
      default:
        return [];
    }
  }

  const isLoading = () => {
    switch (activeTab) {
      case 'teachers':
        return loadingTeachers
      case 'attributions':
        return loadingAttributions;
      case 'workload':
        return loadingWorkloads
      default:
        return false;
    }
  };
  const getCurrentData = () => {
    switch (activeTab) {
      case 'teachers':
        return teachersData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
      case 'attributions':
        return attributionsData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
      case 'workload':
        return workloadsData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
      default:
        return { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
    }
  };


  console.log('getCurrentData', getCurrentData());

  const handleDelete = (item: any) => {
    const onError = (err: any) => {
      const apiError = err.formattedError as ApiError;
      setError(apiError?.message || 'Erreur lors de la suppression');
    };

    switch (activeTab) {
      case 'teachers':
        deleteTeacherMutation.mutate(item.id, { onError });
        break;
      case 'attributions':
        return
        break;
      case 'workload':
        return
        break;
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Enseignants & Attributions</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérer le corps enseignant et suivre les attributions de cours
          </p>
        </div>
        {
          activeTab === "attributions" && <Button onClick={() => setOpen(true)} variant="outline" className='dark:bg-gray-800 dark:text-white dark:border-gray-500 cursor-pointer dark:hover:bg-gray-600' >
            Proposer un Enseignant
          </Button>
        }


      </div>

      <StatsGridLoader
        isPending={loadingTeachers || loadingAttributions || loadingWorkloads}
        data={stats}
        renderItem={(stat, index) => <StatsCard key={stat.label} {...stat} delay={index * 0.1} />}
      />


      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
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
            );
          })}
        </nav>
      </div>


      <DataTable<any>
        key={activeTab}
        tableId={`teachers-table-${activeTab}`}
        columns={getColumns() as any}
        data={getCurrentData()}
        onSearchChange={(value: string) => setSearchTerm(prev => ({ ...prev, [activeTab]: value }))}
        currentPage={currentPage[activeTab]}
        setCurrentPage={(page: number | ((prev: number) => number)) => setCurrentPage(prev => ({ ...prev, [activeTab]: typeof page === 'function' ? page(prev[activeTab]) : page }))}
        getRowId={(row: any) => row.id}
        isLoading={isLoading()}
        error={error}
        onDeleteRow={handleDelete}
        isPaginated={true}
        itemsPerPage={itemsPerPage[activeTab]}
        setItemsPerPage={(items: number | ((prev: number) => number)) => setItemsPerPage(prev => ({ ...prev, [activeTab]: typeof items === 'function' ? items(prev[activeTab]) : items }))}
      />

      <TeacherProposer isOpen={isOpen} setOpen={setOpen} />
    </div>
  );
}
