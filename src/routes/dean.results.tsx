import { AcademicResultsPage } from '@/modules/doyen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/results')({
  component: AcademicResultsPage,
})
