import { DoyenLayout } from '@/modules/doyen/layout/DoyenLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dean')({
    component: DoyenLayoutWrapper,
});

function DoyenLayoutWrapper() {
return(
    <DoyenLayout>
        <Outlet/>
    </DoyenLayout>
)
}