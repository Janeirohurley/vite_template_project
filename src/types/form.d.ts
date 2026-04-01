// src/types/form.d.ts
import type { ZodTypeAny } from "zod";

/**
 * Structure d’un champ de formulaire générique
 */
export interface FormField {
    name: string;
    label: string;
    type: "text" | "select" | "number" | "date" | "checkbox" | "radio";
    required?: boolean;
    options?: { label: string; value: string | number }[];
    placeholder?: string;
    dependsOn?: string; // permet dépendance dynamique entre champs
}

/**
 * Formulaire basé sur un schéma Zod
 */
export interface FormSchema<T extends ZodTypeAny> {
    schema: T;
    defaultValues: Record<string, nver>;
}
