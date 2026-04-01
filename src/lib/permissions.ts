// src/lib/permissions.ts
import type { UserRole as UserRoleType } from "@/types";

export const canAccess = (role: UserRoleType, resource: string): boolean => {
    const rules: Record<UserRoleType["name"], string[]> = {
        admin: ["*"],
        teacher: ["courses", "results"],
        student: ["results", "documents"],
        guest: [],
        staff: [],
        student_service:[]
    };

    const allowed = rules[role.name] || [];
    return allowed.includes("*") || allowed.includes(resource);
};
