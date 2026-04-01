// src/hooks/useForm.ts
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useForm<T extends Record<string, any>>(initialValues: T) {
    const [values, setValues] = useState<T>(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const reset = () => setValues(initialValues);

    return { values, handleChange, reset };
}
