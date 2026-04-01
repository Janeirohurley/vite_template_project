
export interface FeesSheet {
    id: string;
    base_amount: number;
    class_info?: {
        id: string,
        class_name: string,
        faculty_name: string,
        department_name: string
    };
    department_info?: {
        id: string,
        department_name: string
    };
    faculty_info?: {
        id: string,
        faculty_name: string
    };
    wording_info?: wording
}


export interface CreateFeesSheets {
    class_fk: string;
    department: string;
    faculty: string;
    academic_year: string;
    wording: string;
    base_amount: number
}

export interface wording {
    id: string,
    wording_name: string
}