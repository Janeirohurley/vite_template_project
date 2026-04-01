import { AdminLayout } from "@/modules/admin/layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute('/admin')({
    component: AdminLayoutWrapper,
});

function AdminLayoutWrapper() {
    return (
        <AdminLayout>  <Outlet /></AdminLayout>
    );
}