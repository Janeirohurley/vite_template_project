import { useState, useEffect, useCallback } from "react";

export function useCollapse(
    key: string = "sidebarCollapsed",
    defaultValue: boolean = false
) {
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved !== null ? JSON.parse(saved) as boolean : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    const toggle = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(collapsed));
        } catch {
            // En cas d'erreur localStorage (mode privé, quota, etc.)
        }
    }, [collapsed, key]);

    return { collapsed, setCollapsed, toggle };
}
