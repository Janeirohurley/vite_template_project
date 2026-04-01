import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/director-academic/')({
    component: () => <Navigate to="/director-academic/dashboard" />,
})
