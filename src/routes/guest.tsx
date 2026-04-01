import { GuestLayout } from '@/modules/guest'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/guest')({
    component: GuestLayoutWrapper,
})

function GuestLayoutWrapper() {
    return (
        <GuestLayout   >
            <Outlet />
        </GuestLayout>
    )
}