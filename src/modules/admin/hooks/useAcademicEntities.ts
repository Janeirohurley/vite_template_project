// src/hooks/useAcademic.ts (ou le nom que tu veux)
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import * as api from '../api';
import type {
    TypeFormation,
    Faculty,
    Department,
    Class,
    ClassGroup,
    Module,
    Course,
    AcademicYear,
    CreateTypeFormationData,
    CreateFacultyData,
    CreateDepartmentData,
    CreateClassData,
    CreateClassGroupData,
    CreateModuleData,
    CreateCourseData,
    CreateAcademicYearData,
    UpdateTypeFormationData,
    UpdateFacultyData,
    UpdateDepartmentData,
    UpdateClassData,
    UpdateClassGroupData,
    UpdateModuleData,
    UpdateCourseData,
    UpdateAcademicYearData,
} from '../types';
import type { QueryParams } from '@/types';

// ============================================================================
// TYPE FORMATION
// ============================================================================
export const useTypeFormations = (params?:QueryParams) =>
    useQuery({
        queryKey: ['typeFormations', params],
        queryFn: () => api.getTypeFormationsApi(params),
    });

export const useCreateTypeFormation = () => {
    const qc = useQueryClient();
    return useMutation<TypeFormation, Error, CreateTypeFormationData>({
        mutationFn: api.createTypeFormationApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['typeFormations'] }),
    });
};

export const useUpdateTypeFormation = () => {
    const qc = useQueryClient();
    return useMutation<TypeFormation, Error, { id: string; data: UpdateTypeFormationData }>({
        mutationFn: ({ id, data }) => api.updateTypeFormationApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['typeFormations'] }),
    });
};

export const useDeleteTypeFormation = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteTypeFormationApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['typeFormations'] }),
    });
};

// ============================================================================
// FACULTY
// ============================================================================
export const useFaculties = (params?:QueryParams) =>
    useQuery({
        queryKey: ['faculties', params],
        queryFn: () => api.getFacultiesApi(params),
    });

export const useCreateFaculty = () => {
    const qc = useQueryClient();
    return useMutation<Faculty, Error, CreateFacultyData>({
        mutationFn: api.createFacultyApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['faculties'] }),
    });
};

export const useUpdateFaculty = () => {
    const qc = useQueryClient();
    return useMutation<Faculty, Error, { id: string; data: UpdateFacultyData }>({
        mutationFn: ({ id, data }) => api.updateFacultyApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['faculties'] }),
    });
};

export const useDeleteFaculty = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteFacultyApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['faculties'] });
            qc.invalidateQueries({ queryKey: ['departments'] });
        },
    });
};

// ============================================================================
// DEPARTMENT
// ============================================================================
export const useDepartments = (params?: QueryParams) =>
    useQuery({
        queryKey: ['departments', params],
        queryFn: () => api.getDepartmentsApi(params),
    });

export const useCreateDepartment = () => {
    const qc = useQueryClient();
    return useMutation<Department, Error, CreateDepartmentData>({
        mutationFn: api.createDepartmentApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['departments'] });
            qc.invalidateQueries({ queryKey: ['faculties'] });
        },
    });
};

export const useUpdateDepartment = () => {
    const qc = useQueryClient();
    return useMutation<Department, Error, { id: string; data: UpdateDepartmentData }>({
        mutationFn: ({ id, data }) => api.updateDepartmentApi(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['departments'] });
            qc.invalidateQueries({ queryKey: ['faculties'] });
        },
    });
};

export const useDeleteDepartment = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteDepartmentApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['departments'] });
            qc.invalidateQueries({ queryKey: ['classes'] });
            qc.invalidateQueries({ queryKey: ['faculties'] });
        },
    });
};

// ============================================================================
// CLASS
// ============================================================================
export const useClasses = (params?: QueryParams) =>
    useQuery({
        queryKey: ['classes', params],
        queryFn: () => api.getClassesApi(params),
    });

export const useCreateClass = () => {
    const qc = useQueryClient();
    return useMutation<Class, Error, CreateClassData>({
        mutationFn: api.createClassApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classes'] });
            qc.invalidateQueries({ queryKey: ['departments'] });
        },
    });
};

export const useUpdateClass = () => {
    const qc = useQueryClient();
    return useMutation<Class, Error, { id: string; data: UpdateClassData }>({
        mutationFn: ({ id, data }) => api.updateClassApi(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classes'] });
            qc.invalidateQueries({ queryKey: ['departments'] });
        },
    });
};

export const useDeleteClass = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteClassApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classes'] });
            qc.invalidateQueries({ queryKey: ['modules'] });
            qc.invalidateQueries({ queryKey: ['departments'] });
        },
    });
};

// ============================================================================
// MODULE
// ============================================================================
export const useModules = (params?: QueryParams) =>
    useQuery({
        queryKey: ['modules', params],
        queryFn: () => api.getModulesApi(params),
    });

