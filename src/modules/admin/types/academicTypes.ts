

import type { Universite } from "@/types";

/**
 * Types pour les entités académiques du système universitaire
 * Parfaitement synchronisés avec les modèles Django (2025)
 */

export interface TypeFormation {
    id: string;
    name: string;
    code: string;
    description: string | null;
}

export interface TypeFormationTableRow extends TypeFormation {
    display: string;
}

// ========================================================================
// FACULTY
// ========================================================================
export interface Faculty {
    id: string;
    faculty_name: string;
    faculty_abreviation: string;
    types: TypeFormation;
    university: Universite;
    country_name: string;
    university_name?: string;
}

export interface CreateFacultyData {
    faculty_name: string;
    faculty_abreviation?: string | null;
    types_id: string;
    university?: string | null;
}

export type UpdateFacultyData = Partial<CreateFacultyData>;

export interface FacultyTableRow extends Faculty {
    type_formation_display: string;
    university_display: string;
}

// ========================================================================
// DEPARTMENT
// ========================================================================
export interface Department {
    id: string;
    department_name: string;
    abreviation: string;
    faculty: Faculty;

    // Propriétés dérivées pour l'affichage
    faculty_name?: string;
    faculty_id?: string;
}

export interface CreateDepartmentData {
    department_name: string;
    abreviation: string;
    faculty_id: string;
}

export type UpdateDepartmentData = Partial<CreateDepartmentData>;

export interface DepartmentTableRow extends Department {
    faculty_display: string;
}

// ========================================================================
// ACADEMIC YEAR
// ========================================================================
export interface AcademicYear {
    id: string;
    academic_year: string;
    description: string | null;
    civil_year: string;
    start_date: string;
    end_date: string;
    is_closed: boolean;
    is_current:boolean;
    closed_date: string | null;
    university: string;
    closed_by: string | null;
}

export interface CreateAcademicYearData {
    academic_year: string;
    description?: string | null;
    civil_year: string;
    start_date: string;
    end_date: string;
    university?: string;
}

export type UpdateAcademicYearData = Partial<CreateAcademicYearData>;

export interface AcademicYearTableRow extends AcademicYear {
    status_display: string;
    duration_display: string;
}
// ========================================================================
// SEMESTER
// ========================================================================
export interface Semester {
    id: string;
    number: number;
    name: string | null;
}

// ========================================================================
// CLASS
// ========================================================================
export interface Class {
    id: string;
    class_name: string;
    department: Department;

    // Propriétés dérivées pour l'affichage
    department_name?: string;
    department_id?: string;
    faculty_name?: string;
    groups?: ClassGroup[];
}

export interface CreateClassData {
    class_name: string;
    department_id: string;
}

export type UpdateClassData = Partial<CreateClassData>;

export interface ClassTableRow extends Class {
    department_display: string;
    faculty_display: string;
    groups_count?: number;
}

// ========================================================================
// CLASS GROUP
// ========================================================================
export interface ClassGroup {
    id: string;
    class_fk: Class;
    academic_year: AcademicYear;
    group_name: string;
    created_date: string;

    // Propriétés dérivées pour l'affichage
    class_name?: string;
    class_id?: string;
    academic_year_name?: string;
    academic_year_id?: string;
}

export interface CreateClassGroupData {
    class_fk: string;
    academic_year: string;
    group_name: string;
}

export type UpdateClassGroupData = Partial<CreateClassGroupData>;

export interface ClassGroupTableRow extends ClassGroup {
    class_display: string;
    academic_year_display: string;
}

// ========================================================================
// MODULE
// ========================================================================
export interface Module {
    id: string;
    class_fk: Class;
    module_name: string | null;
    code: string | null;
    semester: Semester;

    // Propriétés dérivées pour l'affichage
    class_name?: string;
    class_id?: string;
    department_name?: string;
    total_credits?: number;
}

export interface CreateModuleData {
    class_fk_id: string;
    module_name: string | null;
    code: string | null;
    semester_id: string;
}

export type UpdateModuleData = Partial<CreateModuleData>;

export interface ModuleTableRow extends Module {
    class_display: string;
    department_display: string;
    semester_display: string;
}

// ========================================================================
// COURSE
// ========================================================================
export interface Course {
    id: string;
    module: Module;
    course_name: string;
    cm: number;
    td: number;
    tp: number;
    credits: number;

    // Propriétés dérivées pour l'affichage
    module_name?: string;
    module_id?: string;
    semester_id?: string;
    class_name?: string;
}

