import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/guest/')({
    component: () => <Navigate to='/guest/dashboard' />,
})