export const useCreateModule = () => {
    const qc = useQueryClient();
    return useMutation<Module, Error, CreateModuleData>({
        mutationFn: api.createModuleApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['modules'] });
            qc.invalidateQueries({ queryKey: ['classes'] });
        },
    });
};

export const useUpdateModule = () => {
    const qc = useQueryClient();
    return useMutation<Module, Error, { id: string; data: UpdateModuleData }>({
        mutationFn: ({ id, data }) => api.updateModuleApi(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['modules'] });
            qc.invalidateQueries({ queryKey: ['classes'] });
        },
    });
};

export const useDeleteModule = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteModuleApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['modules'] });
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['classes'] });
        },
    });
};

// ============================================================================
// COURSE
// ============================================================================
export const useCourses = (params?: QueryParams) =>
    useQuery({
        queryKey: ['courses', params],
        queryFn: () => api.getCoursesApi(params),
    });

export const useCreateCourse = () => {
    const qc = useQueryClient();
    return useMutation<Course, Error, CreateCourseData>({
        mutationFn: api.createCourseApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

export const useUpdateCourse = () => {
    const qc = useQueryClient();
    return useMutation<Course, Error, { id: string; data: UpdateCourseData }>({
        mutationFn: ({ id, data }) => api.updateCourseApi(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

export const useDeleteCourse = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteCourseApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

// ============================================================================
// ACADEMIC YEAR
// ============================================================================
export const useAcademicYears = (params?: QueryParams) => {
    const { syncSelectedAcademicYear } = useAppStore();
    
    const query = useQuery({
        queryKey: ['academicYears', params],
        queryFn: () => api.getAcademicYearsApi(params),
    });
    
    // Synchroniser avec le store quand les données changent
    useEffect(() => {
        if (query.data?.results) {
            syncSelectedAcademicYear(query.data.results);
        }
    }, [query.data?.results, syncSelectedAcademicYear]);
    
    return query;
};

export const useCurrentAcademicYear = () =>
    useQuery({
        queryKey: ['currentAcademicYear'],
        queryFn: api.getCurrentAcademicYearApi,
    });

export const useCreateAcademicYear = () => {
    const qc = useQueryClient();
    return useMutation<AcademicYear, Error, CreateAcademicYearData>({
        mutationFn: api.createAcademicYearApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['academicYears'] });
            qc.invalidateQueries({ queryKey: ['currentAcademicYear'] });
        },
    });
};

export const useUpdateAcademicYear = () => {
    const qc = useQueryClient();
    return useMutation<AcademicYear, Error, { id: string; data: UpdateAcademicYearData }>({
        mutationFn: ({ id, data }) => api.updateAcademicYearApi(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['academicYears'] });
            qc.invalidateQueries({ queryKey: ['currentAcademicYear'] });
        },
    });
};

export const useDeleteAcademicYear = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteAcademicYearApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['academicYears'] });
            qc.invalidateQueries({ queryKey: ['currentAcademicYear'] });
        },
    });
};

// ============================================================================
// SEMESTER
// ============================================================================
export const useSemesters = (params?: QueryParams) =>
    useQuery({
        queryKey: ['semesters', params],
        queryFn: () => api.getSemestersApi(params),
    });

// ============================================================================
// CLASS GROUP
// ============================================================================
export const useClassGroups = (params?: QueryParams) =>
    useQuery({
        queryKey: ['classGroups', params],
        queryFn: () => api.getClassGroupsApi(params),
    });

export const useClassGroupsByClass = (classId: string) =>
    useQuery({
        queryKey: ['classGroups', classId],
        queryFn: () => api.getClassGroupsByClassApi(classId),
        enabled: !!classId,
    });

export const useCreateClassGroup = () => {
    const qc = useQueryClient();
    return useMutation<ClassGroup, Error, CreateClassGroupData>({
        mutationFn: api.createClassGroupApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classGroups'] });
            qc.invalidateQueries({ queryKey: ['classes'] });
        },
    });
};

export const useUpdateClassGroup = () => {
    const qc = useQueryClient();
    return useMutation<ClassGroup, Error, { id: string; data: UpdateClassGroupData }>({
        mutationFn: ({ id, data }) => api.updateClassGroupApi(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classGroups'] });
            qc.invalidateQueries({ queryKey: ['classes'] });
        },
    });
};

export const useDeleteClassGroup = () => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteClassGroupApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classGroups'] });
            qc.invalidateQueries({ queryKey: ['classes'] });
        },
    });
};


// ============================================================================
// ROOM
// ============================================================================
export const useRooms = (params?: QueryParams) =>
    useQuery({
        queryKey: ['rooms', params],
        queryFn: () => api.getRoomsApi(params),
    });

export const useCreateRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.createRoomApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
};

export const useUpdateRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: never }) => api.updateRoomApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
};

export const useDeleteRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.deleteRoomApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
};
