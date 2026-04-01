import ProgramManagementDoyenPage from '@/modules/doyen/pages/ProgramManagementDoyenPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/programs')({
    component: ProgramManagementDoyenPage,
})

