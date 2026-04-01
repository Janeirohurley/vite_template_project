export interface Wordings {
    id: string;
    wording_name: string,
    academic_year?: string,
}

export type CreateWordingPayload = Omit<Wordings, "id">;