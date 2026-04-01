
import academicAxios from './axiosAcademic';
import type { DjangoSuccessResponse, QueryParams } from '@/types/api';
import type {
    TypeFormation,
    Faculty,
    Department,
    Class,
    ClassGroup,
    AcademicYear,
    Semester,
    Module,
    Course,
    Room,
    CreateTypeFormationData,
    CreateFacultyData,
    CreateDepartmentData,
    CreateClassData,
    CreateClassGroupData,
    CreateModuleData,
    CreateCourseData,
    CreateAcademicYearData,
    CreateRoomData,
    UpdateTypeFormationData,
    UpdateFacultyData,
    UpdateDepartmentData,
    UpdateClassData,
    UpdateClassGroupData,
    UpdateModuleData,
    UpdateCourseData,
    UpdateAcademicYearData,
    UpdateRoomData,
} from '../types/academicTypes';
import { getListApi } from '@/api/getListApi';


// ============================================================================
// TYPE FORMATION API
// ============================================================================


export const getTypeFormationsApi = (params?: QueryParams) => getListApi<TypeFormation>(academicAxios, "/typeformations/", params);

export const getTypeFormationByIdApi = async (id: string): Promise<TypeFormation> =>
    (await academicAxios.get<DjangoSuccessResponse<TypeFormation>>(`/typeformations/${id}`)).data.data;

export const createTypeFormationApi = async (data: CreateTypeFormationData): Promise<TypeFormation> =>
    (await academicAxios.post<DjangoSuccessResponse<TypeFormation>>('/typeformations/', data)).data.data;

export const updateTypeFormationApi = async (id: string, data: UpdateTypeFormationData): Promise<TypeFormation> =>
    (await academicAxios.patch<DjangoSuccessResponse<TypeFormation>>(`/typeformations/${id}`, data)).data.data;

export const deleteTypeFormationApi = async (id: string): Promise<void> =>
    await academicAxios.delete(`/typeformations/${id}`);

// ============================================================================
// FACULTY API - CORRIGÉE & UNIQUE
// ============================================================================


export const getFacultiesApi = (params?: QueryParams) => getListApi<Faculty>(academicAxios, "/faculties/", params);

export const getFacultyByIdApi = async (id: string): Promise<Faculty> =>
    (await academicAxios.get<DjangoSuccessResponse<Faculty>>(`/faculties/${id}`)).data.data;

export const createFacultyApi = async (data: CreateFacultyData): Promise<Faculty> =>
    (await academicAxios.post<DjangoSuccessResponse<Faculty>>('/faculties/', data)).data.data;

export const updateFacultyApi = async (id: string, data: UpdateFacultyData): Promise<Faculty> =>
    (await academicAxios.patch<DjangoSuccessResponse<Faculty>>(`/faculties/${id}`, data)).data.data;

export const deleteFacultyApi = async (id: string): Promise<void> =>
    await academicAxios.delete(`/faculties/${id}`);

export const bulkDeleteFacultiesApi = async (ids: string[]): Promise<void> =>
    await academicAxios.post('/faculties/bulk-delete/', { ids });

// ============================================================================
// DEPARTMENT API
// ============================================================================


export const getDepartmentsApi = (params?: QueryParams) => getListApi<Department>(academicAxios, "/departments/", params);
export const getDepartmentByIdApi = async (id: string): Promise<Department> =>
    (await academicAxios.get<DjangoSuccessResponse<Department>>(`/departments/${id}`)).data.data;

export const createDepartmentApi = async (data: CreateDepartmentData): Promise<Department> =>
    (await academicAxios.post<DjangoSuccessResponse<Department>>('/departments/', data)).data.data;

export const updateDepartmentApi = async (id: string, data: UpdateDepartmentData): Promise<Department> =>
    (await academicAxios.patch<DjangoSuccessResponse<Department>>(`/departments/${id}`, data)).data.data;

export const deleteDepartmentApi = async (id: string): Promise<void> =>
    await academicAxios.delete(`/departments/${id}`);

export const bulkDeleteDepartmentsApi = async (ids: string[]): Promise<void> =>
    await academicAxios.post('/departments/bulk-delete/', { ids });

// ============================================================================
// CLASS, MODULE, COURSE → même pattern (je les raccourcis ici pour lisibilité)
// ============================================================================

// CLASS

export const getClassesApi = (params?: QueryParams) => getListApi<Class>(academicAxios, "/classes/", params);
export const getClassByIdApi = async (id: string): Promise<Class> => (await academicAxios.get<DjangoSuccessResponse<Class>>(`/classes/${id}`)).data.data;
export const createClassApi = async (data: CreateClassData): Promise<Class> => (await academicAxios.post<DjangoSuccessResponse<Class>>('/classes/', data)).data.data;
export const updateClassApi = async (id: string, data: UpdateClassData): Promise<Class> => (await academicAxios.patch<DjangoSuccessResponse<Class>>(`/classes/${id}`, data)).data.data;
export const deleteClassApi = async (id: string): Promise<void> => await academicAxios.delete(`/classes/${id}`);
export const bulkDeleteClassesApi = async (ids: string[]): Promise<void> => await academicAxios.post('/classes/bulk-delete/', { ids });

// MODULE


