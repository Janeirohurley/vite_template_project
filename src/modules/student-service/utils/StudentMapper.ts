import type { UserGender, UserMaritalStatus } from "@/types";
import type { Student } from "../types";

export interface StudentTabrow {
    id: string;
    profile_picture: string;
    matricule: string;
    first_name: string;
    last_name: string;
    marital_status: string;
    email: string;
    colline: string;
    cam: string | number;
    parent: string
    name: string
    gender: string
}

function getGender(gender: UserGender): string {
    let g = ""
    switch (gender) {
        case "F":
            g = "Feminin";
            break;
        case "M":
            g = "Masculin";
            break;

        case "O":
            g = "Autre";
            break;
    }
    return g
}

function StatusMarital(status: UserMaritalStatus): string {
    let g = ""
    switch (status) {
        case "S":
            g = "Celibataire";
            break;
        case "M":
            g = "Marie";
            break;

        case "W":
            g = "widow";
            break;
        case "D":
            g = "Divorce";
            break;
        case null:
            g = "-";
            break;

    }
    return g
}


export function mapStudentToTableRow(student: Student): StudentTabrow {
    return {
        id: student.id,
        profile_picture: student.user_obj.profile_picture ? student.user_obj.profile_picture : "-",
        matricule: student.matricule,
        first_name: student.user_obj.first_name,
        last_name: student.user_obj.last_name,
        marital_status: student.user_obj.marital_status ? StatusMarital(student.user_obj.marital_status) : "-",
        email: student.user_obj.email,
        colline: student.colline.colline_name,
        cam: student.cam ? student.cam : "-",
        parent: student.parent.map(p => p.parent_name).join(","),
        name: student.user_obj.first_name.concat(",", student.user_obj.last_name),
        gender: getGender(student.user_obj.gender)
    }
}
