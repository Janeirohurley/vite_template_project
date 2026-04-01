import { DirectorAcadenicLayout } from '@/modules/director-academic/layout/DirectorAcadenicLayout';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/director-academic')({
    component: DirectorAcadenicLayoutWrapper,
})



function DirectorAcadenicLayoutWrapper() {
    return (
        <DirectorAcadenicLayout>  <Outlet /></DirectorAcadenicLayout>
    );
}