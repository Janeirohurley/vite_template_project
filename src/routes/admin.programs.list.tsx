import { ProgramManagementPage } from '@/modules/admin/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/programs/list')({
    component: ProgramManagementPage,
})
