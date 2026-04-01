import { DirectorAcademicDashboard } from '@/modules/director-academic/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/director-academic/dashboard')({
  component: DirectorAcademicDashboard,
})

