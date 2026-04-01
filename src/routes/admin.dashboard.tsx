import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '@/modules/admin/pages'

export const Route = createFileRoute('/admin/dashboard')({
    component: AdminDashboard,
})


