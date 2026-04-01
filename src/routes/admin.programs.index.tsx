import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/programs/')({
    component: () => <Navigate to="/admin/programs/list" />
})
