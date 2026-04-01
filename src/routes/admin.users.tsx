import { UsersManagementPage } from "@/modules/admin/pages/UsersManagementPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/admin/users')({
    component: UsersManagementPage,
}) 