export const getModulesApi = (params?: QueryParams) => getListApi<Module>(academicAxios, "/modules/", params)
export const getModuleByIdApi = async (id: string): Promise<Module> => (await academicAxios.get<DjangoSuccessResponse<Module>>(`/modules/${id}`)).data.data;
export const createModuleApi = async (data: CreateModuleData): Promise<Module> => (await academicAxios.post<DjangoSuccessResponse<Module>>('/modules/', data)).data.data;
export const updateModuleApi = async (id: string, data: UpdateModuleData): Promise<Module> => (await academicAxios.patch<DjangoSuccessResponse<Module>>(`/modules/${id}`, data)).data.data;
export const deleteModuleApi = async (id: string): Promise<void> => await academicAxios.delete(`/modules/${id}`);
export const bulkDeleteModulesApi = async (ids: string[]): Promise<void> => await academicAxios.post('/modules/bulk-delete/', { ids });

// COURSE

export const getCoursesApi = (params?: QueryParams) => getListApi<Course>(academicAxios, "/courses/",  params)
export const getCourseByIdApi = async (id: string): Promise<Course> => (await academicAxios.get<DjangoSuccessResponse<Course>>(`/courses/${id}`)).data.data;
export const createCourseApi = async (data: CreateCourseData): Promise<Course> => (await academicAxios.post<DjangoSuccessResponse<Course>>('/courses/', data)).data.data;
export const updateCourseApi = async (id: string, data: UpdateCourseData): Promise<Course> => (await academicAxios.patch<DjangoSuccessResponse<Course>>(`/courses/${id}`, data)).data.data;
export const deleteCourseApi = async (id: string): Promise<void> => await academicAxios.delete(`/courses/${id}`);
export const bulkDeleteCoursesApi = async (ids: string[]): Promise<void> => await academicAxios.post('/courses/bulk-delete/', { ids });

// ============================================================================
// ACADEMIC YEAR API
// ============================================================================


export const getAcademicYearsApi = (params?: QueryParams) => getListApi<AcademicYear>(academicAxios, "/academic-years/", params)

export const getCurrentAcademicYearApi = async (): Promise<AcademicYear> => (await academicAxios.get<DjangoSuccessResponse<AcademicYear>>('/academic-years/current/')).data.data;
export const getAcademicYearByIdApi = async (id: string): Promise<AcademicYear> => (await academicAxios.get<DjangoSuccessResponse<AcademicYear>>(`/academic-years/${id} /`)).data.data;
export const createAcademicYearApi = async (data: CreateAcademicYearData): Promise<AcademicYear> => (await academicAxios.post<DjangoSuccessResponse<AcademicYear>>('/academic-years/', data)).data.data;
export const updateAcademicYearApi = async (id: string, data: UpdateAcademicYearData): Promise<AcademicYear> => (await academicAxios.patch<DjangoSuccessResponse<AcademicYear>>(`/academic-years/${id}/`, data)).data.data;
export const deleteAcademicYearApi = async (id: string): Promise<void> => await academicAxios.delete(`/academic-years/${id}/`);
export const bulkDeleteAcademicYearsApi = async (ids: string[]): Promise<void> => await academicAxios.post('/academic-years/bulk-delete/', { ids });

// ============================================================================
// SEMESTER API
// ============================================================================

export const getSemestersApi = (params?: QueryParams) => getListApi<Semester>(academicAxios, "/semesters/", params )
export const getSemesterByIdApi = async (id: string): Promise<Semester> => (await academicAxios.get<DjangoSuccessResponse<Semester>>(`/semesters/${id}`)).data.data;

// ============================================================================
// CLASS GROUP API
// ============================================================================

export const getClassGroupsApi = (params?: QueryParams) => getListApi<ClassGroup>(academicAxios, "/class-groups/",  params )
export const getClassGroupsByClassApi = async (classId: string): Promise<ClassGroup[]> => (await academicAxios.get<DjangoSuccessResponse<ClassGroup[]>>(`/classes/${classId}/groups/`)).data.data;
export const getClassGroupByIdApi = async (id: string): Promise<ClassGroup> => (await academicAxios.get<DjangoSuccessResponse<ClassGroup>>(`/class-groups/${id}`)).data.data;
export const createClassGroupApi = async (data: CreateClassGroupData): Promise<ClassGroup> => (await academicAxios.post<DjangoSuccessResponse<ClassGroup>>('/class-groups/', data)).data.data;
export const updateClassGroupApi = async (id: string, data: UpdateClassGroupData): Promise<ClassGroup> => (await academicAxios.patch<DjangoSuccessResponse<ClassGroup>>(`/class-groups/${id}`, data)).data.data;
export const deleteClassGroupApi = async (id: string): Promise<void> => await academicAxios.delete(`/class-groups/${id}`);
export const bulkDeleteClassGroupsApi = async (ids: string[]): Promise<void> => await academicAxios.post('/class-groups/bulk-delete/', { ids });

// ============================================================================
// ROOM API
// ============================================================================

export const getRoomsApi = (params?: QueryParams) => getListApi<Room>(academicAxios, "/infrastructure/rooms/", params);
export const getRoomByIdApi = async (id: string): Promise<Room> => (await academicAxios.get<DjangoSuccessResponse<Room>>(`/infrastructure/rooms/${id}`)).data.data;
export const createRoomApi = async (data: CreateRoomData): Promise<Room> => (await academicAxios.post<DjangoSuccessResponse<Room>>('/infrastructure/rooms/', data)).data.data;
export const updateRoomApi = async (id: string, data: UpdateRoomData): Promise<Room> => (await academicAxios.patch<DjangoSuccessResponse<Room>>(`/infrastructure/rooms/${id}`, data)).data.data;
export const deleteRoomApi = async (id: string): Promise<void> => await academicAxios.delete(`/infrastructure/rooms/${id}`);
export const bulkDeleteRoomsApi = async (ids: string[]): Promise<void> => await academicAxios.post('/infrastructure/rooms/bulk-delete/', { ids });

