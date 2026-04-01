// src/lib/formUtils.ts
export const toFormData = (obj: Record<string, never>): FormData => {
    const form = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
        if (v !== undefined && v !== null) form.append(k, v as never);
    });
    return form;
};
