import { StudentsManagementPage } from '@/modules/doyen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/students')({
  component: StudentsManagementPage,
})
