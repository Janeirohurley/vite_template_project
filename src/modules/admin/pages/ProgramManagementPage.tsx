/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/api";
import {
    useFaculties,
    useCreateFaculty,
    useUpdateFaculty,
    useDeleteFaculty,
    useDepartments,
    useCreateDepartment,
    useUpdateDepartment,
    useDeleteDepartment,
    useClasses,
    useCreateClass,
    useUpdateClass,
    useDeleteClass,
    useModules,
    useCreateModule,
    useUpdateModule,
    useDeleteModule,
    useCourses,
    useCreateCourse,
    useUpdateCourse,
    useDeleteCourse,
    useTypeFormations,
} from "../hooks/useAcademicEntities";
import type {
    Faculty,
    Department,
    Class,
    Module,
    Course,
    CreateFacultyData,
    UpdateFacultyData,
    CreateDepartmentData,
    UpdateDepartmentData,
    CreateClassData,
    UpdateClassData,
    CreateModuleData,
    UpdateModuleData,
    CreateCourseData,
    UpdateCourseData,
} from "../types/academicTypes";
import { FacultyForm } from "../components/academic/FacultyForm";
import { DepartmentForm } from "../components/academic/DepartmentForm";
import { ClassFormWithGroups } from "../components/academic/ClassFormWithGroups";
import { ModuleForm } from "../components/academic/ModuleForm";
import { CourseForm } from "../components/academic/CourseForm";
import { Modal } from "../components/academic/Modal";
import { EntityStatistics } from "../components/academic/EntityStatistics";
import { useDebounce } from "@/hooks/useDebounce";
import { transform } from "@/components/common/transformAny";
import DataTable from "@/components/ui/DataTable";
import { PageHeader } from "../components/PageHeader";

type EntityType = 'faculty' | 'department' | 'class' | 'module' | 'course';