export interface CreateCourseData {
    module_id: string;
    course_name: string;
    cm: number;
    td: number;
    tp: number;
    credits: number;
}

export type UpdateCourseData = Partial<CreateCourseData>;

export interface CourseTableRow extends Course {
    module_display: string;
    total_hours: number;
    credits_display: string;
}

// ========================================================================
// HIERARCHICAL ROW (Faculty → Departments → Classes → Modules)
// ========================================================================
export interface HierarchicalProgramRow {
    id: string;
    faculty_name: string;
    faculty_abreviation: string | null;
    department_name: string;
    department_abreviation: string;
    class_name: string;
    module_name: string | null;
    module_code: string | null;
    semester_id: string;
}

// ========================================================================
// TYPE FORMATION - CREATE / UPDATE
// ========================================================================
export type CreateTypeFormationData = Omit<TypeFormation, 'id'>;
export type UpdateTypeFormationData = Partial<CreateTypeFormationData>;

// ========================================================================
// OPTIONS & MAPPERS
// ========================================================================

// Mappers
export const mapTypeFormationToTableRow = (item: TypeFormation): TypeFormationTableRow => ({
    ...item,
    display: `${item.name} (${item.code})`,
});

export const mapFacultyToTableRow = (item: Faculty): FacultyTableRow => ({
    ...item,
    type_formation_display: item.types
        ? `${item.types.name} (${item.types.code})`
        : 'Non défini',
    university_display: item.university_name || 'Aucune université',
});

export const mapDepartmentToTableRow = (item: Department): DepartmentTableRow => ({
    ...item,
    faculty_display: item.faculty
        ? `${item.faculty.faculty_name}${item.faculty.faculty_abreviation ? ` (${item.faculty.faculty_abreviation})` : ''}`
        : 'Faculté inconnue',
});

export const mapClassToTableRow = (item: Class): ClassTableRow => ({
    ...item,
    department_display: item.department
        ? `${item.department.department_name} (${item.department.abreviation})`
        : 'Département inconnu',
    faculty_display: item.department?.faculty
        ? item.department.faculty.faculty_name
        : 'Faculté inconnue',
});

export const mapModuleToTableRow = (item: Module): ModuleTableRow => ({
    ...item,
    class_display: typeof item.class_fk === 'object' ? item.class_fk.class_name : 'Classe inconnue',
    department_display: typeof item.class_fk === 'object' && item.class_fk.department
        ? item.class_fk.department.department_name
        : 'Département inconnu',
    semester_display: `Semestre ${item.semester.name}`,
});

export const mapCourseToTableRow = (item: Course): CourseTableRow => {
    const totalHours = item.cm + item.td + item.tp;
    return {
        ...item,
        module_display: typeof item.module === 'object'
            ? item.module.module_name || 'Module inconnu'
            : 'Module inconnu',
        total_hours: totalHours,
        credits_display: `${item.credits} crédit${item.credits > 1 ? 's' : ''}`,
    };
};

export const mapAcademicYearToTableRow = (item: AcademicYear): AcademicYearTableRow => ({
    ...item,
    status_display: item.is_closed ? 'Fermée' : 'Ouverte',
    duration_display: `${item.start_date} - ${item.end_date}`,
});

// ========================================================================
// DEAN PROFILE
// ========================================================================
export interface DeanProfile {
    id: string;
    position: string;
    start_date: string;
    end_date: string;
    room: string;
    faculty: string;
    university: string;
    user: string;
    faculty_abreviation: string;
}

// ========================================================================
// ROOM
// ========================================================================
export interface Room {
    id: string;
    building: string;
    building_name: string;
    room_name: string;
    capacity: number;
    room_type: string;
    is_available: boolean;
}

export interface CreateRoomData {
    building: string;
    room_name: string;
    capacity: number;
    room_type: string;
    is_available?: boolean;
}

export type UpdateRoomData = Partial<CreateRoomData>;

// ========================================================================
// PROFILE
// ========================================================================
export interface Profile {
    id: string;
    user_id: string;
    position: string;
    start_date: string;
    end_date: string;
    room: string;
    faculty: string;
    university: string;
    faculty_abreviation: string;
}

export interface CreateProfileData {
    user_id: string;
    position: string;
    start_date: string;
    end_date: string;
    room: string;
    faculty: string;
}

export type UpdateProfileData = Partial<CreateProfileData>;
