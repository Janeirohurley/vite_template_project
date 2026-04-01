// src/hooks/useModal.ts
import { useState } from "react";

export function useModal() {
    const [isOpen, setOpen] = useState(false);
    const open = () => setOpen(true);
    const close = () => setOpen(false);
    const toggle = () => setOpen((prev) => !prev);

    return { isOpen, open, close, toggle };
}