export function ProgramManagementPage() {
    const [activeTab, setActiveTab] = useState<EntityType>('faculty');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("");
    const [backendFilter, setbackendFilter] = useState({})
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Faculty | Department | Class | Module | Course | null>(null);
    // Debounce search term pour éviter les requêtes excessives
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    // Query client pour les mises à jour optimistes
    const queryClient = useQueryClient();
    const { data: typeFormationsData } = useTypeFormations();
    const typeFormations = typeFormationsData?.results || [];

    function getFilterOption(backendFilter: object) {
        switch (activeTab) {
            case "faculty":
                return backendFilter
            case "class":
                return backendFilter
            case "module":
                return backendFilter
            case "course":
                return backendFilter
            case "department":
                return backendFilter
            default:
                return {}
        }
    }
    // Faculty hooks
    const { data: facultiesData, isLoading: facultiesLoading, refetch: refetchFaculties } = useFaculties({
        page: activeTab === 'faculty' ? currentPage : 1,
        search: activeTab === 'faculty' ? debouncedSearchTerm : '',
        page_size: activeTab === 'faculty' ? itemsPerPage : 10,
        ...getFilterOption(backendFilter)

    });
    const createFacultyMutation = useCreateFaculty();
    const updateFacultyMutation = useUpdateFaculty();
    const deleteFacultyMutation = useDeleteFaculty();

    // Department hooks
    const { data: departmentsData, isLoading: departmentsLoading, refetch: refetchDepartments } = useDepartments({
        page: activeTab === 'department' ? currentPage : 1,
        search: activeTab === 'department' ? debouncedSearchTerm : '',
        page_size: activeTab === 'department' ? itemsPerPage : 10,
        ...getFilterOption(backendFilter)

    });
    const createDepartmentMutation = useCreateDepartment();
    const updateDepartmentMutation = useUpdateDepartment();
    const deleteDepartmentMutation = useDeleteDepartment();

    // Class hooks
    const { data: classesData, isLoading: classesLoading, refetch: refetchClasses } = useClasses({
        page: activeTab === 'class' ? currentPage : 1,
        search: activeTab === 'class' ? debouncedSearchTerm : '',
        page_size: activeTab === 'class' ? itemsPerPage : 10,
        ...getFilterOption(backendFilter)

    });
    const createClassMutation = useCreateClass();
    const updateClassMutation = useUpdateClass();
    const deleteClassMutation = useDeleteClass();

    // Module hooks
    const { data: modulesData, isLoading: modulesLoading, refetch: refetchModules } = useModules({
        page: activeTab === 'module' ? currentPage : 1,
        search: activeTab === 'module' ? debouncedSearchTerm : '',
        page_size: activeTab === 'module' ? itemsPerPage : 10,
        ...getFilterOption(backendFilter)

    });
    const createModuleMutation = useCreateModule();
    const updateModuleMutation = useUpdateModule();
    const deleteModuleMutation = useDeleteModule();

    // Course hooks
    const { data: coursesData, isLoading: coursesLoading, refetch: refetchCourses } = useCourses({
        page: activeTab === 'course' ? currentPage : 1,
        search: activeTab === 'course' ? debouncedSearchTerm : '',
        page_size: activeTab === 'course' ? itemsPerPage : 10,
        ...getFilterOption(backendFilter)

    });
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();
    const deleteCourseMutation = useDeleteCourse();

    // Get current data based on active tab
    const getCurrentData = () => {
        switch (activeTab) {
            case 'faculty':
                return facultiesData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
            case 'department':
                return departmentsData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
            case 'class':
                return classesData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
            case 'module':
                return modulesData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
            case 'course':
                return coursesData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
            default:
                return { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 };
        }
    };

    const isLoading = () => {
        switch (activeTab) {
            case 'faculty':
                return facultiesLoading || createFacultyMutation.isPending || updateFacultyMutation.isPending || deleteFacultyMutation.isPending;
            case 'department':
                return departmentsLoading || createDepartmentMutation.isPending || updateDepartmentMutation.isPending || deleteDepartmentMutation.isPending;
            case 'class':
                return classesLoading || createClassMutation.isPending || updateClassMutation.isPending || deleteClassMutation.isPending;
            case 'module':
                return modulesLoading || createModuleMutation.isPending || updateModuleMutation.isPending || deleteModuleMutation.isPending;
            case 'course':
                return coursesLoading || createCourseMutation.isPending || updateCourseMutation.isPending || deleteCourseMutation.isPending;
            default:
                return false;
        }
    };

    const handleRefresh = () => {
        switch (activeTab) {
            case 'faculty':
                refetchFaculties();
                break;
            case 'department':
                refetchDepartments();
                break;
            case 'class':
                refetchClasses();
                break;
            case 'module':
                refetchModules();
                break;
            case 'course':
                refetchCourses();
                break;
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Faculty | Department | Class | Module | Course) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };
    const getApiFieldName = (key: string): string => {
        const fieldMap: Record<string, string> = {
            'types': 'types_id',
            'faculty': 'faculty_id',
            'department': 'department_id',
            'class_fk': 'class_id',
            'module': 'module_id',
        };
        return fieldMap[key] || key;
    };
    const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
        // Utiliser l'API axios académique
        const axiosInstance = (await import('../api/axiosAcademic')).default;

        try {
            let endpoint = '';
            let queryKey: any[] = [];

            switch (activeTab) {
                case 'faculty':
                    endpoint = `/faculties/${rowId}/`;
                    queryKey = ['faculties', { page: currentPage, search: debouncedSearchTerm }];
                    break;
                case 'department':
                    endpoint = `/departments/${rowId}/`;
                    queryKey = ['departments', { page: currentPage, search: debouncedSearchTerm }];
                    break;
                case 'class':
                    endpoint = `/classes/${rowId}/`;
                    queryKey = ['classes', { page: currentPage, search: debouncedSearchTerm }];
                    break;
                case 'module':
                    endpoint = `/modules/${rowId}/`;
                    queryKey = ['modules', { page: currentPage, search: debouncedSearchTerm }];
                    break;
                case 'course':
                    endpoint = `/courses/${rowId}/`;
                    queryKey = ['courses', { page: currentPage, search: debouncedSearchTerm }];
                    break;
            }

            // Faire la requête PATCH
            await axiosInstance.patch(endpoint, { [getApiFieldName(columnKey)]: newValue });

            // Invalider et rafraîchir les données en arrière-plan
            // Cela force un refetch sans déclencher de loading global dans le DataTable
            await queryClient.invalidateQueries({ queryKey, refetchType: 'active' });

        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            throw error; // Le DataTable gérera l'affichage de l'erreur dans la cellule
        }
    };

    const handleSubmitFaculty = (data: CreateFacultyData | UpdateFacultyData) => {
        if (editingItem && 'faculty_name' in editingItem) {
            updateFacultyMutation.mutate(
                { id: editingItem.id, data: data as UpdateFacultyData },
                {
                    onSuccess: () => {
                        handleCloseModal();
                        refetchFaculties();
                    },
                    onError: (err: any) => {
                        const apiError = err.formattedError as ApiError;
                        setError(apiError?.message || 'Erreur lors de la modification');
                    }
                }
            );
        } else {
            createFacultyMutation.mutate(data as CreateFacultyData, {
                onSuccess: () => {
                    handleCloseModal();
                    refetchFaculties();
                },
                onError: (err: any) => {
                    const apiError = err.formattedError as ApiError;
                    setError(apiError?.message || 'Erreur lors de la création');
                }
            });
        }
    };

    const handleSubmitDepartment = (data: CreateDepartmentData | UpdateDepartmentData) => {
        if (editingItem && 'department_name' in editingItem) {
            updateDepartmentMutation.mutate(
                { id: editingItem.id, data: data as UpdateDepartmentData },
                {
                    onSuccess: () => {
                        handleCloseModal();
                        refetchDepartments();
                    },
                    onError: (err: any) => {
                        const apiError = err.formattedError as ApiError;
                        setError(apiError?.message || 'Erreur lors de la modification');
                    }
                }
            );
        } else {
            createDepartmentMutation.mutate(data as CreateDepartmentData, {
                onSuccess: () => {
                    handleCloseModal();
                    refetchDepartments();
                },
                onError: (err: any) => {
                    const apiError = err.formattedError as ApiError;
                    setError(apiError?.message || 'Erreur lors de la création');
                }
            });
        }
    };

    const handleSubmitClass = (data: CreateClassData | UpdateClassData) => {
        if (editingItem && 'class_name' in editingItem) {
            updateClassMutation.mutate(
                { id: editingItem.id, data: data as UpdateClassData },
                {
                    onSuccess: () => {
                        handleCloseModal();
                        refetchClasses();
                    },
                    onError: (err: any) => {
                        const apiError = err.formattedError as ApiError;
                        setError(apiError?.message || 'Erreur lors de la modification');
                    }
                }
            );
        } else {
            createClassMutation.mutate(data as CreateClassData, {
                onSuccess: () => {
                    handleCloseModal();
                    refetchClasses();
                },
                onError: (err: any) => {
                    const apiError = err.formattedError as ApiError;
                    setError(apiError?.message || 'Erreur lors de la création');
                }
            });
        }
    };

    const handleSubmitModule = (data: CreateModuleData | UpdateModuleData) => {
        if (editingItem && 'module_name' in editingItem) {
            updateModuleMutation.mutate(
                { id: editingItem.id, data: data as UpdateModuleData },
                {
                    onSuccess: () => {
                        handleCloseModal();
                        refetchModules();
                    },
                    onError: (err: any) => {
                        const apiError = err.formattedError as ApiError;
                        setError(apiError?.message || 'Erreur lors de la modification');
                    }
                }
            );
        } else {
            createModuleMutation.mutate(data as CreateModuleData, {
                onSuccess: () => {
                    handleCloseModal();
                    refetchModules();
                },
                onError: (err: any) => {
                    const apiError = err.formattedError as ApiError;
                    setError(apiError?.message || 'Erreur lors de la création');
                }
            });
        }
    };

    const handleSubmitCourse = (data: CreateCourseData | UpdateCourseData) => {
        if (editingItem && 'course_name' in editingItem) {
            updateCourseMutation.mutate(
                { id: editingItem.id, data: data as UpdateCourseData },
                {
                    onSuccess: () => {
                        handleCloseModal();
                        refetchCourses();
                    },
                    onError: (err: any) => {
                        const apiError = err.formattedError as ApiError;
                        setError(apiError?.message || 'Erreur lors de la modification');
                    }
                }
            );
        } else {
            createCourseMutation.mutate(data as CreateCourseData, {
                onSuccess: () => {
                    handleCloseModal();
                    refetchCourses();
                },
                onError: (err: any) => {
                    const apiError = err.formattedError as ApiError;
                    setError(apiError?.message || 'Erreur lors de la création');
                }
            });
        }
    };

    const handleDelete = (item: Faculty | Department | Class | Module | Course) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) return;

        const onError = (err: any) => {
            const apiError = err.formattedError as ApiError;
            setError(apiError?.message || 'Erreur lors de la suppression');
        };

        switch (activeTab) {
            case 'faculty':
                deleteFacultyMutation.mutate(item.id, { onError });
                break;
            case 'department':
                deleteDepartmentMutation.mutate(item.id, { onError });
                break;
            case 'class':
                deleteClassMutation.mutate(item.id, { onError });
                break;
            case 'module':
                deleteModuleMutation.mutate(item.id, { onError });
                break;
            case 'course':
                deleteCourseMutation.mutate(item.id, { onError });
                break;
        }
    };

    const handleBulkAction = (action: string, selectedIds: Set<string>) => {
        if (action === 'delete') {
            if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} éléments ?`)) return;

            const onError = (err: any) => {
                const apiError = err.formattedError as ApiError;
                setError(apiError?.message || 'Erreur lors de la suppression');
            };

            selectedIds.forEach(id => {
                switch (activeTab) {
                    case 'faculty':
                        deleteFacultyMutation.mutate(id, { onError });
                        break;
                    case 'department':
                        deleteDepartmentMutation.mutate(id, { onError });
                        break;
                    case 'class':
                        deleteClassMutation.mutate(id, { onError });
                        break;
                    case 'module':
                        deleteModuleMutation.mutate(id, { onError });
                        break;
                    case 'course':
                        deleteCourseMutation.mutate(id, { onError });
                        break;
                }
            });
        }
    };

    const getColumns = () => {
        switch (activeTab) {
            case 'faculty':
                return [
                    { key: "faculty_name", label: "Nom du programme", sortable: true, editable: true, type: "text" },
                    { key: "faculty_abreviation", label: "Abréviation", sortable: true, editable: true },
                    {
                        key: "types", label: "Type de formation", sortable: true, editable: true,
                        type: "select",
                        options: transform(typeFormations, {
                            value: "id",
                            label: "name"
                        }),
                        render: (row: Faculty) => row.types ? `${row.types.name} (${row.types.code})` : '-'
                    },
                    {
                        key: "university", label: "Université", sortable: true, editable: false
                        , render: (row: Faculty) => row.university ? `${row.university.university_name} (${row.university.university_abrev})` : '-'


                    },
                    {
                        key: "country", label: "Pays d'orginine", sortable: true, editable: false
                        , render: (row: Faculty) => row.country_name ? `${row.country_name}` : '-'


                    }
                ];
            case 'department':
                return [
                    { key: "faculty", label: "Programme", sortable: true, editable: false, render: (row: Department) => row.faculty?.faculty_name || 'N/A' },
                    { key: "department_name", label: "Nom", sortable: true, editable: true, type: "text" },
                    { key: "abreviation", label: "Abréviation", sortable: true, editable: true, type: "text" },
                ];
            case 'class':
                return [
                    { key: "class_name", label: "Nom", sortable: true, editable: true, type: "text" },
                    { key: "department", label: "Département", sortable: true, editable: false, render: (row: Class) => row.department?.department_name || 'N/A' },
                    { key: "faculty", label: "Programme", sortable: true, editable: false, render: (row: Class) => row.department?.faculty?.faculty_name || 'N/A' },
                    { key: "groups", label: "Groupes", sortable: false, editable: false, render: (row: Class) => row.groups?.length || 0 },
                ];
            case 'module':
                return [
                    { key: "module_name", label: "Nom", sortable: true, editable: true, type: "text" },
                    { key: "code", label: "Code", sortable: true, editable: true, type: "text" },
                    { key: "class_fk", label: "Classe", sortable: true, editable: false, render: (row: Module) => typeof row.class_fk === 'object' ? row.class_fk.class_name : 'N/A' },
                    { key: "semester_id", label: "Semestre", sortable: true, editable: false, render: (row: Module) => `Semestre ${row.semester.name}` },
                    { key: "total_credits", label: "credits", sortable: true, editable: false, render: (row: Module) => `${row.total_credits}` },
                ];
            case 'course':
                return [
                    { key: "course_name", label: "Nom du cours", sortable: true, editable: true, type: "text" },
                    { key: "module", label: "Module", sortable: true, editable: false, render: (row: Course) => typeof row.module === 'object' ? row.module.module_name || 'N/A' : 'N/A' },
                    { key: "cm", label: "CM (h)", sortable: true, editable: true, type: "number" },
                    { key: "td", label: "TD (h)", sortable: true, editable: true, type: "number" },
                    { key: "tp", label: "TP (h)", sortable: true, editable: true, type: "number" },
                    { key: "credits", label: "Crédits", sortable: true, editable: true, type: "number" },
                ];
            default:
                return [];
        }
    };

    const getModalTitle = () => {
        const action = editingItem ? 'Modifier' : 'Créer';
        switch (activeTab) {
            case 'faculty':
                return `${action} un programme`;
            case 'department':
                return `${action} un département`;
            case 'class':
                return `${action} une classe`;
            case 'module':
                return `${action} un module`;
            case 'course':
                return `${action} un cours`;
            default:
                return '';
        }
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'faculty':
                return (
                    <FacultyForm
                        faculty={editingItem as Faculty | undefined}
                        onSubmit={handleSubmitFaculty}
                        onCancel={handleCloseModal}
                        isLoading={createFacultyMutation.isPending || updateFacultyMutation.isPending}
                    />
                );
            case 'department':
                return (
                    <DepartmentForm
                        department={editingItem as Department | undefined}
                        onSubmit={handleSubmitDepartment}
                        onCancel={handleCloseModal}
                        isLoading={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}
                    />
                );
            case 'class':
                return (
                    <ClassFormWithGroups
                        classData={editingItem as Class | undefined}
                        onSubmit={handleSubmitClass}
                        onCancel={handleCloseModal}
                        isLoading={createClassMutation.isPending || updateClassMutation.isPending}
                    />
                );
            case 'module':
                return (
                    <ModuleForm
                        moduleData={editingItem as Module | undefined}
                        onSubmit={handleSubmitModule}
                        onCancel={handleCloseModal}
                        isLoading={createModuleMutation.isPending || updateModuleMutation.isPending}
                    />
                );
            case 'course':
                return (
                    <CourseForm
                        course={editingItem as Course | undefined}
                        onSubmit={handleSubmitCourse}
                        onCancel={handleCloseModal}
                        isLoading={createCourseMutation.isPending || updateCourseMutation.isPending}
                    />
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'faculty' as EntityType, label: 'Programmes' },
        { id: 'department' as EntityType, label: 'Départements' },
        { id: 'class' as EntityType, label: 'Classes' },
        { id: 'module' as EntityType, label: 'Modules' },
        { id: 'course' as EntityType, label: 'Cours' },
    ];

    return (
        <div className="w-full max-w-full overflow-hidden">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">

            </h1>
            <PageHeader
                title="  Gestion des Programmes Universitaires"
                rightElement={
                    <div className="mb-4 flex gap-2 flex-wrap">
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Créer
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Actualiser
                        </button>

                    </div>
                }
            />
            {error && (
                <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                    Effacer l'erreur
                </button>
            )}
            {/* Tabs */}
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const getCount = () => {
                            switch (tab.id) {
                                case 'faculty':
                                    return facultiesData?.count || 0;
                                case 'department':
                                    return departmentsData?.count || 0;
                                case 'class':
                                    return classesData?.count || 0;
                                case 'module':
                                    return modulesData?.count || 0;
                                case 'course':
                                    return coursesData?.count || 0;
                                default:
                                    return 0;
                            }
                        };

                        const count = getCount();

                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setCurrentPage(1);
                                    setSearchTerm("");
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
                                <span className={`
                                        inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full
                                        ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                    }
                                    `}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Actions */}


            {/* Statistics */}
            <EntityStatistics entityType={activeTab} />

            {/* DataTable */}
            <DataTable
                key={activeTab}
                tableId={`academic-${activeTab}`}
                columns={getColumns() as any}
                data={getCurrentData()}
                isPaginated={true}
                getRowId={(row: any) => row.id}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                onSearchChange={setSearchTerm}
                isLoading={isLoading()}
                error={error}
                onBackendFiltersChange={setbackendFilter}
                onBulkAction={handleBulkAction}
                onDeleteRow={handleDelete}
                onEditRow={handleEdit}
                onCellEdit={handleCellEdit}
                enableDragDrop={false}
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={getModalTitle()}
            >
                {renderForm()}
            </Modal>
        </div>

    );
}
