import { JuryManagementPage } from '@/modules/doyen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/deliberations')({
  component: JuryManagementPage,
})
