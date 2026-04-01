import InfrastructurePage from '@/modules/admin/pages/InfrastructurePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/infrastructure')({
    component: InfrastructurePage,
})
